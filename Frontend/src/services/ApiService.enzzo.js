import ApiService from './ApiService.js';
const ADOTANTE_ENDPOINT = '/adotantes';

class AdotanteService {

  /**
   * @param {string} termo
   * @returns {Promise<Array>}
   */
  static async listar(termo = '') {
    try {
      const endpoint = termo ? `${ADOTANTE_ENDPOINT}?termo=${termo}` : ADOTANTE_ENDPOINT;
      return await ApiService.get(endpoint);
    } catch (error) {
      throw new Error(`Falha ao listar adotantes: ${error.message}`);
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<Object>}
   */
  static async buscarPorId(id) {
    try {
      return await ApiService.get(`${ADOTANTE_ENDPOINT}/${id}`);
    } catch (error) {
      throw new Error(`Falha ao buscar adotante ${id}: ${error.message}`);
    }
  }

  /**
   * @param {Object} dadosAdotante
   * @returns {Promise<Object>}
   */
  static async criar(dadosAdotante) {
    try {
      const { AdotanteID, ...dadosLimpos } = dadosAdotante;
      return await ApiService.post(ADOTANTE_ENDPOINT, dadosLimpos);
    } catch (error) {
      throw new Error(`Falha ao criar adotante: ${error.message}`);
    }
  }

  /**
   * @param {number} id
   * @param {Object} dadosAdotante
   * @returns {Promise<Object>}
   */
  static async atualizar(id, dadosAdotante) {
    try {
      return await ApiService.put(`${ADOTANTE_ENDPOINT}/${id}`, dadosAdotante);
    } catch (error) {
      throw new Error(`Falha ao atualizar adotante ${id}: ${error.message}`);
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<Object>}
   */
  static async excluir(id) {
    try {
      return await ApiService.delete(`${ADOTANTE_ENDPOINT}/${id}`);
    } catch (error) {
      throw new Error(`Falha ao excluir adotante ${id}: ${error.message}`);
    }
  }
}

export default AdotanteService;