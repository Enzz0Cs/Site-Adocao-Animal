import axios from 'axios';
const API_URL = 'http://localhost:3000/api/adotantes';

class AdotanteService {

    /**
     * @param {string} termo
     * @returns {Promise<Array>}
     */
    listar(termo = '') {
        const url = termo ? `${API_URL}?termo=${termo}` : API_URL;
        return axios.get(url).then(response => response.data);
    }

    /**
     * @param {object} dados
     * @returns {Promise}
     */
    salvar(dados) {
        if (dados.AdotanteID) {
            return axios.put(`${API_URL}/${dados.AdotanteID}`, dados);
        } else {
            const { AdotanteID, ...dadosLimpos } = dados;
            return axios.post(API_URL, dadosLimpos);
        }
    }

    /**
     * @param {string} id
     * @returns {Promise}
     */
    excluir(id) {
        return axios.delete(`${API_URL}/${id}`).then(response => response.data);
    }
}

export default new AdotanteService();