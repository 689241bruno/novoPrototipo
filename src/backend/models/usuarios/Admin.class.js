const Usuario = require("./Usuario.class");

class Admin {
    constructor(...args) {
        super(...args);
    }

    static async cadastrar(usuario_id) {
        try {
            const [result] = await pool.query(
                "INSERT INTO admins (usuario_id) VALUES (?)",
                [usuario_id]
            );
            return { id: result.insertId, usuario_id };
        } catch (err) {
            console.error("Erro ao cadastrar admin:", err.sqlMessage || err.message);
            throw new Error("Erro ao cadastrar admin: " + (err.sqlMessage || err.message));
        }
    }

    async listar() {
        const [rows] = await pool.query("SELECT id, nome, email FROM usuarios");
        return rows;
    }
} 

module.exports = Admin;