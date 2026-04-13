import express from "express";
import ValidacaoController from "../controllers/ValidacaoController.js";

const router = express.Router();

router.post("/validar-adocao", ValidacaoController.validar);

export default router;