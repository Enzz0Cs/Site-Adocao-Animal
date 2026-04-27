import axios from 'axios';

const API_URL = 'http://localhost:3001/api/adocoes';

export default {
    listar: async () => {
        try {
            const res = await axios.get(API_URL);
            return Array.isArray(res.data) ? res.data : [];
        } catch (error) {
            console.error("Erro ao listar adoções:", error);
            throw error;
        }
    },

    registrar: async (dados) => {
        try {
            const res = await axios.post(API_URL, dados);
            return res.data;
        } catch (error) {
            console.error("Erro ao registrar adoção:", error);
            throw error;
        }
    },
    excluir: async (id) => {
        try {
            const res = await axios.delete(`${API_URL}/${id}`);
            return res.data;
        } catch (error) {
            console.error("Erro ao excluir adoção no Service:", error);
            throw error;
        }
    }
};