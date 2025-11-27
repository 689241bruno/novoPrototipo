import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://api-tcc-9lha.onrender.com"; // se for rodar no navegador -> http://localhost:3000

class AdminService {
  static async cadastrarAdmin(usuario_id, usuario_email) {
    return axios.post(`${API_URL}/cadadmin`, { usuario_id, usuario_email });
  }
}

export default AdminService;
