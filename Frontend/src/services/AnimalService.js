import axios from 'axios';

const API_URL = 'http://localhost:3001/api/animais';

class AnimalService {

    listar(termo = '') {
        const url = termo ? `${API_URL}?termo=${termo}` : API_URL;
        return axios.get(url).then(response => response.data);
    }

    salvar(dados) {
        if (dados.animal_id) {
            return axios.put(`${API_URL}/${dados.animal_id}`, dados);
        } else {
            const { animal_id, ...dadosLimpos } = dados;
            return axios.post(API_URL, dadosLimpos);
        }
    }
    
    buscarPorId(id) {
        return axios.get(`${API_URL}/${id}`).then(response => response.data);
    }

    excluir(id) {
        return axios.delete(`${API_URL}/${id}`).then(response => response.data);
    }
}

export default new AnimalService();