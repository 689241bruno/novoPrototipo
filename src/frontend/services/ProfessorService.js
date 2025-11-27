import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://api-tcc-9lha.onrender.com"; // se for rodar no navegador -> http://localhost:3000

class ProfessorService {
  static async listarProfessores() {
    return axios.get(`${API_URL}/professores`);
  }

  static async cadastrarProfessor(usuario_id, materia) {
    return axios.post(`${API_URL}/cadprofessor`, { usuario_id, materia });
  }

  static async editarProfessor(usuario_id, dados) {
    return axios.put(`${API_URL}/editprofessor/${usuario_id}`, dados);
  }

  static async editarMaterial(id, dados) {
    return axios.put(`${API_URL}/materiais/${id}`, dados);
  }

  static async deletarMaterial(id) {
    return axios.delete(`${API_URL}/materiais/${id}`);
  }
}

export default ProfessorService;
