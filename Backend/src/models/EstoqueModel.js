import pool from "../config/database.js";

class EstoqueModel {
    static async criar(item) {
        const { nome_item, categoria, quantidade_atual, unidade_medida, quantidade_minima, data_validade, peso_volume } = item;

        const sql = `
            INSERT INTO estoque (nome_item, categoria, quantidade_atual, unidade_medida, quantidade_minima, data_validade, peso_volume)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nome_item,
            categoria,
            quantidade_atual,
            unidade_medida,
            quantidade_minima || 0,
            data_validade,
            peso_volume || null
        ];

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
        const { nome_item, categoria, quantidade_atual, unidade_medida, quantidade_minima, data_validade, peso_volume } = item;

        const sql = `
            UPDATE estoque SET
                nome_item = ?, categoria = ?, quantidade_atual = ?, unidade_medida = ?, 
                quantidade_minima = ?, data_validade = ?, peso_volume = ?
            WHERE id = ?
        `;

        const values = [
            nome_item,
            categoria,
            quantidade_atual,
            unidade_medida,
            quantidade_minima,
            data_validade,
            peso_volume || null,
            id
        ];

        const [result] = await pool.query(sql, values);
        return result.affectedRows > 0 ? { id, ...item } : null;
    }


    static async excluir(id) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Remove registros vinculados na tabela de saídas primeiro
            await connection.query('DELETE FROM saídas_estoque WHERE estoque_id = ?', [id]);

            const [result] = await connection.query('DELETE FROM estoque WHERE id = ?', [id]);

            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            console.error("ERRO AO EXCLUIR NO BANCO:", error.message);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async registrarMovimentacaoSaida(estoque_id, quantidade, destino, responsavel_id) {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const sqlHistorico = `
                INSERT INTO saídas_estoque (estoque_id, quantidade_saída, destino, responsável_id) 
                VALUES (?, ?, ?, ?)
            `;
            await connection.query(sqlHistorico, [estoque_id, quantidade, destino, responsavel_id]);

            const sqlUpdate = `
                UPDATE estoque 
                SET quantidade_atual = quantidade_atual - ? 
                WHERE id = ?
            `;
            await connection.query(sqlUpdate, [quantidade, estoque_id]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            console.error("ERRO NA TRANSAÇÃO DE SAÍDA:", error.message);
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default EstoqueModel;