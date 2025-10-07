const Usuario = require("./Usuario.class");
const pool = require("../../config/db")

class Professor extends Usuario {
    constructor(...args) {
        super(...args);
        this.materia = '';
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