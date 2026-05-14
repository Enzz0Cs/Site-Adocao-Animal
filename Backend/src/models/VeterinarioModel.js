import pool from "../config/database.js";

class VeterinarioModel {

    static async listarTodos() {
        const sql = `
            SELECT 
                id AS VeterinarioID,
                NomeCompleto AS NomeCompletoVeterinario,
                CPF AS CPFVeterinario,
                CRMV AS CRMVVeterinario,
                Especialidade AS EspecialidadeVeterinario,
                Telefone AS TelefoneVeterinario,
                email AS email,
                Endereco AS EnderecoVeterinario,
                Status AS StatusVeterinario
            FROM veterinario 
            ORDER BY id DESC
        `;
        const [rows] = await pool.query(sql);
        return rows;
    }

    static async buscarPorId(id) {
        const sql = `
            SELECT 
                id AS VeterinarioID,
                NomeCompleto AS NomeCompletoVeterinario,
                CPF AS CPFVeterinario,
                CRMV AS CRMVVeterinario,
                Especialidade AS EspecialidadeVeterinario,
                Telefone AS TelefoneVeterinario,
                email AS email,
                Endereco AS EnderecoVeterinario,
                Status AS StatusVeterinario
            FROM veterinario 
            WHERE id = ?
        `;
        const [rows] = await pool.query(sql, [id]);
        return rows[0];
    }

    static async criar(dados) {
        const sql = `
            INSERT INTO veterinario (
                NomeCompleto,
                CPF,
                CRMV,
                Especialidade,
                Telefone,
                email,
                Endereco,
                Status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            dados.NomeCompletoVeterinario,
            dados.CPFVeterinario,
            dados.CRMVVeterinario,
            dados.EspecialidadeVeterinario,
            dados.TelefoneVeterinario,
            dados.email,
            dados.EnderecoVeterinario,
            dados.StatusVeterinario ?? 'Ativo'
        ];

        const [result] = await pool.query(sql, values);

        return { VeterinarioID: result.insertId, ...dados };
    }

    static async atualizar(id, dados) {
        const sql = `
            UPDATE veterinario SET 
                NomeCompleto = ?,
                CPF = ?,
                CRMV = ?,
                Especialidade = ?,
                Telefone = ?,
                email = ?,
                Endereco = ?,
                Status = ?
            WHERE id = ?
        `;

        const values = [
            dados.NomeCompletoVeterinario,
            dados.CPFVeterinario,
            dados.CRMVVeterinario,
            dados.EspecialidadeVeterinario,
            dados.TelefoneVeterinario,
            dados.email,
            dados.EnderecoVeterinario,
            dados.StatusVeterinario,
            id
        ];

        const [result] = await pool.query(sql, values);

        if (result.affectedRows === 0) {
            return null;
        }

        return { VeterinarioID: id, ...dados };
    }

    static async excluir(id) {
        const [result] = await pool.query(
            'DELETE FROM veterinario WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async filtrar(termo) {
        const termoBusca = `%${termo}%`;

        const sql = `
            SELECT 
                id AS VeterinarioID,
                NomeCompleto AS NomeCompletoVeterinario,
                CPF AS CPFVeterinario,
                CRMV AS CRMVVeterinario,
                Especialidade AS EspecialidadeVeterinario,
                Telefone AS TelefoneVeterinario,
                email AS email,
                Endereco AS EnderecoVeterinario,
                Status AS StatusVeterinario
            FROM veterinario 
            WHERE NomeCompleto LIKE ?
               OR CPF LIKE ?
               OR CRMV LIKE ?
               OR Especialidade LIKE ?
               OR email LIKE ?
            ORDER BY id DESC
        `;

        const [rows] = await pool.query(sql, [
            termoBusca,
            termoBusca,
            termoBusca,
            termoBusca,
            termoBusca
        ]);

        return rows;
    }
}

export default VeterinarioModel;