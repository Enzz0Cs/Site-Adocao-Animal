import pool from "../config/database.js";

class FinanceiroModel {

    static async listarTodos() {
        const [rows] = await pool.query(
            "SELECT * FROM financeiro ORDER BY data_movimento DESC, id DESC"
        );
        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query("SELECT * FROM financeiro WHERE id = ?", [id]);
        return rows[0];
    }

    static async criar(dados) {
        const { tipo, valor, categoria, data_movimento, descricao } = dados;
        const sql = `
            INSERT INTO financeiro (tipo, valor, categoria, data_movimento, descricao)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.query(sql, [tipo, valor, categoria, data_movimento, descricao]);
        return { id: result.insertId, ...dados };
    }

    static async atualizar(id, dados) {
        const { tipo, valor, categoria, data_movimento, descricao } = dados;
        const sql = `
            UPDATE financeiro SET
                tipo = ?, valor = ?, categoria = ?, data_movimento = ?, descricao = ?
            WHERE id = ?
        `;
        const [result] = await pool.query(sql, [tipo, valor, categoria, data_movimento, descricao, id]);
        return result.affectedRows > 0 ? { id, ...dados } : null;
    }

    static async excluir(id) {
        const [result] = await pool.query("DELETE FROM financeiro WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }

    static async filtrar(termo) {
        const busca = `%${termo}%`;
        const sql = `
            SELECT * FROM financeiro
            WHERE descricao LIKE ? OR categoria LIKE ?
            ORDER BY data_movimento DESC, id DESC
        `;
        const [rows] = await pool.query(sql, [busca, busca]);
        return rows;
    }
}

export default FinanceiroModel;