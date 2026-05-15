import axios from 'axios';

// ALTERAÇÃO: Mudamos de 3000 para 3001 para conectar no seu Backend unificado
const API_URL = 'http://localhost:3001/api/adotantes';

class AdotanteService {

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
        if (dados.AdotanteID) {
            // Edição: Usa o ID existente
            return axios.put(`${API_URL}/${dados.AdotanteID}`, dados);
        } else {
            // Cadastro: Remove o AdotanteID nulo para evitar erro de coluna no MySQL
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

// Exportamos uma única instância para ser usada em todo o projeto
export default new AdotanteService();
