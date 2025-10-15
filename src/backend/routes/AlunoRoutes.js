const express = require("express");
const router = express.Router();
const AlunoController = require("../controllers/AlunoController");

router.get("/alunos/listar", AlunoController.listarAlunos);
router.post("/alunos/cadastrar", AlunoController.cadastrarAluno);
router.put("/alunos/editar/:usuario_id", AlunoController.editarAluno);
router.delete("/alunos/deletar/:usuario_id", AlunoController.deletarAluno);
router.get("/alunos/buscar/:usuario_id", AlunoController.buscarAlunoPorId);
router.put("/alunos/modo-intensivo/:usuario_id", AlunoController.ativarModoIntensivo);
router.get("/alunos/ranking/:usuario_id", AlunoController.checkRanking);

module.exports = router;