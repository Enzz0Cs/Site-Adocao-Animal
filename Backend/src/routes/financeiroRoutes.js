import express from 'express';
import FinanceiroController from '../controllers/FinanceiroController.js';

const router = express.Router();

router.get('/financeiro', FinanceiroController.listar);
router.get('/financeiro/:id', FinanceiroController.buscarPorId);
router.post('/financeiro', FinanceiroController.criar);
router.put('/financeiro/:id', FinanceiroController.atualizar);
router.delete('/financeiro/:id', FinanceiroController.excluir);

export default router;