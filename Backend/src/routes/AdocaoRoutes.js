import express from 'express';
import AdocaoController from '../controllers/AdocaoController.js';

const router = express.Router();

router.get('/adocoes', AdocaoController.listar);
router.post('/adocoes', AdocaoController.criar);
router.get('/adocoes/confirmar/:token', AdocaoController.confirmar);
router.post('/adocoes/:id/finalizar', AdocaoController.finalizar);
router.delete('/adocoes/:id', AdocaoController.excluir);

export default router;