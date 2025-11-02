const Usuario = require("../models/usuarios/Usuario.class");
const Aluno = require("../models/usuarios/Aluno.class");

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
    try {
        console.log("📦 Dados recebidos do frontend:", req.body);
        const { nome, email, senha, is_aluno, is_professor, is_admin } = req.body;

        const pool = require("../config/db");
        const connection = await pool.getConnection();

        // Se não vier nada do frontend, define aluno como padrão
        const alunoFlag = is_aluno ?? 1;
        const professorFlag = is_professor ?? 0;
        const adminFlag = is_admin ?? 0;

        // Cria o usuário base
        const usuario = await Usuario.cadastrar(
            nome,
            email,
            senha,
            alunoFlag,
            professorFlag,
            adminFlag,
            connection
        );

        const usuario_id = usuario.id;

        // Se for aluno, cria o registro em alunos
        if (alunoFlag === 1) {
            await Aluno.cadastrar(usuario_id, false, "", null, connection);
        }

        connection.release();

        res.status(201).json({
            mensagem: "Usuário criado com sucesso!",
            id: usuario_id,
            nome,
            email,
            is_aluno: alunoFlag,
            is_professor: professorFlag,
            is_admin: adminFlag
        });
    } catch (err) {
        console.error("Erro no cadastro do usuário:", err);
        res.status(500).json({ erro: "Erro ao criar usuário!" });
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
    const { id, dados } = req.body; // remover "materia"
    const pool = require("../config/db");
    const connection = await pool.getConnection();

    try {
        // Busca o usuário para conferir existência
        const [rows] = await connection.query(
            "SELECT id FROM usuarios WHERE id = ?",
            [id]
        );
        if (rows.length === 0) throw new Error("Usuário não encontrado.");

        // Atualiza apenas a tabela usuarios
        await Usuario.editar(id, dados);

        connection.release();
        res.json({ mensagem: "Usuário atualizado com sucesso!" });
    } catch (err) {
        connection.release();
        console.error("Erro ao editar usuário:", err);
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
            is_professor: tipo.is_professor,
            is_admin: tipo.is_admin
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

