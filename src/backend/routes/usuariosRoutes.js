const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/UsuariosController");

router.get("/usuarios", usuarioController.listarUsuarios);
router.post("/cadusuario", usuarioController.criarUsuario);
router.post("/login", usuarioController.login);
router.put("/editusuario", usuarioController.editarUsuario);
router.delete("/delusuario", usuarioController.deletarUsuario);

router.get("/verificar-tipo", usuarioController.verficarTipo);
router.get("/check-user", usuarioController.checkUser);
router.get("/check-user-pass", usuarioController.checkUserPass);
router.post("/recuperar-senha", usuarioController.recuperarSenha);

module.exports = router;