const express = require("express");
const cors = require("cors");
const usuariosRoutes = require("./routes/UsuariosRoutes");
const materiaRoutes = require("./routes/MateriaRoutes")

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/", usuariosRoutes);
app.use("/materias", materiaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});