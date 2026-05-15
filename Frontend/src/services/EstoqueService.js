import ApiService from './ApiService.js';

const ENDPOINT = '/estoque';

const EstoqueService = {
    listar: async () => {
        const response = await ApiService.get(ENDPOINT);
        return response.data || response;
    },

    listarHistorico: async () => {
        const response = await ApiService.get(`${ENDPOINT}/historico`);
        return response.data || response;
    },

    salvar: async (dados) => {
        // Formata a data e garante que valores numéricos sejam tratados corretamente
        const dadosFormatados = {
            ...dados,
            quantidade_atual: Number(dados.quantidade_atual),
            quantidade_minima: Number(dados.quantidade_minima || 0),
            peso_volume: dados.peso_volume ? Number(dados.peso_volume) : null,
            data_validade: dados.data_validade && typeof dados.data_validade === 'string' && dados.data_validade.includes('T')
                ? dados.data_validade.split('T')[0]
                : dados.data_validade
        };

        if (dadosFormatados.id) {
            const response = await ApiService.put(`${ENDPOINT}/${dadosFormatados.id}`, dadosFormatados);
            return response.data || response;
        } else {
            const response = await ApiService.post(ENDPOINT, dadosFormatados);
            return response.data || response;
        }
    },

    excluir: async (id) => {
        const response = await ApiService.delete(`${ENDPOINT}/${id}`);
        return response.data || response;
    },

    registrarSaida: async (dadosSaida) => {
        const response = await ApiService.post(`${ENDPOINT}/saida`, dadosSaida);
        return response.data || response;
    }
};

export default EstoqueService;