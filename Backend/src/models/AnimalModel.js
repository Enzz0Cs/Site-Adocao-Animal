import pool from "../config/database.js";

class AnimalModel {
    static async criar(animal) {

    const {
        nome_animal,
        data_cadastro,
        sexo,
        raca,
        porte,
        idade
    } = animal;

    // 🔴 VALIDAÇÃO BÁSICA
    if (!nome_animal || !data_cadastro) {
        throw new Error("Nome e data são obrigatórios");
    }

    const sql = `
        INSERT INTO animais 
        (nome_animal, data_cadastro, sexo, raca, porte, idade, status_adocao)
        VALUES (?, ?, ?, ?, ?, ?, 'Em análise')
    `;

    const values = [
        nome_animal,
        data_cadastro,
        sexo || null,
        raca || null,
        porte || null,
        idade || null
    ];

    const [result] = await pool.query(sql, values);

    return { id: result.insertId, ...animal };
}

    static async listarTodos() {
        const [rows] = await pool.query('SELECT * FROM animais ORDER BY id DESC');
        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query('SELECT * FROM animais WHERE id = ?', [id]);
        return rows[0];
    }

    static async atualizar(id, animal) {
        const { nome_animal, data_cadastro, sexo, raca, porte, idade, status_adocao } = animal;

        const sql = `
            UPDATE animais SET
                nome_animal = ?, data_cadastro = ?, sexo = ?, raca = ?, porte = ?, idade = ?, status_adocao = ?
            WHERE id = ?
        `;

        const values = [nome_animal, data_cadastro, sexo, raca, porte, idade, status_adocao || 'Em análise', id];
        const [result] = await pool.query(sql, values);

        if (result.affectedRows === 0) {
            return null;
        }

        return { id, ...animal };
    }

    static async excluir(id) {
        const [result] = await pool.query('DELETE FROM animais WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async filtrar(termo) {
        const termoBusca = `%${termo}%`;
        const sql = `
            SELECT * FROM animais
            WHERE nome_animal LIKE ? OR raca LIKE ? OR porte LIKE ? OR status_adocao LIKE ?
            ORDER BY id DESC
        `;
        const [rows] = await pool.query(sql, [termoBusca, termoBusca, termoBusca, termoBusca]);
        return rows;
    }

    // 🔍 VERIFICAR VACINAS
static async verificarVacinas(animalId) {
    const [rows] = await pool.query(
        "SELECT * FROM animal_vacina WHERE animal_id = ?",
        [animalId]
    );
    return rows;
}

// 🔍 VERIFICAR PROCEDIMENTOS
static async verificarProcedimentos(animalId) {
    const [rows] = await pool.query(
        "SELECT * FROM procedimentos_veterinarios WHERE animal_id = ?",
        [animalId]
    );
    return rows;
}

// 💾 SALVAR VALIDAÇÃO
static async salvarValidacao({ animalId, status, justificativa }) {
    await pool.query(
        `UPDATE animais 
         SET status_adocao = ?, justificativa = ?, data_validacao = NOW()
         WHERE id = ?`,
        [status, justificativa, animalId]
    );
}
}

export default AnimalModel;