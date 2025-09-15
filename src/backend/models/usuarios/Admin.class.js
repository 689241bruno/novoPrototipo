const Usuario = require("./Usuario.class");

class Admin extends Usuario {
    constructor(...args) {
        super(...args);
    }

    async listarUsuarios() {
        const [rows] = await pool.query("SELECT id, nome, email FROM usuarios");
        return rows;
    }
} 

module.exports = Admin;