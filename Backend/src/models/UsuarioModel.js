import pool from "../config/database.js";

class UsuarioModel {

    static async buscarPorEmail(email) {

        const sql = `
            SELECT *
            FROM usuarios
            WHERE email = ?
        `;

        const [rows] = await pool.query(sql, [email]);

        return rows[0];
    }

}

export default UsuarioModel;