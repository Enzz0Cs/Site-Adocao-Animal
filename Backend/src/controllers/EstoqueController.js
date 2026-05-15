import EstoqueModel from "../models/EstoqueModel.js";
import pool from "../config/database.js";

class EstoqueController {

    static async listar(req, res) {
        try {
            const { critico } = req.query;
            const itens = (critico === 'true')
                ? await EstoqueModel.listarCriticos()
                : await EstoqueModel.listarTudo();
            res.json(itens);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async listarHistorico(req, res) {
        try {
            const sql = `
                SELECT s.id, s.quantidade_saída, s.destino, s.data_saida, 
                       e.nome_item, u.nome as responsavel 
                FROM saídas_estoque s
                JOIN estoque e ON s.estoque_id = e.id
                JOIN usuarios u ON s.responsável_id = u.id
                ORDER BY s.data_saida DESC LIMIT 15
            `;
            const [rows] = await pool.query(sql);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar histórico' });
        }
    }


    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const idLimpo = id.toString().replace(/\D/g, '');

            const item = await EstoqueModel.buscarPorId(idLimpo);
            if (!item) return res.status(404).json({ error: 'Não encontrado' });
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    static async salvar(req, res) {
        try {
            const id = req.params.id || req.body.id;
            const { nome_item, categoria, quantidade_atual, unidade_medida, quantidade_minima, data_validade, peso_volume } = req.body;


            let dataFormatada = data_validade;
            if (data_validade && data_validade.includes('T')) {
                dataFormatada = data_validade.split('T')[0];
            }

            const dados = {
                nome_item,
                categoria,
                quantidade_atual: Number(quantidade_atual),
                unidade_medida,
                quantidade_minima: Number(quantidade_minima || 0),
                data_validade: dataFormatada,
                peso_volume: peso_volume ? Number(peso_volume) : null
            };

            if (id) {
                const idLimpo = id.toString().replace(/\D/g, '');
                await EstoqueModel.atualizar(idLimpo, dados);
                res.json({ message: 'Atualizado com sucesso!' });
            } else {
                await EstoqueModel.criar(dados);
                res.status(201).json({ message: 'Cadastrado com sucesso!' });
            }
        } catch (error) {
            console.error('Erro ao salvar item:', error.message);
            res.status(500).json({ error: 'Erro ao salvar item no banco' });
        }
    }


    static async registrarSaida(req, res) {
        try {
            const { estoque_id, quantidade, destino, responsavel_id } = req.body;


            const item = await EstoqueModel.buscarPorId(estoque_id);
            if (!item || Number(item.quantidade_atual) < Number(quantidade)) {
                return res.status(400).json({
                    error: `Saldo insuficiente. Disponível: ${item ? item.quantidade_atual : 0}`
                });
            }

            await EstoqueModel.registrarMovimentacaoSaida(estoque_id, quantidade, destino, responsavel_id);
            res.json({ message: 'Saída registrada!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const idLimpo = id.toString().replace(/\D/g, '');

            if (!idLimpo) return res.status(400).json({ error: 'ID inválido' });

            const sucesso = await EstoqueModel.excluir(idLimpo);
            if (sucesso) {
                res.json({ message: 'Item removido!' });
            } else {
                res.status(404).json({ error: 'Item não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir item' });
        }
    }
}

export default EstoqueController;