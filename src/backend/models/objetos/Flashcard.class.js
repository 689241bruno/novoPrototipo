class flashcard {
    constructor( id, pergunta, resposta, materia ) {
        this.id = id;
        this.pergunta = pergunta;
        this.resposta = resposta;
        this.materia = materia;
        this.ultimaRevisao = new Date();
        this.proximaRevisao = null;
    }

    revisar() {
        this.ultimaRevisao = new Date();
        let novaData = new Date();
        novaData.setDate(novaData.getDate() + 7);
        this.proximaRevisao = novaData;
    }
}

module.exports = Flashcard;