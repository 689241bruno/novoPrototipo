const express = require("express");
const cors = require("cors");
const usuariosRoutes = require("./routes/usuariosRoutes");
const materiaRoutes = require("./routes/MateriaRoutes")

const app = express();
app.use(cors());
app.use(express.json());

// Aumenta o limite de payload para JSON e form-data
app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Rotas
app.use("/", usuariosRoutes);
app.use("/", materiaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});