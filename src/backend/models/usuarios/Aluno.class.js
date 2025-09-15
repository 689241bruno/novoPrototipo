const Usuario = require("./Usuario.class");

class Aluno extends Usuario {
    constructor(...args) {
        super(...args);
        this.modoIntensivo = false;
        this.diagnostico  = "";
        this.planoestudos = [];
        this.ranking = 0;
        this.xp = 0;
        this.progresso = 0;
        this.historicoAtividades = [];
        this.conquistas = [];
        this.notasSimulados = [];
        this.redacoes = [];
        this.flashcards = [];
    }

    enviarRedacao ( redacao ) {
        this.redacoes.push(redacao);
        return true;
    }

    criarFlashcard ( flashcard ) {
        this.flashcard.push(flashcard);
        return true;
    }

    ativarModoIntensivo ( modoIntensivo ) {
        this.modoIntensivo = true;
    }

    checkRanking ( ranking ) {
        checkRanking() {
            return this.ranking;
        }
    }
}

module.exports = Aluno;