import AdocaoModel from "../models/AdocaoModel.js";

class AdocaoController {

  static async criar(req, res) {
    try {
      await AdocaoModel.criar(req.body);
      res.json({ message: "Adoção criada! Email enviado." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async listar(req, res) {
    const dados = await AdocaoModel.listarTodos();
    res.json(dados);
  }

  static async confirmar(req, res) {
    await AdocaoModel.confirmarPorToken(req.params.token);
    res.send("Adoção confirmada com sucesso!");
  }

  static async finalizar(req, res) {
    await AdocaoModel.finalizar(req.params.id);
    res.json({ message: "Adoção finalizada!" });
  }

  static async excluir(req, res) {
    await AdocaoModel.excluir(req.params.id);
    res.json({ message: "Excluído" });
  }
}

export default AdocaoController;