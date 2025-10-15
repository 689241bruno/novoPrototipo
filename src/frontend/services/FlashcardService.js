import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:3000"; // se for rodar no navegador -> http://localhost:3000

class FlashcardService {
  // Listar todos os flashcards de um usuário
  static async listarFlashcards(usuario_id) {
    try {
      const response = await axios.get(`${API_URL}/flashcards/listar/${usuario_id}`);
      return response.data;
    } catch (err) {
      console.error("Erro ao listar flashcards:", err);
      throw err;
    }
  }

  // Criar novo flashcard
  static async criarFlashcard(usuario_id, pergunta, resposta, materia, repeticoes) {
    try {
      const response = await axios.post(`${API_URL}/flashcards/criar`, {
        usuario_id,
        pergunta,
        resposta,
        materia,
        repeticoes,
      });
      return response.data;
    } catch (err) {
      console.error("Erro ao criar flashcard:", err);
      throw err;
    }
  }

  // Editar flashcard existente
  static async editarFlashcard(id, dados) {
    try {
      const response = await axios.put(`${API_URL}/flashcards/editar/${id}`, dados);
      return response.data;
    } catch (err) {
      console.error("Erro ao editar flashcard:", err);
      throw err;
    }
  }

  // Deletar flashcard
  static async deletarFlashcard(id) {
    try {
      const response = await axios.delete(`${API_URL}/flashcards/deletar/${id}`);
      return response.data;
    } catch (err) {
      console.error("Erro ao deletar flashcard:", err);
      throw err;
    }
  }

  // Revisar flashcard (atualiza datas de revisão)
  static async revisarFlashcard(id) {
    try {
      const response = await axios.put(`${API_URL}/flashcards/revisar/${id}`);
      return response.data;
    } catch (err) {
      console.error("Erro ao revisar flashcard:", err);
      throw err;
    }
  }

  // Utilitário: obter o ID do usuário logado (caso precise)
  static async getUsuarioId() {
    try {
      const usuario = await AsyncStorage.getItem("usuario");
      if (!usuario) {
          console.warn("Nenhum usuário salvo no AsyncStorage");
          return null;
      }
      const parsed = JSON.parse(usuario);
      console.log("ID do usuário no AsyncStorage:", parsed.id);
      return parsed.id || null;
    } catch (err) {
        console.error("Erro ao obter ID do usuário logado:", err);
        return null;
    }
  }
}

export default FlashcardService;
