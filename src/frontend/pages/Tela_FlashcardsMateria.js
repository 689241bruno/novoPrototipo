import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
  Dimensions,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Alert } from "react-native";
import TopNavbar from "../components/TopNavbar";
import MenuBar from "../components/MenuBar";
import FlashcardService from "../services/FlashcardService";
import AlunoService from "../services/AlunoService";

export default function FlashcardsMateria({ route, navigation }) {
  const { materia } = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [repeticoes, setRepeticoes] = useState(4);
  const [modoIntensivo, setModoIntensivo] = useState(false);
  const [alunoId, setAlunoId] = useState(null);
  const [abertoId, setAbertoId] = useState(null);

  const { height, width } = Dimensions.get("window");
  const larguraCard = (width - 15 * 3) / 2
  const alturaCardFechado = height * 0.2; 
  const alturaCardAberto = height * 0.5; 

  // Carregar flashcards e modo intensivo do aluno
  useEffect(() => {
    async function carregarDados() {
      try {
        console.log("Iniciando carregamento...");
        
        // Obter usuário logado
        const usuarioId = await FlashcardService.getUsuarioId();
        console.log("UsuarioId retornado:", usuarioId);

        if (!usuarioId) {
          console.warn("Nenhum usuarioId encontrado — verifique o login!");
          setLoading(false);
          return;
        }

        // Buscar dados do aluno associado ao usuário
        const alunoResponse = await AlunoService.buscarAlunoPorId(usuarioId);
        console.log("Retorno do alunoResponse:", alunoResponse?.data);

        if (alunoResponse?.data) {
          setAlunoId(alunoResponse.data.usuario_id); // garante que o ID do usuário seja definido
          setModoIntensivo(!!alunoResponse.data.modoIntensivo); // define o modo intensivo conforme banco
        }

        // Buscar flashcards do usuário
        const flashcardsData = await FlashcardService.listarFlashcards(usuarioId);

        // Filtrar por matéria
        const filtrados = flashcardsData.filter((fc) => fc.materia === materia);
        setFlashcards(filtrados);
      } catch (err) {

        console.error("Erro ao carregar dados:", err);
        console.log("URL com erro:", err.response?.config?.url);
        console.log("Status do erro:", err.response?.status);
        Alert.alert(
          "Erro ao carregar dados",
          `Ocorreu um erro ao buscar as informações.\n\nDetalhes: ${
            err.response
              ? `(${err.response.status}) ${err.response.config?.url}`
              : err.message
          }`
        );
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [materia]);

  const handleAbrirFlashcard = async (item) => {
    const novoAberto = abertoId === item.id ? null : item.id;
    setAbertoId(novoAberto);

    if (novoAberto) {
      await revisarFlashcard(item.id);
    }
  };

  const renderFlashcard = ({ item }) => {
    const aberto = abertoId === item.id;

    // Largura responsiva:
    const breakpoint = 500;
    const larguraCard =
      width < breakpoint ? (width - 3 * 15) / 2 : width - 2 * 15;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleAbrirFlashcard(item)}
        style={[
          styles.card,
          {
            width: larguraCard,
            minHeight: aberto ? alturaCardAberto : alturaCardFechado,
            maxHeight: aberto ? alturaCardAberto : alturaCardFechado,
          },
        ]}
      >
        <Text style={styles.label}>Pergunta:</Text>
        <Text
          style={styles.text}
          numberOfLines={aberto ? undefined : 3} // limita a 3 linhas quando fechado
          ellipsizeMode="tail" // adiciona "..."
        >
          {item.pergunta}
        </Text>

        {aberto && (
          <>
            <Text style={styles.label}>Resposta:</Text>
            <Text style={styles.text}>{item.resposta}</Text>

            <Text style={styles.info}>
              Última revisão:{" "}
              {item.ultima_revisao
                ? new Date(item.ultima_revisao).toLocaleDateString()
                : "—"}
            </Text>
            <Text style={styles.info}>
              Próxima revisão:{" "}
              {item.proxima_revisao
                ? new Date(item.proxima_revisao).toLocaleDateString()
                : "—"}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  // Criar novo flashcard
  const criarFlashcard = async () => {
    try {
      const usuarioId = await FlashcardService.getUsuarioId();
      if (!usuarioId) return;

      const repeticoesFinal = modoIntensivo && repeticoes < 6 ? 6 : repeticoes;

      await FlashcardService.criarFlashcard(
        usuarioId,
        pergunta,
        resposta,
        materia,
        repeticoesFinal
      );

      const flashcardsData = await FlashcardService.listarFlashcards(usuarioId);
      setFlashcards(flashcardsData.filter((fc) => fc.materia === materia));

      setModalVisible(false);
      setPergunta("");
      setResposta("");
      setRepeticoes(4);
    } catch (err) {
      console.error("Erro ao criar flashcard:", err);
      Alert.alert(
        "Erro ao criar flashcard",
        `Não foi possível criar o flashcard.\n\nDetalhes: ${
          err.response
            ? `(${err.response.status}) ${err.response.config?.url}`
            : err.message
        }`
      );
    }
  };

  // Atualizar modo intensivo no banco e no estado
  const alternarModoIntensivo = async (valor) => {
    try {
      setModoIntensivo(valor);

      if (alunoId) {
        await AlunoService.ativarModoIntensivo(alunoId, valor);
      }

      if (valor && repeticoes < 6) setRepeticoes(6);
    } catch (err) {
      console.error("Erro ao atualizar modo intensivo:", err);
      Alert.alert(
        "Erro ao atualizar modo intensivo",
        `Não foi possível atualizar o modo intensivo.\n\nDetalhes: ${
          err.response
            ? `(${err.response.status}) ${err.response.config?.url}`
            : err.message
        }`
      );
    }
  };

  // Marcar flashcard como revisado
  const revisarFlashcard = async (id) => {
    try {
      await FlashcardService.revisarFlashcard(id);
      const usuarioId = await FlashcardService.getUsuarioId();
      const flashcardsData = await FlashcardService.listarFlashcards(usuarioId);
      setFlashcards(flashcardsData.filter((fc) => fc.materia === materia));
    } catch (err) {
      console.error("Erro ao revisar flashcard:", err);
      Alert.alert(
        "Erro ao revisar flashcard",
        `Não foi possível marcar o flashcard como revisado.\n\nDetalhes: ${
          err.response
            ? `(${err.response.status}) ${err.response.config?.url}`
            : err.message
        }`
      );
    }
  };

  // Estado de carregamento
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e86de" />
        <Text style={{ marginTop: 10 }}>Carregando flashcards...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopNavbar />
      <View style={styles.whiteContainer}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>{materia}</Text>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { minHeight: height * 0.7 },
          ]}
        >
          {flashcards.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhum flashcard encontrado para {materia}.
            </Text>
          ) : (
            <View style={styles.cardsContainer}>
              {flashcards.map((item) => renderFlashcard({ item }))}
            </View>
          )}
        </ScrollView>
      </View>

      {/* Botão flutuante */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal de criação */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Criar Flashcard</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Pergunta</Text>
            <TextInput
              style={styles.input}
              value={pergunta}
              onChangeText={setPergunta}
              placeholder="Digite a pergunta"
            />

            <Text style={styles.label}>Resposta</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={resposta}
              onChangeText={setResposta}
              multiline
              placeholder="Digite a resposta"
            />

            <Text style={styles.label}>Repetições mensais</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={repeticoes}
                onValueChange={(value) => {
                  if (modoIntensivo && value < 6) return;
                  setRepeticoes(value);
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <Picker.Item key={num} label={`${num}`} value={num} />
                ))}
              </Picker>
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Modo intensivo</Text>
              <Switch
                value={modoIntensivo}
                onValueChange={alternarModoIntensivo}
                thumbColor={modoIntensivo ? "#0b4e91" : "#ccc"}
              />
            </View>

            <TouchableOpacity style={styles.sendButton} onPress={criarFlashcard}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.menuBarContainer}>
        <MenuBar />
      </View>
    </SafeAreaView>
  );
}

