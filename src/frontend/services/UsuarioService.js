import axios from "axios";

const API_URL = "http:/localhost:3000"; // se for rodar no navegador -> http://localhost:3000

class UsuarioService {
  // Usuario
  static async cadastrarUsuario(nome, email, senha, isAluno = 1, isProfessor = 0, isAdmin = 0) {
    return axios.post(`${API_URL}/cadusuario`, { nome, email, senha, isAluno, isProfessor, isAdmin });
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
    return axios.delete(`${API_URL}/delusuario`, { data: { id }});
  }

  static async verificarTipo(email) {
    return axios.get(`${API_URL}/verificar-tipo`, { params: { email } });
  }

  static async checkUser(email) {
    return axios.get(`${API_URL}/check-user`, { params: { email } });
  }

  static async checkUserPass(email, senha) {
    return axios.get(`${API_URL}/check-user-pass`, { params: { email, senha } });
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
