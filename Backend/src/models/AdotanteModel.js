import pool from "../config/database.js";

class AdotanteModel {

    static async listarTodos() {
        const sql = `
            SELECT 
                id AS AdotanteID,
                NomeCompleto AS NomeCompletoAdotante,
                CPF AS CPFAdotante,
                RG AS RGAdotante,
                Telefone AS TelefoneAdotante,
                RuaNumero AS RuaNumeroAdotante,
                Bairro AS BairroAdotante,
                CEP AS CEPAdotante,
                email AS email
            FROM adotante 
            ORDER BY id DESC
        `;
        const [rows] = await pool.query(sql);
        return rows;
    }

    static async buscarPorId(id) {
        const sql = `
            SELECT 
                id AS AdotanteID,
                NomeCompleto AS NomeCompletoAdotante,
                CPF AS CPFAdotante,
                RG AS RGAdotante,
                Telefone AS TelefoneAdotante,
                RuaNumero AS RuaNumeroAdotante,
                Bairro AS BairroAdotante,
                CEP AS CEPAdotante,
                email AS email
            FROM adotante 
            WHERE id = ?
        `;
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    }

    static async criar(dados) {
        const sql = `
            INSERT INTO adotante (
                NomeCompleto, 
                CPF, 
                RG,
                Telefone, 
                RuaNumero, 
                Bairro, 
                CEP,
                email
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            dados.NomeCompletoAdotante,
            dados.CPFAdotante,
            dados.RGAdotante,
            dados.TelefoneAdotante,
            dados.RuaNumeroAdotante,
            dados.BairroAdotante,
            dados.CEPAdotante,
            dados.email // ✅ corrigido
        ];

        const [result] = await pool.query(sql, values);

        return { AdotanteID: result.insertId, ...dados };
    }

    static async atualizar(id, dados) {
        const sql = `
            UPDATE adotante SET 
                NomeCompleto = ?, 
                CPF = ?, 
                RG = ?, 
                Telefone = ?, 
                RuaNumero = ?, 
                Bairro = ?, 
                CEP = ?,
                email = ?
            WHERE id = ?
        `;

        const values = [
            dados.NomeCompletoAdotante,
            dados.CPFAdotante,
            dados.RGAdotante,
            dados.TelefoneAdotante,
            dados.RuaNumeroAdotante,
            dados.BairroAdotante,
            dados.CEPAdotante,
            dados.email, // ✅ agora atualiza
            id
        ];

        const [result] = await pool.query(sql, values);

        if (result.affectedRows === 0) {
            return null;
        }

        return { AdotanteID: id, ...dados };
    }

    static async excluir(id) {
        const [result] = await pool.query(
            'DELETE FROM adotante WHERE id = ?', 
            [id]
        );
        return result.affectedRows > 0;
    }

    static async filtrar(termo) {
        const termoBusca = `%${termo}%`;

        const sql = `
            SELECT 
                id AS AdotanteID,
                NomeCompleto AS NomeCompletoAdotante,
                CPF AS CPFAdotante,
                RG AS RGAdotante,
                Telefone AS TelefoneAdotante,
                RuaNumero AS RuaNumeroAdotante,
                Bairro AS BairroAdotante,
                CEP AS CEPAdotante,
                email AS email
            FROM adotante 
            WHERE NomeCompleto LIKE ? 
               OR CPF LIKE ? 
               OR RG LIKE ?
               OR email LIKE ?
            ORDER BY id DESC
        `;

        const [rows] = await pool.query(sql, [
            termoBusca,
            termoBusca,
            termoBusca,
            termoBusca
        ]);

        return rows;
    }
}

export default AdotanteModel;