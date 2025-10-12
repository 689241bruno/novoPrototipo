const pool = require("../../config/db");
const Aluno = require("./Aluno.class");
const Professor = require("./Professor.class");
const Admin = require("./Admin.class");

class Usuario {
  constructor(
    id,
    nome,
    email,
    senha,
    is_aluno = false,
    is_professor = false,
    is_admin = false,
    foto, 
    criado_em
  ) {
    this.id           = id;
    this.nome         = nome;
    this.email        = email;
    this.senha        = senha;
    this.is_aluno     = is_aluno;
    this.is_professor = is_professor;
    this.is_admin     = is_admin;
    this.foto         = foto;
    this.criado_em    = criado_em;
  }

  static async listar() {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    return rows;
  }

  static async cadastrar(nome, email, senha, is_aluno, is_professor, is_admin) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Cadastra usuário base
      const [result] = await connection.query(
        "INSERT INTO usuarios (nome, email, senha, is_aluno, is_professor, is_admin) VALUES (?, ?, ?, ?, ?, ?)",
        [nome, email, senha, is_aluno, is_professor, is_admin]
      );

      const usuario_id = result.insertId;

      // Cria perfil Aluno (sempre obrigatório)
      await Aluno.cadastrar(usuario_id);

      // Se professor → cria na tabela professor
      if (is_professor) {
        await Professor.cadastrar(usuario_id);
      }

      // Se admin → cria na tabela admin
      if (is_admin) {
        await Admin.cadastrar(usuario_id);
      }

      await connection.commit();

      return {
        id: usuario_id,
        nome,
        email,
        is_aluno,
        is_professor,
        is_admin,
      };
    } catch (err) {
      await connection.rollback();
      console.error("Erro SQL no cadastrar usuário:", err.sqlMessage || err.message);
      throw new Error("Erro ao cadastrar usuário: " + (err.sqlMessage || err.message));
    } finally {
      connection.release();
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
      throw err;
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

  static async checkUserType(email, is_aluno, is_professor, is_admin) {
    const [rows] = await pool.query(
      "SELECT id, is_aluno, is_professor, is_admin FROM usuarios WHERE email = ?",
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
