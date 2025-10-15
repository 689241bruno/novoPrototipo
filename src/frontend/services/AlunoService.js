import axios from "axios";

const API_URL = "http://localhost:3000"; // se for rodar no navegador -> http://localhost:3000

class AlunoService {
    static async listarAlunos() {
        return axios.get(`${API_URL}/alunos/listar`);
    }

    static async cadastrarAluno(usuario_id, modoIntensivo = false, diagnostico = "", planoEstudosId = null) {
        return axios.post(`${API_URL}/alunos/cadastrar`, {
            usuario_id,
            modoIntensivo,
            diagnostico,
            planoEstudosId,
        });
    }

    static async editarAluno(usuario_id, dados) {
        return axios.put(`${API_URL}/alunos/editar/${usuario_id}`, dados);
    }

    static async deletarAluno(usuario_id) {
        return axios.delete(`${API_URL}/alunos/deletar/${usuario_id}`);
    }

    static async buscarAlunoPorId(usuario_id) {
        const response = await axios.get(`${API_URL}/alunos/buscar/${usuario_id}`);
        return response.data;
    }

    static async ativarModoIntensivo(usuario_id, modoIntensivo = true) {
        return axios.put(`${API_URL}/alunos/modo-intensivo/${usuario_id}`, { modoIntensivo });
    }

    static async checkRanking(usuario_id) {
        return axios.get(`${API_URL}/alunos/ranking/${usuario_id}`);
    }
}

export default AlunoService;
