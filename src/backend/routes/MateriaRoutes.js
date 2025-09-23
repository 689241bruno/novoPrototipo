const express = require("express");
const router = express.Router();
const materiasController = require("../controllers/MateriaController");

router.get("/materias/:materia", materiasController.listarMaterias);
router.post("/publicar", materiasController.publicarMateria);

router.post("/progresso", materiasController.atualizarProgresso);
router.get("/progresso/:idUsuario/:materia", materiasController.listarProgressoUsuario);


module.exports = router;
