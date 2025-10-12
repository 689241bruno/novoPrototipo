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

    static async editarAluno(id, dados) {
        return axios.put(`${API_URL}/alunos/editar/${id}`, dados);
    }

    static async deletarAluno(id) {
        return axios.delete(`${API_URL}/alunos/deletar/${id}`);
    }

    static async buscarAlunoPorId(id) {
        return axios.get(`${API_URL}/alunos/buscar/${id}`);
    }

    static async ativarModoIntensivo(id, modoIntensivo = true) {
        return axios.put(`${API_URL}/alunos/modo-intensivo/${id}`, { modoIntensivo });
    }

    static async checkRanking(id) {
        return axios.get(`${API_URL}/alunos/ranking/${id}`);
    }
}

export default AlunoService;
