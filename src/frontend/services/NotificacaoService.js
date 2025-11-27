import axios from "axios";
const API_URL = "https://api-tcc-9lha.onrender.com"; // se for rodar no navegador -> http://localhost:3000

class NotificacaoService {
  static listar() {
    return axios.get(`${API_URL}/notificacoes`);
  }

  static criar(data) {
    return axios.post(`${API_URL}/notificacoes`, data);
  }

  static editar(id, data) {
    return axios.put(`${API_URL}/notificacoes/${id}`, data);
  }

  static deletar(id) {
    return axios.delete(`${API_URL}/notificacoes/${id}`);
  }
}

export default NotificacaoService;
