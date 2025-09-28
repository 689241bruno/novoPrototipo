const pool = require("../config/db");
const Material = require("../models/objetos/Material.class");

// Retorna os materiais de uma matéria específica
exports.listarMaterias = async (req, res) => {
  try {
    const materia = req.params.materia;
    const idUsuario = req.query.idUsuario;

    const [rows] = await pool.query(
      "SELECT * FROM material WHERE materia = ? AND criado_por = ?",
      [materia, idUsuario]
    );

    // Converte arquivo Buffer → Base64
    const materiais = rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      tema: row.tema,
      materia: row.materia,
      arquivo: row.arquivo ? row.arquivo.toString("base64") : null,
      criado_por: row.criado_por
    }));

    res.json(materiais);
  } catch (err) {
    console.error("Erro no listar matérias: ", err);
    res.status(500).json({ erro: "Erro ao listar matérias!" });
  }
};

// Publica um material (PDF)
exports.publicarMateria = async (req, res) => {
  try {
    const { titulo, tema, materia, criado_por} = req.body;
    const arquivo = req.file ? req.file.buffer : null; // PDF vem como buffer

    if (!titulo || !tema || !materia || !criado_por || !arquivo) {
      return res.status(400).json({ erro: "Preencha todos os campos e selecione um arquivo." });
    }

    const [result] = await pool.query(
      "INSERT INTO material (titulo, tema, materia, arquivo, criado_por) VALUES (?, ?, ?, ?, ?)",
      [titulo, tema, materia, arquivo, criado_por]
    );
    res.json({ mensagem: "Material publicado com sucesso!" });
  } catch (err) {
    console.error("Erro ao publicar material:", err);
    res.status(500).json({ erro: "Erro ao publicar material." });
  }
}

// Atualiza progresso da atividade
exports.atualizarProgresso = async (req, res) => {
  const { idUsuario, atividadeId, progresso, titulo, tema } = req.body;

  if (!idUsuario || !atividadeId || progresso === undefined) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes!" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT * FROM progresso_atividades WHERE usuario_id=? AND atividade_id=?",
      [idUsuario, atividadeId]
    );

    if (existing.length > 0) {
      await pool.query(
        "UPDATE progresso_atividades SET progresso=? WHERE usuario_id=? AND atividade_id=?",
        [progresso, idUsuario, atividadeId]
      );
    } else {
      await pool.query(
        "INSERT INTO progresso_atividades (usuario_id, titulo, tema, atividade_id, progresso) VALUES (?, ?, ?, ?, ?)",
        [idUsuario, titulo, tema, atividadeId, progresso]
      );
    }

    res.json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao atualizar progresso: ", err);
    res.status(500).json({ erro: "Erro ao atualizar progresso" });
  }
};

// Lista progresso do usuário
exports.listarProgressoUsuario = async (req, res) => {
  const { idUsuario, atividade_id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM progresso_atividades WHERE usuario_id=? AND atividade_id=?",
      [idUsuario, atividade_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar progresso: ", err);
    res.status(500).json({ erro: "Erro ao listar progresso" });
  }
};

// Servir PDF pelo ID
exports.verPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT arquivo FROM material WHERE id = ?", [id]);

    if (!rows.length) return res.status(404).send("Arquivo não encontrado");

    res.setHeader("Content-Type", "application/pdf");
    res.send(rows[0].arquivo);
  } catch (err) {
    console.error("Erro ao abrir PDF:", err);
    res.status(500).send("Erro ao abrir PDF");
  }
};
