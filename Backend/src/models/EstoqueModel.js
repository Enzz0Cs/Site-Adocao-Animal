import pool from "../config/database.js";

class EstoqueModel {
    static async criar(item) {
        const { nome_item, categoria, quantidade_atual, unidade_medida, quantidade_minima, data_validade } = item;

        const sql = `
            INSERT INTO estoque (nome_item, categoria, quantidade_atual, unidade_medida, quantidade_minima, data_validade)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [nome_item, categoria, quantidade_atual, unidade_medida, quantidade_minima, data_validade];
        const [result] = await pool.query(sql, values);

        return { id: result.insertId, ...item };
    }

    static async listarTudo() {
        const [rows] = await pool.query('SELECT * FROM estoque ORDER BY nome_item ASC');
        return rows;
    }

    static async listarCriticos() {
        const sql = 'SELECT * FROM estoque WHERE quantidade_atual <= quantidade_minima';
        const [rows] = await pool.query(sql);
        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query('SELECT * FROM estoque WHERE id = ?', [id]);
        return rows[0];
    }

    static async atualizar(id, item) {
        const { nome_item, categoria, quantidade_atual, unidade_medida, quantidade_minima, data_validade } = item;

        const sql = `
            UPDATE estoque SET
                nome_item = ?, categoria = ?, quantidade_atual = ?, unidade_medida = ?, 
                quantidade_minima = ?, data_validade = ?
            WHERE id = ?
        `;

        const values = [nome_item, categoria, quantidade_atual, unidade_medida, quantidade_minima, data_validade, id];
        const [result] = await pool.query(sql, values);

        return result.affectedRows > 0 ? { id, ...item } : null;
    }

    static async atualizarQuantidade(id, novaQuantidade) {
        const sql = 'UPDATE estoque SET quantidade_atual = ? WHERE id = ?';
        const [result] = await pool.query(sql, [novaQuantidade, id]);
        return result.affectedRows > 0;
    }

    static async excluir(id) {
        const [result] = await pool.query('DELETE FROM estoque WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

export default EstoqueModel;