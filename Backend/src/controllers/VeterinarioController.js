import VeterinarioModel from "../models/VeterinarioModel.js";
import pool from "../config/database.js";

class VeterinarioController {

  static async listar(req, res) {
    try {
      const termoBusca = req.query.busca;

      let veterinarios;

      if (termoBusca) {
        veterinarios = await VeterinarioModel.filtrar(termoBusca);
      } else {
        veterinarios = await VeterinarioModel.listarTodos();
      }

      res.status(200).json(veterinarios);
    } catch (error) {
      console.error("Erro ao listar:", error);
      res.status(500).json({ error: "Erro ao buscar veterinários" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const id = req.params.id;
      const veterinario = await VeterinarioModel.buscarPorId(id);
      if (!veterinario) {
        return res.status(404).json({ error: "Veterinário não encontrado" });
      }
      res.status(200).json(veterinario);
    } catch (error) {
      console.error("Erro ao buscar por ID:", error);
      res.status(500).json({ error: "Erro interno ao buscar veterinário" });
    }
  }

  static async criar(req, res) {
    try {
      const dados = req.body;
      if (!dados.NomeCompletoVeterinario || !dados.CPFVeterinario || !dados.CRMVVeterinario) {
        return res.status(400).json({ error: "Nome, CPF e CRMV são obrigatórios" });
      }

      const novoVeterinario = await VeterinarioModel.criar(dados);

      if (dados.email) {
        const [existe] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [dados.email]);
        if (existe.length === 0) {
          await pool.query(
            "INSERT INTO usuarios (nome, email, senha, nivel_acesso) VALUES (?, ?, ?, ?)",
            [dados.NomeCompletoVeterinario, dados.email, "123456", "responsavel_tecnico"]
          );
        }
      }

      res.status(201).json(novoVeterinario);
    } catch (error) {
      console.error("Erro ao criar:", error);
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('CRMVVeterinario')) {
          return res.status(409).json({ error: "Já existe um veterinário cadastrado com este CRMV." });
        }
        if (error.message.includes('CPFVeterinario')) {
          return res.status(409).json({ error: "Já existe um veterinário cadastrado com este CPF." });
        }
        return res.status(409).json({ error: "Dado duplicado. Verifique CPF ou CRMV informado." });
      }
      res.status(500).json({ error: "Erro ao criar veterinário" });
    }
  }

  static async atualizar(req, res) {
    try {
      const id = req.params.id;
      const dados = req.body;
      const veterinarioAtualizado = await VeterinarioModel.atualizar(id, dados);

      if (!veterinarioAtualizado) {
        return res.status(404).json({ error: "Veterinário não encontrado para atualização" });
      }

      res.status(200).json(veterinarioAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('CRMVVeterinario')) {
          return res.status(409).json({ error: "CRMV já está em uso por outro veterinário." });
        }
        if (error.message.includes('CPFVeterinario')) {
          return res.status(409).json({ error: "CPF já está em uso por outro veterinário." });
        }
        return res.status(409).json({ error: "Dado duplicado. Verifique CPF ou CRMV informado." });
      }
      res.status(500).json({ error: "Erro ao atualizar veterinário" });
    }
  }

  static async excluir(req, res) {
    try {
      const id = req.params.id;
      const sucesso = await VeterinarioModel.excluir(id);

      if (!sucesso) {
        return res.status(404).json({ error: "Veterinário não encontrado para exclusão" });
      }

      res.status(200).json({ message: "Veterinário excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir:", error);
      if (error.code && error.code.includes('ROW_IS_REFERENCED')) {
        return res.status(409).json({ error: "Não é possível excluir: Este veterinário possui procedimentos vinculados." });
      }
      res.status(500).json({ error: "Erro interno ao excluir veterinário" });
    }
  }
}

export default VeterinarioController;