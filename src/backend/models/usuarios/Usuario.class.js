const pool = require("../../config/db");
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

  static async cadastrar(nome, email, senha, is_aluno, is_professor, is_admin, connection) {
    try {
      const [result] = await connection.query(
        `INSERT INTO usuarios (nome, email, senha, is_aluno, is_professor, is_admin)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [nome, email, senha, is_aluno, is_professor, is_admin]
      );

      const usuario_id = result.insertId;

      return {
        id: usuario_id,
        nome,
        email,
        is_aluno,
        is_professor,
        is_admin,
      };
    } catch (err) {
      console.error("Erro SQL no cadastrar usuário:", err.sqlMessage || err.message);
      throw new Error("Erro ao cadastrar usuário: " + (err.sqlMessage || err.message));
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
    try {
      let campos = [];
      let valores = [];

      if (dados.nome) {
        campos.push("nome = ?");
        valores.push(dados.nome);
      }

      if (dados.email) {
        campos.push("email = ?");
        valores.push(dados.email);
      }

      if (dados.senha) {
        campos.push("senha = ?");
        valores.push(dados.senha);
      }

      if (campos.length === 0) return;

      // Busca o usuário atual antes de atualizar
      const [usuarioAtual] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
      if (usuarioAtual.length === 0) throw new Error("Usuário não encontrado.");

      const emailAntigo = usuarioAtual[0].email;

      // Verifica se é admin
      const [ehAdmin] = await pool.query("SELECT * FROM admin WHERE usuario_email = ?", [emailAntigo]);

      // Impede alterar email de admin (mas permite editar nome)
      if (ehAdmin.length > 0 && dados.email && dados.email !== emailAntigo) {
        throw new Error("Não é permitido alterar o email de um administrador, pois é chave estrangeira.");
      }

      const sql = `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`;
      valores.push(id);

      await pool.query(sql, valores);
    } catch (err) {
      console.error("Erro ao editar usuário:", err);
      throw err;
    }
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
