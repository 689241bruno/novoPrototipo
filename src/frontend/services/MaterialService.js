import axios from "axios";
const API_URL = "https://api-tcc-9lha.onrender.com"; // se for rodar no navegador -> http://localhost:3000

class MateriaService {
  static async listar() {
    return axios.get(`${API_URL}/materias`);
  }

  static async listarMaterias(materia, idUsuario) {
    return axios.get(`${API_URL}/materias/${encodeURIComponent(materia)}`, {
      params: { idUsuario },
    });
  }

  static async publicarMateria(formData) {
    return axios.post(`${API_URL}/materias/publicar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  static async atualizarProgresso(idUsuario, atividadeId) {
    console.log("Atualizando progresso:", { idUsuario, atividadeId });
    return axios.post(`${API_URL}/materias/progresso`, {
      idUsuario,
      atividadeId,
    });
  }

  static async listarProgressoUsuario(idUsuario) {
    console.log("Listando progresso do usuário:", { idUsuario });
    return axios.get(`${API_URL}/materias/progresso/${idUsuario}`);
  }

  static async verPDF(id) {
    console.log("Visualizando PDF do material:", { id });
    return axios.get(`${API_URL}/materias/ver/${id}`, {
      responseType: "arraybuffer",
    });
  }
}

export default MateriaService;
