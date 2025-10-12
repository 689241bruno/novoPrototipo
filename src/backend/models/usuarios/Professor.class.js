const Usuario = require("./Usuario.class");
const pool = require("../../config/db")

class Professor {
    constructor(...args) {
        super(...args);
        this.materia = '';
    }

    static async cadastrar(usuario_id, materia = null) {
        try {
            const [result] = await pool.query(
                "INSERT INTO professores (usuario_id, materia) VALUES (?, ?)",
                [usuario_id, materia]
            );
            return { id: result.insertId, usuario_id, materia };
        } catch (err) {
            console.error("Erro ao cadastrar professor:", err.sqlMessage || err.message);
            throw new Error("Erro ao cadastrar professor: " + (err.sqlMessage || err.message));
        }
    }

    static async corrigirRedacao( redacao ) {
        redacao.corrigidaPorProfessor = true;
        redacao.feedback = "Correção realizada!";
        return redacao;
    }

    static async publicarMaterial( tema, subtema, titulo, materia, arquivo, criado_por) {
        const result = await pool.query(
            "INSERT INTO material ( tema, subtema, materia, titulo, arquivo, criado_por) VALUES (?, ?, ?, ?, ?, ?)",
            [ tema, subtema, materia, titulo, arquivo, criado_por]
        );
        return result;
    }

    static async editarMaterial( idMaterial, novoArquivo ) {
        await pool.query(
            "UPDATE materias SET arquivo = ? WHERE id = ? AND criado_por = ?",
            [novoArquivo, idMaterial, this.id]
        );
    }

    static async apagarMaterial( material ) {
        await pool.query(
            "DELETE FROM materiais WHERE id = ? AND criado_por = ?",
            [idMaterial, this.id]
        );
        return true;
    }
}

module.exports = Professor;