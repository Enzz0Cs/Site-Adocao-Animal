const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar todas as vacinas
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vacinas');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar vacinas' });
  }
});

// Cadastrar nova vacina
router.post('/', async (req, res) => {
  const { codigo, vacina } = req.body;
  try {
    await pool.query('INSERT INTO vacinas (codigo, vacina, created_at, updated_at) VALUES (?, ?, NOW(), NOW())', [codigo, vacina]);
    res.status(201).json({ message: 'Vacina cadastrada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar vacina' });
  }
});

// Editar vacina
router.put('/:id', async (req, res) => {
  const { codigo, vacina } = req.body;
  try {
    await pool.query('UPDATE vacinas SET codigo = ?, vacina = ?, updated_at = NOW() WHERE id = ?', [codigo, vacina, req.params.id]);
    res.json({ message: 'Vacina atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar vacina' });
  }
});

// Excluir vacina
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM vacinas WHERE id = ?', [req.params.id]);
    res.json({ message: 'Vacina excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir vacina' });
  }
});

module.exports = router;


