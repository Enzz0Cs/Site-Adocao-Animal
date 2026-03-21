import EstoqueModel from "../models/EstoqueModel.js";

class EstoqueController {
    static async listar(req, res) {
        try {
            // Se houver uma query "?critico=true", lista apenas o que está acabando
            const { critico } = req.query;
            let itens;

            if (critico === 'true') {
                itens = await EstoqueModel.listarCriticos();
            } else {
                itens = await EstoqueModel.listarTudo();
            }

            res.json(itens);
        } catch (error) {
            console.error('ERRO NO BANCO (Estoque):', error.message);
            res.status(500).json({ error: 'Erro ao listar estoque: ' + error.message });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const item = await EstoqueModel.buscarPorId(id);
            if (!item) {
                return res.status(404).json({ error: 'Item não encontrado no estoque' });
            }
            res.json(item);
        } catch (error) {
            console.error('Erro ao buscar item:', error.message);
            res.status(500).json({ error: 'Erro ao buscar item' });
        }
    }

    static async criar(req, res) {
        try {
            const { nome_item, categoria, quantidade_atual, unidade_medida, quantidade_minima, data_validade } = req.body;

            // Validação básica de campos obrigatórios
            if (!nome_item || !categoria || quantidade_atual === undefined || !unidade_medida) {
                return res.status(400).json({
                    error: 'Campos essenciais (Nome, Categoria, Quantidade e Unidade) devem ser preenchidos.'
                });
            }

            // Tratamento de data (mesma lógica que você usou nos animais)
            let dataValidadeSQL = data_validade;
            if (data_validade && data_validade.includes('/')) {
                const [dia, mes, ano] = data_validade.split('/');
                dataValidadeSQL = `${ano}-${mes}-${dia}`;
            }

            const novoItem = await EstoqueModel.criar({
                nome_item,
                categoria,
                quantidade_atual,
                unidade_medida,
                quantidade_minima: quantidade_minima || 0,
                data_validade: dataValidadeSQL
            });

            res.status(201).json(novoItem);
        } catch (error) {
            console.error('Erro ao cadastrar item no estoque:', error.message);
            res.status(500).json({ error: 'Erro ao criar item: ' + error.message });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome_item, categoria, quantidade_atual, unidade_medida, quantidade_minima, data_validade } = req.body;

            let dataValidadeSQL = data_validade;
            if (data_validade && data_validade.includes('/')) {
                const [dia, mes, ano] = data_validade.split('/');
                dataValidadeSQL = `${ano}-${mes}-${dia}`;
            }

            const itemAtualizado = await EstoqueModel.atualizar(id, {
                nome_item,
                categoria,
                quantidade_atual,
                unidade_medida,
                quantidade_minima,
                data_validade: dataValidadeSQL
            });

            if (!itemAtualizado) {
                return res.status(404).json({ error: 'Item não encontrado para atualização.' });
            }

            res.json(itemAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar estoque:', error.message);
            res.status(500).json({ error: 'Erro ao atualizar item' });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await EstoqueModel.excluir(id);
            if (!sucesso) {
                return res.status(404).json({ error: 'Item não encontrado para exclusão' });
            }
            res.json({ message: 'Item removido do estoque com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir item:', error.message);
            res.status(500).json({ error: 'Erro ao excluir item' });
        }
    }
}

export default EstoqueController;