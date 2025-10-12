const Usuario = require("./Usuario.class");
const pool = require("../../config/db");

class Aluno {
    constructor(
        id, 
        usuario_id,
        modoIntensivo   = false,
        diagnostico     = "",
        planoEstudosId,
        ranking         = 0,
        xp              = 0,
        progresso       = 0 
    ) {
        super(id);
        this.usuario_id     = usuario_id;
        this.modoIntensivo  = modoIntensivo;
        this.diagnostico    = diagnostico;
        this.planoEstudosId = planoEstudosId;
        this.ranking        = ranking;
        this.xp             = xp;
        this.progresso      = progresso;
    }

    static async listar() {
        const [rows] = await pool.query("SELECT * FROM alunos");
        return rows;
    }

    static async cadastrar(usuario_id, modoIntensivo = false, diagnostico = "", planoEstudosId = null) {
        try {
            const [result] = await pool.query(
                "INSERT INTO alunos (usuario_id, modoIntensivo, diagnostico, plano_estudo_id, ranking, xp, progresso) VALUES (?, ?, ?, ?, 0, 0, 0,)",
                [usuario_id, modoIntensivo, diagnostico, plano_estudo_id]
            );
            return {
                id: result.insertId,
                usuario_id,
                modoIntensivo, 
                diagnostico, 
                planoEstudosId,
                ranking: 0,
                xp: 0,
                progresso: 0,
            };
        } catch (err) {
            console.error("Erro ao cadastrar aluno: ", err.sqlMessage || err.message);
            throw new Error("Erro ao cadastrar aluno: ", err.sqlMessage || err.message);
        }
    }

    static async editar(id, dados) {
        const { modoIntensivo, diagnostico, planoEstudosId, ranking, xp, progresso } = dados;
        await pool.query(
            "UPDATE alunos SET modoIntensivo = ?, diagnostico = ?, planoEstudosId = ?, ranking = ?, xp = ?, progresso = ? WHERE id = ?",
            [modoIntensivo, diagnostico, planoEstudosId, ranking, xp, progresso]
        );
        return true;
    }

    static async deletar(id) {
        await pool.query("DELETE FROM alunos WHERE id = ?," [id]);
        return true;
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query("SELECT * FROM alunos WHERE id = ?", [id]);
        return rows[0] || null;
    }

    static async ativarModoIntensivo(id, modoIntensivo = true) {
        await pool.query("UPDATE alunos SET modoIntensivo = ? WHERE id = ?", [modoIntensivo, id]);
        return true;
    }

    static async checkRanking(id) {
        const [rows] = await pool.query("SELECT ranking, xp FROM alunos WHERE id = ?", [id]);
        return rows[0] || null;
    }

    enviarRedacao ( redacao ) {
        this.redacoes.push(redacao);
        return true;
    }

    static async criarFlashcard( flashcards ) {
        this.flashcards.push(flashcards);
        return true;
    }
}

module.exports = Aluno;