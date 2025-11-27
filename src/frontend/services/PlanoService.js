import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://api-tcc-9lha.onrender.com"; // se for rodar no navegador - http://localhost:3000

class PlanoService {
  static async listarPlano(usuario_id) {
    const res = await axios.get(`${API_URL}/plano/${usuario_id}`);
    return res.data;
  }

  static async criarTarefa({
    usuario_id,
    dia,
    materia,
    tema,
    inicio,
    termino,
  }) {
    return await axios.post(`${API_URL}/plano`, {
      usuario_id,
      dia,
      materia,
      tema,
      inicio,
      termino,
    });
  }

  static async editarTarefa(id, dados) {
    return await axios.put(`${API_URL}/plano/${id}`, dados);
  }

  static async deletarTarefa(id) {
    return await axios.delete(`${API_URL}/plano/${id}`);
  }

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

export default PlanoService;
