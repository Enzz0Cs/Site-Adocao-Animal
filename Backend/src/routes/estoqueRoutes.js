import express from 'express';
import EstoqueController from '../controllers/EstoqueController.js';

const router = express.Router();

router.get('/estoque', EstoqueController.listar);
router.get('/estoque/:id', EstoqueController.buscarPorId);
router.post('/estoque', EstoqueController.criar);
router.put('/estoque/:id', EstoqueController.atualizar);
router.delete('/estoque/:id', EstoqueController.excluir);

export default router;