// 🔹 Estilos (mantidos iguais)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#0b4e91ff" },
  whiteContainer: {
    flex: 1,
    backgroundColor: "#ececec",
    margin: 10,
    borderRadius: 15,
    padding: 15,
  },
  scrollContainer: { flexGrow: 1, alignItems: "center", paddingBottom: 100 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10,
  },
  listContainer: { width: "100%", alignItems: "center" },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  label: { fontWeight: "bold", color: "#40739e", marginBottom: 3 },
  text: { marginBottom: 10, color: "#2f3640" },
  info: { fontSize: 12, color: "#718093", marginBottom: 5 },
  button: {
    backgroundColor: "#44bd32",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#333", fontSize: 16, marginTop: 20, textAlign: "center" },
  floatingButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    backgroundColor: "#0c4499",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    elevation: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    zIndex: 1000,
    elevation: 10,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  card: {
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: "flex-start",
    minWidth: 100,
    maxWidth: 200,
    flexGrow: 1,
  },
  cardFechado: {
    minHeight: 80,  
    maxHeight: 80,  
    backgroundColor: "#fff",
  },
  cardAberto: {
    backgroundColor: "#f9f9f9",
    minHeight: 80,
    maxHeight: 80,
  },
  text: {
    marginBottom: 10,
    color: "#2f3640",
    flexShrink: 1,
  }
});
