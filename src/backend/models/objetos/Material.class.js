class Material {
    constructor(id, materia, tema, titulo, arquivo, criado_por, progresso) {
        this.id = id;
        this.materia = materia;
        this.tema = tema;
        this.titulo = titulo;
        this.arquivo = arquivo;
        this.criado_por = criado_por;
        this.progresso = progresso;
    }

    // Atualiza o progresso da atividade
    atualizarProgresso(novoProgresso) {
        this.progresso = novoProgresso;
    }

    // Converte resultado do banco de dados em objeto material
    static fromDB(row) {
        return new Material(
            row.id,
            row.materia,
            row.tema,
            row.titulo,
            row.arquivo,
            row.criado_por,
            row.progresso || 0
        );
    }
}

module.exports = Material;