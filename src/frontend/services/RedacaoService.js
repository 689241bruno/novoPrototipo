import axios from "axios";

const API_URL = "https://api-tcc-9lha.onrender.com"; // ajuste se necessário

class RedacaoService {
  static listar() {
    return axios.get(`${API_URL}/redacao`);
  }

  static buscarPorId(id) {
    return axios.get(`${API_URL}/redacao/${id}`);
  }

  static criar(dados) {
    return axios.post(`${API_URL}/redacao`, dados);
  }

  static editar(id, dados) {
    return axios.put(`${API_URL}/redacao/${id}`, dados);
  }

  static deletar(id) {
    return axios.delete(`${API_URL}/redacao/${id}`);
  }
}

export default RedacaoService;
