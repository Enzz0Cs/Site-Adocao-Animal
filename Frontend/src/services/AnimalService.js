import ApiService from './ApiService.js';

const ANIMAL_ENDPOINT = '/animais';

const AnimalService = {

    listar: async (termo = '') => {
        try {
            const url = termo ? `${ANIMAL_ENDPOINT}?termo=${termo}` : ANIMAL_ENDPOINT;
            const response = await ApiService.get(url);
            return response.data || response;
        } catch (error) {
            throw error;
        }
    },

    salvar: async (dados) => {
        try {
            const id = dados.id || dados.animal_id;

            if (id) {
                const response = await ApiService.put(`${ANIMAL_ENDPOINT}/${id}`, dados);
                return response.data || response;
            } else {
                const { id: _, animal_id: __, ...dadosLimpos } = dados;
                const response = await ApiService.post(ANIMAL_ENDPOINT, dadosLimpos);
                return response.data || response;
            }

        } catch (error) {
            throw error;
        }
    },

    buscarPorId: async (id) => {
        const response = await ApiService.get(`${ANIMAL_ENDPOINT}/${id}`);
        return response.data || response;
    },

    excluir: async (id) => {
        const response = await ApiService.delete(`${ANIMAL_ENDPOINT}/${id}`);
        return response.data || response;
    },

    // 🔥 RF-F3 Validar Aptidão para Adoção
    validar: async (dados) => {
        try {

            const response = await ApiService.post(
                "/validar-adocao",
                dados
            );

            return response.data || response;

        } catch (error) {
            throw error;
        }
    }

};

export default AnimalService;