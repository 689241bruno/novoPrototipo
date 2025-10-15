const Usuario = require("../models/usuarios/Usuario.class");
const Aluno = require("../models/usuarios/Aluno.class");
const Professor = require("../models/usuarios/Professor.class");
const Admin = require("../models/usuarios/Admin.class");

// Lista todos os usuários
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.listar();
        res.json(usuarios);
    } catch (error) {
        console.error("Erro na listagem: ", error);
        res.status(500).send("Erro ao listar usuários!");
    }
};

// Cria um novo usuário 
exports.criarUsuario = async (req, res) => {
    console.log("📩 Dados recebidos no cadastro:", req.body);
    const { nome, email, senha, is_aluno, is_professor, is_admin } = req.body;

    const pool = require("../config/db");
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Cria o usuário base
        const usuario = await Usuario.cadastrar(
            nome,
            email,
            senha,
            is_aluno,
            is_professor,
            is_admin,
            connection // 👈 passa a conexão aqui
        );

        const usuario_id = usuario.id;

        // Se for aluno
        if (is_aluno) {
            await Aluno.cadastrar(usuario_id, false, "", null, connection); // 👈 mesma conexão
        }

        // Se for professor
        if (is_professor) {
            await Professor.cadastrar(usuario_id, connection);
        }

        // Se for admin
        if (is_admin) {
            await Admin.cadastrar(usuario_id, connection);
        }

        await connection.commit();

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            usuario_id,
            nome,
            email,
            is_aluno,
            is_professor,
            is_admin,
        });
    } catch (err) {
        await connection.rollback();
        console.error("Erro no cadastro:", err);
        res.status(500).json({ erro: "Erro ao criar usuário!" });
    } finally {
        connection.release();
    }
};

// Login 
exports.login = async (req, res) => {
    const { email, senha } = req.body;
    try { 
        const usuario = await Usuario.login(email, senha);
        
        if (usuario) {
            res.status(200).json({ 
                mensagem: "Usuário logado com sucesso!",
                usuario: usuario
            });
        } else {
            res.status(401).json({ erro: "Email ou senha inválidos!" });
        }   
    } catch (err) {
        console.error("Erro no login: ", err);
        res.status(500).json({ erro: "Erro no servidor." });
    }
};

// Editar 
exports.editarUsuario = async (req, res) => {
    const { id, dados } = req.body;
    try { 
        await Usuario.editar( id, dados );
        res.json({ mensagem: "Usuário atualizado com sucesso!" });
    } catch (err) {
        console.error("Erro no editor: ", err);
        res.status(500).json({ erro: "Erro ao editar usuário!" });
    }
};

// Deletar
exports.deletarUsuario = async (req, res) => {
    const { id } = req.body;
    try {
        await Usuario.deletar(id);
        res.json({ mesnagem: "Usuário deletado com sucesso!" });
    } catch (err) {
        console.error("Erro no deletar: ", err);
        res.status(500).json({ erro: "Erro ao deletar usuário! "});
    }
};

// Verificar tipo de usuário
exports.verficarTipo = async (req, res) => {
    const { email } = req.query;

    try {
        const tipo = await Usuario.checkUserType(email);
        if (!tipo) {
            return res.status(404).json({ existe: false, erro: "Usuário não encontrado" });
        }

        console.log("Dados retornados de checkUserType:", tipo);

        res.json({
            existe: true, 
            id: tipo.id,
            nome: tipo.nome,
            is_professor: tipo.is_professor
        });
    } catch (err) {
        console.error("Erro no verificar tipo: ", err);
        res.status(500).json({ erro: "Erro ao verificar tipo de usuário! "});
    }
};

// Verifica se usuário existe
exports.checkUser = async (req, res) => {
    const { email } = req.query;
    try {
        const existe = await Usuario.checkUser(email);
        res.json({ existe });
    } catch (err) {
        console.error("Erro ao checar usuário: ", err);
        res.status(500).json({ erro: "Erro ao verificar usuário!" });
    }
};

// Verifica se email+senha são válidos
exports.checkUserPass = async (req, res) => {
    const { email, senha } = req.body;
    try { 
        const valido = await Usuario.checkUserPass(email, senha);
        res.json({ valido });
    } catch (err) {
        console.error("Erro ao verificar usuário e senha: ", err);
        res.status(500).json({ erro: "Erro ao verificar email/senha! "});
    }
};

// Recuperar senha
exports.recuperarSenha = async (req, res) => {
    const {email} = req.body;
    try {
        const existe = await Usuario.checkUser(email);

        if (existe) {
            res.status(200).json({ mensagem: "Código enviado para o email!" });
        } else {
            res.status(404).json({ erro: "Email não encontrado!" });
        }
    } catch (error) {
        console.error("Erro no recuperar senha: ", error);
        res.status(500).json({ erro: "Erro no servidor ao recuperar senha!" });
    }
};