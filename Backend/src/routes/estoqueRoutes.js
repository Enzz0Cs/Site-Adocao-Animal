import express from 'express';
import EstoqueController from '../controllers/EstoqueController.js';

const router = express.Router();
router.get('/historico', EstoqueController.listarHistorico);
router.post('/saida', EstoqueController.registrarSaida);
router.post('/', EstoqueController.salvar);
router.get('/', EstoqueController.listar);
router.get('/:id', EstoqueController.buscarPorId);
router.put('/:id', EstoqueController.salvar);
router.delete('/:id', EstoqueController.excluir);

export default router;