const express = require("express");
const router = express.Router();
const materiasController = require("../controllers/MateriaController");
const upload = require("../middleware/upload");

router.get("/materias/:materia", materiasController.listarMaterias);
router.post("/materias/publicar", upload.single("arquivo"), async (req, res) => {
    try {
      console.log("Arquivo recebido:", req.file);
      if (!req.file) {
        return res.status(400).json({ erro: "Nenhum arquivo enviado" });
      }
      await materiasController.publicarMateria(req, res);
    } catch (err) {
      console.error("Erro na rota /publicar:", err);
      res.status(500).json({ erro: "Erro interno no servidor" });
    }
  }
);

router.post("/materias/progresso", materiasController.atualizarProgresso);
router.get("/materias/progresso/:idUsuario/:atividade_id", materiasController.listarProgressoUsuario);
router.get("/materias/pdf/:id", materiasController.verPDF);

module.exports = router;
