import AdocaoModel from "../models/AdocaoModel.js";
import AnimalModel from "../models/AnimalModel.js";

class AdocaoController {
  static async criar(req, res) {
    try {
      const { animal_id, adotante_id, data_adocao } = req.body;

      if (!animal_id || !adotante_id || !data_adocao) {
        return res.status(400).json({ error: "Animal, Adotante e Data são obrigatórios." });
      }

      const animal = await AnimalModel.buscarPorId(animal_id);

      if (!animal) {
        return res.status(404).json({ error: "Animal não encontrado." });
      }

      const statusPermitidos = ['Disponível', 'Apto'];

      if (!statusPermitidos.includes(animal.status_adocao)) {
        return res.status(400).json({
          error: `Este animal não pode ser adotado pois seu status atual é: ${animal.status_adocao}`
        });
      }

      const novaAdocao = await AdocaoModel.criar({ animal_id, adotante_id, data_adocao });

      res.status(201).json({
        message: "Adoção registrada com sucesso!",
        dados: novaAdocao
      });

    } catch (error) {
      console.error("Erro ao registrar adoção:", error);
      res.status(500).json({ error: "Erro interno ao processar adoção." });
    }
  }

  static async listar(req, res) {
    try {
      const adocoes = await AdocaoModel.listarTodos();
      res.status(200).json(adocoes);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar adoções." });
    }
  }

  static async excluir(req, res) {
    try {
      const { id } = req.params;
      const sucesso = await AdocaoModel.excluir(id);

      if (sucesso) {
        return res.status(200).json({ message: "Adoção excluída com sucesso!" });
      }
      res.status(404).json({ message: "Adoção não encontrada." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao excluir no banco de dados." });
    }
  }
}

export default AdocaoController;