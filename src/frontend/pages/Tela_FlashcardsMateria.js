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
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import TopNavbar from "../components/TopNavbar";
import MenuBar from "../components/MenuBar";
import FlashcardService from "../services/FlashcardService";

export default function FlashcardsMateria({ route, navigation }) {
  const { materia } = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [repeticoes, setRepeticoes] = useState(4);
  const [modoIntensivo, setModoIntensivo] = useState(false);

  const { height } = Dimensions.get("window");

  // Carregar flashcards da matéria
  useEffect(() => {
    async function carregarFlashcards() {
      try {
        const usuarioId = await FlashcardService.getUsuarioId();
        if (usuarioId) {
          const data = await FlashcardService.listarFlashcards(usuarioId);
          const filtrados = data.filter((fc) => fc.materia === materia);
          setFlashcards(filtrados);
        }
      } catch (err) {
        console.error("Erro ao carregar flashcards:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarFlashcards();
  }, [materia]);

  // Criar novo flashcard
  const criarFlashcard = async () => {
    try {
      const usuarioId = await FlashcardService.getUsuarioId();
      if (!usuarioId) return;

      // Bloqueia repetições menores que 6 se modo intensivo estiver ativo
      const repeticoesFinal = modoIntensivo && repeticoes < 6 ? 6 : repeticoes;

      await FlashcardService.criarFlashcard(
        usuarioId,
        pergunta,
        resposta,
        materia,
        repeticoesFinal
      );

      setModalVisible(false);
      setPergunta("");
      setResposta("");
      setRepeticoes(4);
      setModoIntensivo(false);

      const data = await FlashcardService.listarFlashcards(usuarioId);
      setFlashcards(data.filter((fc) => fc.materia === materia));
    } catch (err) {
      console.error("Erro ao criar flashcard:", err);
    }
  };

  // Marcar como revisado
  const revisarFlashcard = async (id) => {
    try {
      await FlashcardService.revisarFlashcard(id);
      const usuarioId = await FlashcardService.getUsuarioId();
      const data = await FlashcardService.listarFlashcards(usuarioId);
      setFlashcards(data.filter((fc) => fc.materia === materia));
    } catch (err) {
      console.error("Erro ao revisar flashcard:", err);
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

      {/* Container branco (como na tela Materias) */}
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
            <FlatList
              data={flashcards}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.label}>Pergunta:</Text>
                  <Text style={styles.text}>{item.pergunta}</Text>

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

                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => revisarFlashcard(item.id)}
                  >
                    <Text style={styles.buttonText}>Marcar como revisado</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
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

      {/* Modal de criação de flashcard */}
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
                onValueChange={(val) => {
                  setModoIntensivo(val);
                  if (val && repeticoes < 6) setRepeticoes(6);
                }}
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
});
