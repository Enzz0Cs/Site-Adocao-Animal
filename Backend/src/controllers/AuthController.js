import { randomBytes } from "crypto";
import UsuarioModel from "../models/UsuarioModel.js";
import { enviarEmailRedefinicaoSenha } from "../services/emailService.js";

class AuthController {

    static async login(req, res) {
        const { email, senha } = req.body;
        const usuario = await UsuarioModel.buscarPorEmail(email);

        if (!usuario) {
            return res.status(401).json({ error: "Usuario nao encontrado" });
        }

        if (usuario.senha !== senha) {
            return res.status(401).json({ error: "Senha incorreta" });
        }

        res.json({
            id: usuario.id,
            nome: usuario.nome,
            nivel: usuario.nivel_acesso
        });
    }

    static async registrar(req, res) {
        const { nome, email, senha, nivel_acesso } = req.body;

        try {
            const existe = await UsuarioModel.buscarPorEmail(email);
            if (existe) {
                return res.status(400).json({ error: "E-mail ja cadastrado" });
            }

            const id = await UsuarioModel.criar(nome, email, senha, nivel_acesso || "usuario");
            res.status(201).json({ message: "Cadastrado com sucesso!", id });
        } catch (error) {
            res.status(500).json({ error: "Erro ao cadastrar usuario" });
        }
    }

    static async resetarSenha(req, res) {
        const { email } = req.body;

        try {
            if (!email) {
                return res.status(400).json({ error: "E-mail e obrigatorio" });
            }

            const usuario = await UsuarioModel.buscarPorEmail(email);
            if (!usuario) {
                return res.status(404).json({ error: "Usuario nao encontrado" });
            }

            const senhaTemporaria = randomBytes(4).toString("hex");
            const sucesso = await UsuarioModel.atualizarSenha(email, senhaTemporaria);
            if (!sucesso) {
                return res.status(404).json({ error: "Usuario nao encontrado" });
            }

            try {
                await enviarEmailRedefinicaoSenha(email, usuario.nome, senhaTemporaria);
            } catch (emailError) {
                await UsuarioModel.atualizarSenha(email, usuario.senha);
                console.error("Erro ao enviar e-mail de redefinicao:", emailError.message);
                return res.status(500).json({ error: "Erro ao enviar e-mail de redefinicao" });
            }

            res.json({ message: "Enviamos uma senha temporaria para seu e-mail." });
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar senha" });
        }
    }
}

export default AuthController;
