import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/registrar", AuthController.registrar);
router.put("/resetar-senha", AuthController.resetarSenha);
router.post("/redefinir-senha", AuthController.redefinirSenha);
export default router;