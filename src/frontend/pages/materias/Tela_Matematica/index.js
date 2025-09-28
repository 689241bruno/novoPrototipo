import React, { useEffect, useState } from "react";
import { 
  SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Pressable, Image, 
  LayoutAnimation, UIManager, Platform, ScrollView, Modal, TextInput 
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import UsuarioService from "../../../services/UsuarioService";
import MenuBar from "../../../components/MenuBar";

// Habilita animação de layout no Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TelaLinguagens() {
  const route = useRoute();
  const navigation = useNavigation();
  const { materia } = route.params || { materia: "Linguagens" };
  const usuarioId = 1;

  const [materiais, setMateriais] = useState([]);
  const [expandedMaterias, setExpandedMaterias] = useState({});
  const [expandedThemes, setExpandedThemes] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [arquivoPdf, setArquivoPdf] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [tema, setTema] = useState("");

  const [open, setOpen] = useState(false);
  const [materiaSelecionada, setMateriaSelecionada] = useState(materia);
  const [materiasDisponiveis, setMateriasDisponiveis] = useState([
    { label: "Linguagens", value: "Linguagens" },
    { label: "Matemática", value: "Matematica" },
    { label: "Ciências da Natureza", value: "Ciencias da Natureza" },
    { label: "Ciências Humanas", value: "Ciencias Humanas" },
  ]);

  useEffect(() => {
    fetchMateriais();
  }, [materiaSelecionada]); 

  const fetchMateriais = async () => {
    try {
      const response = await UsuarioService.listarMaterias(materiaSelecionada, usuarioId);
      setMateriais(response?.data || []);
    } catch (err) {
      console.error("Erro ao buscar materiais:", err);
    }
  };

  const toggleTheme = (tema) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedThemes(prev => ({ ...prev, [tema]: !prev[tema] }));
  };

  const toggleMateria = (titulo) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedMaterias(prev => ({ ...prev, [titulo]: !prev[titulo] }));
  };

  const materiasAgrupadas = materiais.reduce((acc, item) => {
    if (!acc[item.titulo]) acc[item.titulo] = {};
    if (!acc[item.titulo][item.tema]) acc[item.titulo][item.tema] = [];
    acc[item.titulo][item.tema].push(item);
    return acc;
  }, {});

  const calcularProgresso = (atividades) => {
    if (!atividades || atividades.length === 0) return 0;
    const total = atividades.reduce((sum, item) => sum + (item.progresso || 0), 0);
    return Math.round(total / atividades.length);
  };

  const marcarAtividadeConcluida = async (item) => {
    try {
      await UsuarioService.atualizarProgresso(usuarioId, item.id, item.titulo, item.tema, 100);
      fetchMateriais();
    } catch (err) {
      console.error("Erro ao atualizar progresso:", err);
    }
  };

  const selecionarArquivo = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/pdf";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) setArquivoPdf({ uri: URL.createObjectURL(file), name: file.name, type: file.type });
      };
      input.click();
    } else {
      const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
      if (result.type === "success") {
        setArquivoPdf({ uri: result.uri, name: result.name, type: result.mimeType || "application/pdf" });
      }
    }
  };

  const enviarMaterial = async () => {
    if (!arquivoPdf || !titulo.trim() || !tema.trim()) {
      alert("Preencha todos os campos e selecione um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo.trim());
    formData.append("tema", tema.trim());
    formData.append("materia", materiaSelecionada);
    formData.append("criado_por", usuarioId);

    try {
      if (Platform.OS === "web") {
        const response = await fetch(arquivoPdf.uri);
        const blob = await response.blob();
        formData.append("arquivo", new File([blob], arquivoPdf.name, { type: arquivoPdf.type }));
      } else {
        formData.append("arquivo", { uri: arquivoPdf.uri, name: arquivoPdf.name, type: arquivoPdf.type });
      }

      const response = await UsuarioService.publicarMateriaFormData(formData);
      if (response.status === 200) {
        alert("Material enviado com sucesso!");
        setTitulo(""); setTema(""); setArquivoPdf(null); setModalVisible(false);
        fetchMateriais();
      } else {
        alert(response.data.erro || "Erro ao enviar material.");
      }
    } catch (err) {
      console.error("Erro ao enviar material:", err);
      alert("Erro ao enviar material. Verifique a conexão e o IP do servidor.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b4e91ff" }}>
      {/* Header */}
      <Animatable.View delay={300} animation="fadeInDown" style={styles.header}>
        <Pressable style={styles.botao}>
            <Image
                source={require("../../../assets/Conquests_Icon.png")}
                style={{ height: 50, width: 50 }}
            />
        </Pressable>
        <Image source={require("../../../assets/Macawdemy_Letreiro.png")} resizeMode="contain" style={styles.imagehH1} />
        <View style={styles.rightIcons}>
          <Pressable style={styles.botao} onPress={() => navigation.navigate("Perfil")}>
            <Image source={require("../../../assets/user.png")} style={{ height: "100%", width: "100%" }} />
            <View style={styles.userBadge}>
              <Image source={require("../../../assets/star.png")} style={{ height: 20, width: 20 }} />
              <Text style={styles.userBadgeText}>12</Text>
            </View>
          </Pressable>
        </View>
      </Animatable.View>

      {/* ScrollView com materiais */}
      <ScrollView contentContainerStyle={{ padding: 10, flexGrow: 1, paddingBottom: 120 }}>
        <View style={styles.mainContainer}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.containerTitle}>{materiaSelecionada}</Text>
          </View>

          {Object.keys(materiasAgrupadas).length === 0 ? (
            <Text style={styles.emptyText}>Nenhum material disponível</Text>
          ) : (
            Object.keys(materiasAgrupadas).map((materiaTitulo) => {
              const temas = materiasAgrupadas[materiaTitulo];
              const todasAtividades = Object.values(temas).flat();
              const progressoMateria = calcularProgresso(todasAtividades);

              return (
                <View key={materiaTitulo} style={styles.temaContainer}>
                  <TouchableOpacity
                    style={[styles.temaHeader, progressoMateria === 100 && styles.cardConcluida]}
                    onPress={() => toggleMateria(materiaTitulo)}
                  >
                    <Text style={[styles.materiaTitulo, progressoMateria === 100 && styles.textoConcluido]}>
                      {materiaTitulo}
                    </Text>
                    <MaterialIcons
                      name={expandedMaterias[materiaTitulo] ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                      size={24} color="black"
                    />
                  </TouchableOpacity>

                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                    <Text style={{ width: 40, fontWeight: "bold" }}>{progressoMateria}%</Text>
                    <View style={[styles.progressBarBackground, { flex: 1 }]}>
                      <View style={[styles.progressBarFill, { width: `${progressoMateria}%` }]} />
                    </View>
                  </View>

                  {expandedMaterias[materiaTitulo] &&
                    Object.keys(temas).map((tema) => {
                      const atividadesTema = temas[tema];
                      const progressoTema = calcularProgresso(atividadesTema);

                      return (
                        <View key={tema} style={[styles.temaContainer, { marginLeft: 0 }]}>
                          <TouchableOpacity
                            style={[styles.temaHeader, progressoTema === 100 && styles.cardConcluida]}
                            onPress={() => toggleTheme(tema)}
                          >
                            <Text style={[styles.temaTitulo, progressoTema === 100 && styles.textoConcluido]}>
                              {tema}
                            </Text>
                            <MaterialIcons
                              name={expandedThemes[tema] ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                              size={24} color="black"
                            />
                          </TouchableOpacity>

                          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                            <Text style={{ width: 40, fontWeight: "bold" }}>{progressoTema}%</Text>
                            <View style={[styles.progressBarBackground, { flex: 1 }]}>
                              <View style={[styles.progressBarFill, { width: `${progressoTema}%` }]} />
                            </View>
                          </View>

                          {expandedThemes[tema] &&
                            atividadesTema.map((item) => (
                              <TouchableOpacity
                                key={item.id}
                                style={[styles.cardActivity, item.progresso === 100 && styles.cardConcluida]}
                                onPress={() =>
                                  navigation.navigate("TelaPDF", {
                                    arquivoUrl: `http://localhost:3000/materias/pdf/${item.id}`,
                                    atividadeId: item.id,
                                    titulo: item.titulo,
                                    tema: item.tema,
                                    usuarioId,
                                    totalPaginas: 1,
                                  })
                                }
                                onLongPress={() => marcarAtividadeConcluida(item)}
                              >
                                <Text style={[styles.arquivo, item.progresso === 100 && styles.textoConcluido]}>
                                  {item.titulo}
                                </Text>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                  <Text style={{ width: 40, fontWeight: "bold" }}>{item.progresso}%</Text>
                                  <View style={[styles.progressBarBackground, { flex: 1 }]}>
                                    <View style={[styles.progressBarFill, { width: `${item.progresso}%` }]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            ))}
                        </View>
                      );
                    })}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Botão flutuante */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Text style={{ fontSize: 35, color: "#fff", marginBottom: 10 }}>+</Text>
      </TouchableOpacity>

      {/* Modal de envio */}
      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}> 
        <View style={styles.modalOverlay}> 
          <View style={[styles.modalContainer, { zIndex: 2000 }]}> 
            <View style={styles.modalHeader}> 
              <Text style={styles.modalTitle}>Enviar material</Text> 
              <TouchableOpacity onPress={() => setModalVisible(false)}> 
                <MaterialIcons name="close" size={24} color="black" /> 
              </TouchableOpacity> 
            </View> 

            <Text style={styles.label}>Matéria</Text> 
            <DropDownPicker 
              open={open} 
              value={materiaSelecionada} 
              items={materiasDisponiveis} 
              setOpen={setOpen} 
              setValue={setMateriaSelecionada} 
              setItems={setMateriasDisponiveis} 
              style={styles.input} 
              zIndex={3000}
              zIndexInverse={1000}
            /> 

            <Text style={styles.label}>Tema</Text> 
            <TextInput 
              style={styles.input} 
              value={tema} 
              onChangeText={setTema} 
              placeholder="Digite o tema" 
            /> 

            <Text style={styles.label}>Título</Text> 
            <TextInput 
              style={styles.input} 
              value={titulo} 
              onChangeText={setTitulo} 
              placeholder="Digite o título" 
            /> 

            <TouchableOpacity style={styles.fileButton} onPress={selecionarArquivo}> 
              <Text style={{ color: "#fff" }}>{arquivoPdf?.name || "Adicionar arquivo"}</Text> 
            </TouchableOpacity> 

            <TouchableOpacity style={styles.sendButton} onPress={enviarMaterial}> 
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text> 
            </TouchableOpacity> 
          </View> 
        </View> 
      </Modal>

      {/* MenuBar */}
      <View style={styles.menuBarContainer}>
        <MenuBar />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 15, paddingVertical: 5, backgroundColor: "#fff", elevation: 4, marginBottom: 10 },
  botaoVoltar: { position: "absolute", top: 10 },
  botao: { height: 40, width: 40, justifyContent: "center", alignItems: "center" },
  userBadge: { position: "absolute", height: 20, width: 20, bottom: 0, left: 0, alignItems: "center", justifyContent: "center" },
  userBadgeText: { fontWeight: "bold", color: "#FFF", fontSize: 8, top: 5, position: "absolute", alignSelf: "center" },
  emptyText: { fontSize: 16, color: "#555", textAlign: "center", marginTop: 20 },
  temaContainer: { marginBottom: 10, backgroundColor: "#fff", borderRadius: 12, padding: 10 },
  temaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 5 },
  temaTitulo: { fontSize: 18, fontWeight: "bold", color: "#333" },
  materiaTitulo: { fontSize: 20, fontWeight: "bold", color: "#0c4499", marginBottom: 5 },
  cardActivity: { backgroundColor: "#f0f4ff", borderRadius: 8, padding: 10, marginBottom: 10, flex: 1 },
  arquivo: { fontSize: 14, color: "#555", marginBottom: 5 },
  progressBarBackground: { height: 6, backgroundColor: "#ddd", borderRadius: 3, marginTop: 5, marginBottom: 10, flex: 1 },
  progressBarFill: { height: 6, backgroundColor: "#4CAF50", borderRadius: 3 },
  cardConcluida: { backgroundColor: "#C8E6C9" },
  textoConcluido: { color: "#2E7D32", fontWeight: "bold" },
  floatingButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#0c4499",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: "#fff", // contorno branco
  },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "85%", backgroundColor: "#fff", borderRadius: 10, padding: 20 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  label: { marginTop: 10, marginBottom: 5, fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 8, marginBottom: 10, zIndex: 1000 },
  fileButton: { backgroundColor: "#0c4499", borderRadius: 5, padding: 12, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  sendButton: { backgroundColor: "#4CAF50", borderRadius: 5, padding: 12, justifyContent: "center", alignItems: "center" },
  imagehH1: { width: 220, height: 80, marginBottom: 10 },
  menuBarContainer: { position: "absolute", bottom: 0, left: 0, right: 0, height: 70, borderTopWidth: 1, borderTopColor: "#ccc", zIndex: 1000, elevation: 10 },
  mainContainer: { flex: 1, margin: 10, padding: 10, borderRadius: 15, backgroundColor: "#ecececff" },
  containerTitle: { fontSize: 28, marginLeft: 35, marginTop: 4, marginBottom: 10, fontWeight: "bold", color: "#000" },
});
