import axios from "axios";

const API_URL = "http://192.168.0.185:3000"; // se for rodar no navegador -> http://localhost:3000

class UsuarioService {
  // Usuario
  static async cadastrarUsuario(nome, email, senha, tipo) {
    return axios.post(`${API_URL}/cadusuario`, { nome, email, senha, tipo });
  }

  static async loginUsuario(email, senha) {
    return axios.post(`${API_URL}/login`, { email, senha });
  }

  static async listarUsuarios() {
    return axios.get(`${API_URL}/usuarios`);
  }

  static async editarUsuario(id, dados) {
    return axios.editar(`${API_URL}/editusuario`, { id, dados });
  }

  static async deletarUsuario(id) {
    return axios.delete(`${API_URL}/delusuario`, { id });
  }

  static async verificarTipo(email) {
    return axios.post(`${API_URL}/verificar-tipo`, { email });
  }

  static async checkUser(email) {
    return axios.post(`${API_URL}/check-user`, { email });
  }

  static async checkUserPass(email, senha) {
    return axios.post(`${API_URL}/check-user-pass`, { email, senha });
  }

  static async enviarRedacao(redacao) {
    return axios.post(`${API_URL}/redacoes`, redacao);
  }

  static async recuperarSenha(email) {
    return axios.post(`${API_URL}/recuperar-senha`, { email });
  }

  // Materia

  static async listarMaterias(materia, idUsuario) {
    return axios.get(`${API_URL}/materias/${encodeURIComponent(materia)}`, {
      params: { idUsuario },
    });
  }

  static async publicarMateria(titulo, tema, materia, arquivo, idProfessor) {
    return axios.post(`${API_URL}/materias/publicar`, {
      titulo,
      tema,
      materia,
      arquivo,
      idProfessor,
    });
  }

  // Progresso
  static async atualizarProgresso(
    idUsuario,
    atividadeId,
    titulo,
    tema,
    materia,
    progresso
  ) {
    return axios.post(`${API_URL}/materias/progresso`, {
      idUsuario,
      atividadeId,
      titulo,
      tema,
      materia,
      progresso,
    });
  }

  static async listarProgressoUsuario(idUsuario, materia) {
    return axios.get(
      `${API_URL}/materias/progresso/${idUsuario}/${encodeURIComponent(
        materia
      )}`
    );
  }
}

export default UsuarioService;
