const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // ajuste se seu usuário for diferente
  password: 'volVis20$', // ajuste se tiver senha configurada
  database: 'abrigo_vacinas' // certifique-se que este schema existe
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL com sucesso!');
});

// Rota para listar vacinas
// Rota para listar vacinas
app.get('/vacinas', (req, res) => {
  const sql = 'SELECT id, codigo, nome, cadastrado_em FROM vacinas ORDER BY id ASC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar vacinas:', err.sqlMessage);
      return res.status(500).send('Erro ao buscar vacinas');
    }
    res.json(results);
  });
});


// Rota para cadastrar vacina
app.post('/vacinas', (req, res) => {
  const { codigo, nome } = req.body;
  const sql = 'INSERT INTO vacinas (codigo, nome, cadastrado_em) VALUES (?, ?, NOW())';
  db.query(sql, [codigo, nome], (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar vacina:', err.sqlMessage);
      return res.status(500).send('Erro ao cadastrar vacina');
    }
    res.send({ id: result.insertId, codigo, nome });
  });
});

// Rota para atualizar vacina
app.put('/vacinas/:id', (req, res) => {
  const { id } = req.params;
  const { codigo, nome } = req.body;
  const sql = 'UPDATE vacinas SET codigo = ?, nome = ?, cadastrado_em = NOW() WHERE id = ?';
  db.query(sql, [codigo, nome, id], (err) => {
    if (err) {
      console.error('Erro ao atualizar vacina:', err.sqlMessage);
      return res.status(500).send('Erro ao atualizar vacina');
    }
    res.send({ id, codigo, nome });
  });
});

// Rota para excluir vacina
app.delete('/vacinas/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM vacinas WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Erro ao excluir vacina:', err.sqlMessage);
      return res.status(500).send('Erro ao excluir vacina');
    }
    res.send({ message: 'Vacina excluída com sucesso!' });
  });
});

// Iniciar servidor
app.listen(3001, () => {
  console.log('Backend rodando na porta 3001');
});
