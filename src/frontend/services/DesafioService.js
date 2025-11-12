import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:3000"; // ajuste se necessário

class DesafiosService {

    static async listarDesafios() {
        try {
            const usuario = await AsyncStorage.getItem("usuario");
            const usuario_id = usuario ? JSON.parse(usuario).id : null;
            const response = await axios.get(`${API_URL}/desafios/progresso/${usuario_id}`);
            return response.data;
        } catch (err) {
            console.error("Erro ao listar desafios:", err);
            return [];
        }
    }

    static async registrarProgresso(usuario_id, desafio_id, progresso, concluida) {
        try {
            await axios.post(`${API_URL}/desafios/progresso`, { usuario_id, desafio_id, progresso, concluida });
        } catch (err) {
            console.error("Erro ao registrar progresso:", err);
        }
    }

    static async marcarConcluido(usuario_id, desafio_id) {
        try {
            await axios.put(`${API_URL}/desafios/progresso/concluido`, { usuario_id, desafio_id });
        } catch (err) {
            console.error("Erro ao marcar desafio concluído:", err);
        }
    }
}
    
export default DesafiosService;