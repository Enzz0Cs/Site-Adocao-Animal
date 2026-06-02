import ApiService from './ApiService.js';

const ENDPOINT = '/financeiro';

class FinanceiroService {
    static async listar(busca = '') {
        const url = busca ? `${ENDPOINT}?busca=${busca}` : ENDPOINT;
        const response = await ApiService.get(url);
        return response.data;
    }

    static async salvar(dados) {
        if (dados.id) {
            const response = await ApiService.put(`${ENDPOINT}/${dados.id}`, dados);
            return response.data;
        }
        const { id, ...dadosLimpos } = dados;
        const response = await ApiService.post(ENDPOINT, dadosLimpos);
        return response.data;
    }

    static async excluir(id) {
        const response = await ApiService.delete(`${ENDPOINT}/${id}`);
        return response.data;
    }
}

export default FinanceiroService;