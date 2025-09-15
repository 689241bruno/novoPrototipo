const Usuario = require("./Usuario.class");
const pool = require("../../config/db")

class Professor extends Usuario {
    constructor(...args) {
        super(...args);
        this.materia = '';
    }

    corrigirRedacao( redacao ) {
        redacao.corrigidaPorProfessor = true;
        redacao.feedback = "Correção realizada!";
        return redacao;
    }

    async publicarMaterial(materia, tema, titulo, arquivo) {
        const [result] = await pool.query(
            "INSERT INTO materias (materia, tema, titulo, arquivo, criado_por) VALUES (?, ?, ?, ?, ?)",
            [materia, tema, titulo, arquivo, this.id]
        );
        return { sucesso: true, id: result.insertId };
    }



    editarMaterial( idMaterial, novoArquivo ) {
        await pool.query(
            "UPDATE materias SET arquivo = ? WHERE id = ? AND criado_por = ?",
            [novoArquivo, idMaterial, this.id]
        );
    }

    apagarMaterial( material ) {
        await pool.query(
            "DELETE FROM materiais WHERE id = ? AND criado_por = ?",
            [idMaterial, this.id]
        );
        return true;
    }
}

module.exports = Professor;