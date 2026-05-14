import axios from 'axios';

const API_URL = 'http://localhost:3001/api/veterinarios';

class VeterinarioService {

    /**
     * @param {string} termo
     * @returns {Promise<Array>}
     */
    listar(termo = '') {
        const url = termo ? `${API_URL}?busca=${termo}` : API_URL;
        return axios.get(url).then(response => response.data);
    }

    /**
     * @param {object} dados
     * @returns {Promise}
     */
    salvar(dados) {
        if (dados.VeterinarioID) {
            return axios.put(`${API_URL}/${dados.VeterinarioID}`, dados);
        } else {
            const { VeterinarioID, ...dadosLimpos } = dados;
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

export default new VeterinarioService();