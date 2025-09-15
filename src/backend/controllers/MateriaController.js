const pool = require("../config/db");
const Material = require("../models/objetos/Material.class");

// Retorna os materiais de uma matéria específica
exports.listarMaterias = async (req, res) => {
    const { materia } = req.params;
    const { idUsuario } = req.query;

    try {
        const [materiaisRows] = await pool.query(
            "SELECT * FROM materias WHERE materia = ?",
            [materia]
        );

        let materiais = materiaisRows.map(row => Material.fromDB(row));

        if (idUsuario) {
            const [progressoRows] = await pool.query(
                "SELECT * FROM progresso_atividades WHERE id_usuario = ?",
                [idUsuario]
            );

            materiais = materiais.map(mat => {
                const prog = progressoRows.find(p => p.atividade_id === mat.id);
                if (prog) mat.progresso = prog.progresso;
                return mat;
            });
        }

        res.json(materiais);
    } catch (err) {
        console.error("Erro no listar matérias: ", err);
        res.status(500).json({ erro: "Erro ao listar materiais!" });
    }
};

// Professor envia material
exports.publicarMateria = async (req, res) => {
    const { materia, tema, titulo, arquivo, idProfessor } = req.body;

    if (!materia || !tema || !titulo || !arquivo || !idProfessor) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO materias (materia, tema, titulo, arquivo, criado_por) VALUES (?, ?, ?, ?, ?)",
            [materia, tema, titulo, arquivo, idProfessor]
        );
        res.json({ sucesso: true, id: result.insertId });
    } catch (err) {
        console.error("Erro ao publicar material: ", err);
        res.status(500).json({ erro: "Erro ao publicar material!" });
    }
};

// Atualiza o progresso de uma atividade
exports.atualizarProgresso = async (req, res) => {
    const { idUsuario, atividadeId, progresso, titulo, tema } = req.body;

    if (!idUsuario || !atividadeId || progresso === undefined || !titulo || !tema || !materia) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
    }

    try {
        const [existing] = await pool.query(
            "SELECT * FROM progresso_atividades WHERE id_usuario=? AND atividade_id=?",
            [idUsuario, atividadeId]
        );

        if (existing.length > 0) {
            await pool.query(
                "UPDATE progresso_atividades SET progresso=? WHERE id_usuario=? AND atividade_id=?",
                [progresso, idUsuario, atividadeId]
            );
        } else {
            await pool.query(
                "INSERT INTO progresso_atividades (id_usuario, materia, titulo, tema, atividade_id, progresso) VALUES (?, ?, ?, ?, ?)",
                [idUsuario, materia, titulo, tema, atividadeId, progresso]
            );
        }

        res.json({ sucesso: true });
    } catch (err) {
        console.error("Erro ao atualizar progresso: ", err);
        res.status(500).json({ erro: "Erro ao atualizar progresso" });
    }
};

// Lista o progresso do usuário
exports.listarProgressoUsuario = async (req, res) => {
    const { idUsuario, materia } = req.params;
    try {
        const [rows] = await pool.query(
            "SELECT * FROM progresso_atividades WHERE id_usuario=? AND materia=?",
            [idUsuario, materia]
        );
        res.json(rows);
    } catch (err) {
        console.error("Erro ao listar progresso: ", err);
        res.status(500).json({ erro: "Erro ao listar progresso" });
    }
};