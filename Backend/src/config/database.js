import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });


console.log('--- DEBUG RÁPIDO ---');

console.log('Banco alvo:', process.env.DB_NAME);

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('CONEXÃO COM O BANCO BEM SUCEDIDA!');
    connection.release();
  })
  .catch(err => {
    console.error('ERRO NO BANCO:', err.code);
  });

export default pool;