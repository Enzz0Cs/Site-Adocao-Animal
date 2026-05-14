import express from 'express';
import AnimalController from '../controllers/AnimalController.js';

const router = express.Router();
router.get('/animais/relatorio', AnimalController.relatorio);
router.get('/animais/relatorio-saude', AnimalController.relatorioSaude);
router.get('/animais', AnimalController.listar);
router.get('/animais/:id', AnimalController.buscarPorId);
router.post('/animais', AnimalController.criar);
router.put('/animais/:id', AnimalController.atualizar);
router.delete('/animais/:id', AnimalController.excluir);


// RF-F3
router.post('/validar-adocao', AnimalController.validar);

export default router;