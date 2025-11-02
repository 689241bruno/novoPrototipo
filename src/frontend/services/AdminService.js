import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://localhost:3000"; // se for rodar no navegador -> http://localhost:3000

class AdminService {
    static async cadastrarAdmin(usuario_id, usuario_email) {
        return axios.post(`${API_URL}/cadadmin`, { usuario_id, usuario_email });
    }

    static async editarMaterial(id, dados) {
        return axios.put(`${API_URL}/materiais/${id}`, dados);
    }

    static async deletarMaterial(id) {
        return axios.delete(`${API_URL}/materiais/${id}`);
    }

}

export default AdminService;