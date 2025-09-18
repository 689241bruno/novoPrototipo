const pool = require("../../config/db");

class Usuario {
  constructor(
    id,
    nome,
    email,
    senha,
    isAluno = false,
    isProfessor = false,
    isAdmin = false
  ) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.isAluno = isAluno;
    this.isProfessor = isProfessor;
    this.isAdmin = isAdmin;
  }

  async listar() {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    return rows;
  }

  static async cadastrar(nome, email, senha, tipo = "aluno") {
    try {
      const isAluno = tipo === "aluno";
      const isProfessor = tipo === "professor";
      const isAdmin = tipo === "admin";

      const [result] = await pool.query(
        "INSERT INTO usuarios (nome, email, senha, isAluno, isProfessor, isAdmin) VALUES (?, ?, ?, ?, ?, ?)",
        [nome, email, senha, isAluno, isProfessor, isAdmin]
      );
      return { id: result.insertId, nome, email, tipo };
    } catch (err) {
      throw new Error("Erro ao cadastrar usuário: " + err.message);
    }
  }

  static async login(email, senha) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
        [email, senha]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      console.error("Erro na consulta de login:", err);
      throw err; // Isso vai propagar o erro para o controller
    }
  }

  static async editar(id, dados) {
    const { nome, email, senha } = dados;
    await pool.query(
      "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?",
      [nome, email, senha, id]
    );
    return true;
  }

  static async deletar(id) {
    await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
    return true;
  }

  static async checkUserType(email, isAluno, isProfessor, isAdmin) {
    const [rows] = await pool.query(
      "SELECT isAluno, isProfessor, isAdmin FROM usuarios WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  }

  static async checkUser(email) {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    return rows.length > 0;
  }

  static async checkUserPass(email, senha) {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
      [email, senha]
    );
    return rows.length > 0;
  }
}

module.exports = Usuario;
