import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import animalRoutes from './routes/animalRoutes.js';

dotenv.config();
const PORT = process.env.PORT;
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', animalRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'API adoção está rodando' })
})


app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' })
})

app.listen(PORT, () => {
    console.log('Servidor rodando na porta:' + PORT)
})

export default app;








