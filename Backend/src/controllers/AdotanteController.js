import AdotanteModel from "../models/AdotanteModel.js";

class AdotanteController {

  static async listar(req, res) {
    try {
      const termoBusca = req.query.busca;

      let adotantes;

      if (termoBusca) {
        adotantes = await AdotanteModel.filtrar(termoBusca);
      } else {
        adotantes = await AdotanteModel.listarTodos();
      }

      res.status(200).json(adotantes);
    } catch (error) {
      console.error("Erro ao listar:", error);
      res.status(500).json({ error: "Erro ao buscar adotantes" });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const id = req.params.id;
      const adotante = await AdotanteModel.buscarPorId(id);
      if (!adotante) {
        return res.status(404).json({ error: "Adotante não encontrado" });
      }
      res.status(200).json(adotante);
    } catch (error) {
      console.error("Erro ao buscar por ID:", error);
      res.status(500).json({ error: "Erro interno ao buscar adotante" });
    }
  }

  static async criar(req, res) {
    try {
      const dados = req.body;
      if (!dados.NomeCompletoAdotante || !dados.CPFAdotante) {
        return res.status(400).json({ error: "Nome e CPF são obrigatórios" });
      }

      const novoAdotante = await AdotanteModel.criar(dados);
      res.status(201).json(novoAdotante);
    } catch (error) {
      console.error("Erro ao criar:", error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: "Já existe um adotante cadastrado com este CPF." });
      }
      res.status(500).json({ error: "Erro ao criar adotante" });
    }
  }

  static async atualizar(req, res) {
    try {
      const id = req.params.id;
      const dados = req.body;
      const adotanteAtualizado = await AdotanteModel.atualizar(id, dados);

      if (!adotanteAtualizado) {
        return res.status(404).json({ error: "Adotante não encontrado para atualização" });
      }

      res.status(200).json(adotanteAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: "CPF já está em uso por outro adotante." });
      }
      res.status(500).json({ error: "Erro ao atualizar adotante" });
    }
  }

  static async excluir(req, res) {
    try {
      const id = req.params.id;
      const sucesso = await AdotanteModel.excluir(id);

      if (!sucesso) {
        return res.status(404).json({ error: "Adotante não encontrado para exclusão" });
      }

      res.status(200).json({ message: "Adotante excluído com sucesso" });
    } catch (error) {
      console.error("Erro ao excluir:", error);
      if (error.code && error.code.includes('ROW_IS_REFERENCED')) {
        return res.status(409).json({ error: "Não é possível excluir: Este adotante possui registros vinculados." });
      }
      res.status(500).json({ error: "Erro interno ao excluir adotante" });
    }
  }
}

export default AdotanteController;