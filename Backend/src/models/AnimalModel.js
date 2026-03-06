import pool from "../config/database.js";

class AnimalModel {
    static async criar(animal) {
        const { nome_animal, data_cadastro, sexo, raca, porte, idade } = animal;

        const sql = `
            INSERT INTO Animais (nome_animal, data_cadastro, sexo, raca, porte, idade)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [nome_animal, data_cadastro, sexo, raca, porte, idade];
        const [result] = await pool.query(sql, values);

        return { animal_id: result.insertId, ...animal };
    }

    static async listarTodos() {
        const [rows] = await pool.query('SELECT * FROM Animais ORDER BY animal_id DESC');
        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query('SELECT * FROM Animais WHERE animal_id = ?', [id]);
        return rows[0];
    }

    static async atualizar(id, animal) {
        const { nome_animal, data_cadastro, sexo, raca, porte, idade } = animal;

        const sql = `
            UPDATE Animais SET
                nome_animal = ?, data_cadastro = ?, sexo = ?, raca = ?, porte = ?, idade = ?
            WHERE animal_id = ?
        `;

        const values = [nome_animal, data_cadastro, sexo, raca, porte, idade, id];
        const [result] = await pool.query(sql, values);

        if (result.affectedRows === 0) {
            return null;
        }

        return { animal_id: id, ...animal };
    }

    static async excluir(id) {
        const [result] = await pool.query('DELETE FROM Animais WHERE animal_id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async filtrar(termo) {
        const termoBusca = `%${termo}%`;
        const sql = `
            SELECT * FROM Animais
            WHERE nome_animal LIKE ? OR raca LIKE ? OR porte LIKE ? OR idade LIKE ?
            ORDER BY animal_id DESC
        `;
        const [rows] = await pool.query(sql, [termoBusca, termoBusca, termoBusca, termoBusca]);
        return rows;
    }
}

export default AnimalModel;