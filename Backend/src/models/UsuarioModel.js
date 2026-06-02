import pool from "../config/database.js";

class UsuarioModel {

    static async buscarPorEmail(email) {
        const sql = `SELECT * FROM usuarios WHERE email = ?`;
        const [rows] = await pool.query(sql, [email]);
        return rows[0];
    }

    static async criar(nome, email, senha, nivel_acesso) {
        const sql = `
            INSERT INTO usuarios (nome, email, senha, nivel_acesso) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [nome, email, senha, nivel_acesso]);
        return result.insertId;
    }

    static async atualizarSenha(email, novaSenha) {
        const sql = `
            UPDATE usuarios 
            SET senha = ? 
            WHERE email = ?
        `;
        const [result] = await pool.query(sql, [novaSenha, email]);
        return result.affectedRows > 0;
    }

    static async salvarResetToken(email, token) {
        const sql = `UPDATE usuarios SET reset_token = ? WHERE email = ?`;
        const [result] = await pool.query(sql, [token, email]);
        return result.affectedRows > 0;
    }

    static async buscarPorResetToken(token) {
        const sql = `SELECT * FROM usuarios WHERE reset_token = ?`;
        const [rows] = await pool.query(sql, [token]);
        return rows[0];
    }

    static async atualizarSenhaPorToken(token, novaSenha) {
        const sql = `UPDATE usuarios SET senha = ?, reset_token = NULL WHERE reset_token = ?`;
        const [result] = await pool.query(sql, [novaSenha, token]);
        return result.affectedRows > 0;
    }
}

export default UsuarioModel;