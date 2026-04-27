import pool from "../config/database.js";

class AdocaoModel {
  static async criar(dados) {
    const { animal_id, adotante_id, data_adocao } = dados;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const [animal] = await connection.query("SELECT nome_animal FROM animais WHERE id = ?", [animal_id]);
      const nomeAnimal = animal[0]?.nome_animal || "Desconhecido";
      const sqlAdocao = "INSERT INTO adocoes (animal_id, adotante_id, data_adocao, observacoes) VALUES (?, ?, ?, ?)";
      const [result] = await connection.query(sqlAdocao, [animal_id, adotante_id, data_adocao, `Adotado: ${nomeAnimal}`]);
      const sqlUpdateStatus = "UPDATE animais SET status_adocao = 'Adotado' WHERE id = ?";
      await connection.query(sqlUpdateStatus, [animal_id]);

      await connection.commit();
      return { id: result.insertId, ...dados };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async listarTodos() {
    try {
      const sql = `
            SELECT 
                a.id, 
                an.nome_animal, 
                ad.NomeCompleto AS NomeCompletoAdotante, 
                a.data_adocao,
                a.observacoes
            FROM adocoes a
            INNER JOIN animais an ON a.animal_id = an.id
            INNER JOIN adotante ad ON a.adotante_id = ad.id 
            ORDER BY a.id DESC
        `;
      const [rows] = await pool.query(sql);
      return rows;
    } catch (error) {
      console.error("ERRO CRÍTICO NO SQL:", error.message);
      throw new Error("Erro no SQL: " + error.message);
    }
  }
  static async excluir(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.query("SELECT animal_id FROM adocoes WHERE id = ?", [id]);

      if (rows.length > 0) {
        const animalId = rows[0].animal_id;
        await connection.query("DELETE FROM adocoes WHERE id = ?", [id]);
        await connection.query("UPDATE animais SET status_adocao = 'Apto' WHERE id = ?", [animalId]);
      } else {
        throw new Error("Adoção não encontrada.");
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error("Erro ao excluir adoção:", error.message);
      throw error;
    } finally {
      connection.release();
    }
  }

}


export default AdocaoModel;