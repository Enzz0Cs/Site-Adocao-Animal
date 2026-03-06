import AnimalModel from "../models/AnimalModel.js";

class AnimalController {
    static async listar(req, res) {
        try {
            const { termo } = req.query;
            let animais;
            if (termo) {
                animais = await AnimalModel.filtrar(termo);
            } else {
                animais = await AnimalModel.listarTodos();
            }
            res.json(animais);
        } catch (error) {
            console.error('Erro ao listar animais:', error);
            res.status(500).json({ error: 'Erro ao listar animais' });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const animal = await AnimalModel.buscarPorId(id);
            if (!animal) {
                return res.status(404).json({ error: 'Animal não encontrado' });
            }
            res.json(animal);
        } catch (error) {
            console.error('Erro ao buscar animal:', error);
            res.status(500).json({ error: 'Erro ao buscar animal' });
        }
    }

    static async criar(req, res) {
        try {
            const { nome_animal, data_cadastro, sexo, raca, porte, idade } = req.body;

            // Validação dos campos obrigatórios
            if (!nome_animal || !data_cadastro || !sexo || !raca || !porte || !idade) {
                return res.status(400).json({
                    error: 'Todos os campos (Nome, Data de Cadastro, Sexo, Raça, Porte e Idade) devem ser preenchidos.'
                });
            }

            let dataCadastroSQL = data_cadastro;
            if (data_cadastro.includes('/')) {
                const [dia, mes, ano] = data_cadastro.split('/');
                dataCadastroSQL = `${ano}-${mes}-${dia}`;
            }

            const dadosAnimal = {
                nome_animal,
                data_cadastro: dataCadastroSQL,
                sexo,
                raca,
                porte,
                idade
            };

            const animal = await AnimalModel.criar(dadosAnimal);
            res.status(201).json(animal);

        } catch (error) {
            console.error('Erro ao criar cadastro do animal:', error);
            res.status(500).json({ error: 'Erro ao criar cadastro do animal' });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome_animal, data_cadastro, sexo, raca, porte, idade } = req.body;

            if (!nome_animal || !data_cadastro || !sexo || !raca || !porte || !idade) {
                return res.status(400).json({
                    error: 'Todos os campos (Nome, Data de Cadastro, Sexo, Raça, Porte e Idade) devem ser preenchidos.'
                });
            }

            let dataCadastroSQL = data_cadastro;
            if (data_cadastro.includes('/')) {
                const [dia, mes, ano] = data_cadastro.split('/');
                dataCadastroSQL = `${ano}-${mes}-${dia}`;
            }

            const dadosAnimal = {
                nome_animal,
                data_cadastro: dataCadastroSQL,
                sexo,
                raca,
                porte,
                idade
            };

            const animalAtualizado = await AnimalModel.atualizar(id, dadosAnimal);
            if (!animalAtualizado) {
                return res.status(404).json({ error: 'Animal não encontrado para atualização.' });
            }

            res.json(animalAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar animal:', error);
            res.status(500).json({ error: 'Erro ao atualizar animal' });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await AnimalModel.excluir(id);
            if (!sucesso) {
                return res.status(404).json({ error: 'Animal não encontrado para exclusão' });
            }
            res.json({ message: 'Animal excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir animal:', error);
            res.status(500).json({ error: 'Erro ao excluir animal' });
        }
    }
}

export default AnimalController;