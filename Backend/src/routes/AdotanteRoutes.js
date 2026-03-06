import express from 'express';
import AdotanteController from '../controllers/AdotanteController.js';

const router = express.Router();

router.get('/adotantes', AdotanteController.listar);
router.get('/adotantes/:id', AdotanteController.buscarPorId);
router.post('/adotantes', AdotanteController.criar);
router.put('/adotantes/:id', AdotanteController.atualizar);
router.delete('/adotantes/:id', AdotanteController.excluir);

export default router;