import axios from "axios";
const API_URL = "https://api-tcc-9lha.onrender.com/questoes";

class QuestaoService {
  static listar() {
    return axios.get(API_URL);
  }

  static buscar(id) {
    return axios.get(`${API_URL}/${id}`);
  }

  static criar(data) {
    return axios.post(API_URL, data);
  }

  static editar(id, data) {
    return axios.put(`${API_URL}/${id}`, data);
  }

  static deletar(id) {
    return axios.delete(`${API_URL}/${id}`);
  }

  static sortear(materia, tema, quantidade = 10) {
    return axios.post(`${API_URL}/sortear`, { materia, tema, quantidade });
  }

  static verificar(respostas) {
    return axios.post(`${API_URL}/verificar`, { respostas });
  }
}

export default QuestaoService;
