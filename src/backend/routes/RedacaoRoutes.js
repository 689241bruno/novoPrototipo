const express = require("express");
const router = express.Router();
const RedacaoController = require("../controllers/RedacaoController");

router.get("/", RedacaoController.listarTemas);
router.get("/:id", RedacaoController.buscarTema);
router.post("/", RedacaoController.adicionarTema);
router.put("/:id", RedacaoController.editarTema);
router.delete("/:id", RedacaoController.deletarTema);

module.exports = router;