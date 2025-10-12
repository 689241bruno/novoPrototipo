import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://localhost:3000"; // se for rodar no navegador -> http://localhost:3000

class UsuarioService {
  static async getLoggedInUserEmail() {
    try {
      const email = await AsyncStorage.getItem('usuarioEmail');
      return email;
    } catch (err) {
      console.error("Erro ao buscar email do usuário logado: ", err);
      return null;
    }
  }
  static async cadastrarUsuario(nome, email, senha, is_aluno = 1, is_professor = 0, is_admin = 0) {
    return axios.post(`${API_URL}/cadusuario`, { nome, email, senha, is_aluno, is_professor, is_admin });
  }

  static async loginUsuario(email, senha) {
    return axios.post(`${API_URL}/login`, { email, senha });
  }

  static async listarUsuarios() {
    return axios.get(`${API_URL}/usuarios`);
  }

  static async editarUsuario(id, dados) {
    return axios.put(`${API_URL}/editusuario`, { id, dados });
  }

  static async deletarUsuario(id) {
    return axios.delete(`${API_URL}/delusuario`, { data: { id } });
  }

  static async verificarTipo(email) {
    return axios.get(`${API_URL}/verificar-tipo`, { params: { email } });
  }

  static async checkUser(email) {
    return axios.get(`${API_URL}/check-user`, { params: { email } });
  }

  static async checkUserPass(email, senha) {
    return axios.get(`${API_URL}/check-user-pass`, {
      params: { email, senha },
    });
  }

  static async enviarRedacao(redacao) {
    return axios.post(`${API_URL}/redacoes`, redacao);
  }

  static async recuperarSenha(email) {
    return axios.post(`${API_URL}/recuperar-senha`, { email });
  }
}

export default UsuarioService;
