import FinanceiroModel from "../models/FinanceiroModel.js";

class FinanceiroController {

    static async listar(req, res) {
        try {
            const { busca } = req.query;
            const movimentos = busca
                ? await FinanceiroModel.filtrar(busca)
                : await FinanceiroModel.listarTodos();
            res.json(movimentos);
        } catch (error) {
            console.error("Erro ao listar financeiro:", error);
            res.status(500).json({ error: "Erro ao buscar movimentações" });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const movimento = await FinanceiroModel.buscarPorId(id);
            if (!movimento) {
                return res.status(404).json({ error: "Movimentação não encontrada" });
            }
            res.json(movimento);
        } catch (error) {
            console.error("Erro ao buscar por ID:", error);
            res.status(500).json({ error: "Erro interno" });
        }
    }

    static async criar(req, res) {
        try {
            const dados = req.body;
            if (!dados.tipo || !dados.valor || !dados.categoria || !dados.data_movimento) {
                return res.status(400).json({ error: "Tipo, valor, categoria e data são obrigatórios" });
            }
            const novo = await FinanceiroModel.criar(dados);
            res.status(201).json(novo);
        } catch (error) {
            console.error("Erro ao criar:", error);
            res.status(500).json({ error: "Erro ao registrar movimentação" });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dados = req.body;
            const atualizado = await FinanceiroModel.atualizar(id, dados);
            if (!atualizado) {
                return res.status(404).json({ error: "Movimentação não encontrada" });
            }
            res.json(atualizado);
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            res.status(500).json({ error: "Erro ao atualizar movimentação" });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await FinanceiroModel.excluir(id);
            if (!sucesso) {
                return res.status(404).json({ error: "Movimentação não encontrada" });
            }
            res.json({ message: "Movimentação excluída com sucesso" });
        } catch (error) {
            console.error("Erro ao excluir:", error);
            res.status(500).json({ error: "Erro ao excluir movimentação" });
        }
    }
}

export default FinanceiroController;