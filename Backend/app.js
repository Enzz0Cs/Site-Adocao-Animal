import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import animalRoutes from './src/routes/animalRoutes.js';
import vacinaRoutes from './src/routes/vacinasRoutes.js';
import adotanteRoutes from './src/routes/AdotanteRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import estoqueRoutes from './src/routes/estoqueRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'API Abrigo está rodando perfeitamente!' });
});


app.use('/api', animalRoutes);
app.use('/api', vacinaRoutes);
app.use('/api', adotanteRoutes);
app.use('/api', authRoutes);
app.use('/api', estoqueRoutes);


app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta: ${PORT}`);
    console.log(`🔗 Endpoints disponíveis em http://localhost:${PORT}/api`);
});

export default app;