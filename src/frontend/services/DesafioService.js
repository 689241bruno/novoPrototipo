import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://api-tcc-9lha.onrender.com"; // ajuste se necessário

class DesafiosService {
  static async listarDesafios() {
    return axios.get(`${API_URL}/desafios`);
  }

  static async criarDesafio(dados) {
    return axios.post(`${API_URL}/desafios`, dados);
  }

  static async editarDesafio(id, dados) {
    return axios.put(`${API_URL}/desafios/${id}`, dados);
  }

  static async deletarDesafio(id) {
    return axios.delete(`${API_URL}/desafios/${id}`);
  }

  static async registrarProgresso(
    usuario_id,
    desafio_id,
    progresso,
    concluida
  ) {
    return axios.post(`${API_URL}/desafios/progresso`, {
      usuario_id,
      desafio_id,
      progresso,
      concluida,
    });
  }

  static async listarProgressoUsuario(usuario_id) {
    return axios.get(`${API_URL}/desafios/progresso/${usuario_id}`);
  }

  static async marcarConcluido(usuario_id, desafio_id) {
    return axios.put(`${API_URL}/desafios/progresso/concluido`, {
      usuario_id,
      desafio_id,
    });
  }
}

export default DesafiosService;
