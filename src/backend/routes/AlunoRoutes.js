const express = require("express");
const router = express.Router();
const AlunoController = require("../controllers/AlunoController");

router.get("/listar", AlunoController.listarAlunos);
router.post("/cadastrar", AlunoController.cadastrarAluno);
router.put("/editar/:id", AlunoController.editarAluno);
router.delete("/deletar/:id", AlunoController.deletarAluno);
router.get("/buscar/:id", AlunoController.buscarAlunoPorId);
router.put("/modo-intensivo/:id", AlunoController.ativarModoIntensivo);
router.get("/ranking/:id", AlunoController.checkRanking);

module.exports = router;
