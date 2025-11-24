const express = require("express");
const router = express.Router();
const DesafiosController = require("../controllers/DesafiosController");

// CRUD
router.get("/", DesafiosController.listarDesafios);
router.post("/", DesafiosController.criarDesafio);
router.put("/:id", DesafiosController.editarDesafio);
router.delete("/:id", DesafiosController.deletarDesafio);

// Progresso
router.get("/progresso/:usuario_id", DesafiosController.listarProgressoUsuario);
router.post("/progresso", DesafiosController.registrarProgresso);
router.put("/progresso/concluido", DesafiosController.marcarConcluida);

module.exports = router;