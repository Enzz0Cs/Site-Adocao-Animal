import { v4 as uuidv4 } from 'uuid';
import { enviarEmailConfirmacao } from "../services/emailService.js";
import pool from "../config/database.js";

class AdocaoModel {

  static async criar(dados) {
    const { animal_id, adotante_id, data_adocao } = dados;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const token = uuidv4();

      const [animal] = await connection.query(
        "SELECT nome_animal FROM animais WHERE id = ?", 
        [animal_id]
      );

      const [adotante] = await connection.query(
        "SELECT NomeCompleto, email FROM adotante WHERE id = ?", 
        [adotante_id]
      );

      const nomeAnimal = animal[0]?.nome_animal;
      const nomeAdotante = adotante[0]?.NomeCompleto;
      const email = adotante[0]?.email;

      const documento = `
Eu, ${nomeAdotante}, declaro que estou ciente da responsabilidade pela adoção do animal ${nomeAnimal}.
      `;

      await connection.query(`
        INSERT INTO adocoes 
        (animal_id, adotante_id, data_adocao, observacoes, status, documento, token_confirmacao)
        VALUES (?, ?, ?, ?, 'Aguardando confirmação', ?, ?)
      `, [
        animal_id,
        adotante_id,
        data_adocao,
        `Adotado: ${nomeAnimal}`,
        documento,
        token
      ]);

      await connection.query(
        "UPDATE animais SET status_adocao = 'Em processo' WHERE id = ?",
        [animal_id]
      );

      const link = `http://localhost:3001/api/adocoes/confirmar/${token}`;

      try {
        await enviarEmailConfirmacao(email, nomeAdotante, link);
        console.log("Email enviado para:", email);
      } catch (e) {
        console.log("Erro ao enviar email:", e.message);
      }

      await connection.commit();
      return true;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async listarTodos() {
    const [rows] = await pool.query(`
      SELECT 
        a.id, 
        an.nome_animal, 
        ad.NomeCompleto AS NomeCompletoAdotante, 
        a.data_adocao,
        a.status,
        a.documento,
        a.data_assinatura
      FROM adocoes a
      INNER JOIN animais an ON a.animal_id = an.id
      INNER JOIN adotante ad ON a.adotante_id = ad.id 
      ORDER BY a.id DESC
    `);

    return rows;
  }

  static async confirmarPorToken(token) {
    await pool.query(`
      UPDATE adocoes 
      SET status = 'Confirmado'
      WHERE token_confirmacao = ?
    `, [token]);
  }

  static async finalizar(id) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [rows] = await connection.query(
        "SELECT animal_id FROM adocoes WHERE id = ?", 
        [id]
      );

      const animalId = rows[0].animal_id;

      await connection.query(
        "UPDATE adocoes SET status = 'Finalizada', data_assinatura = NOW() WHERE id = ?",
        [id]
      );

      await connection.query(
        "UPDATE animais SET status_adocao = 'Adotado' WHERE id = ?",
        [animalId]
      );

      await connection.commit();

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async excluir(id) {
    await pool.query("DELETE FROM adocoes WHERE id = ?", [id]);
  }
}

export default AdocaoModel;