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
    try {
      const resultado = await AdocaoModel.confirmarPorToken(req.params.token);
      if (resultado.affectedRows > 0) {
        res.json({ message: "Adoção confirmada com sucesso!" });
      } else {
        res.status(404).json({ error: "Link inválido ou já utilizado" });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro ao confirmar adoção" });
    }
  }

  static async finalizar(req, res) {
    await AdocaoModel.finalizar(req.params.id);
    res.json({ message: "Adoção finalizada!" });
  }

  static async excluir(req, res) {
    await AdocaoModel.excluir(req.params.id);
    res.json({ message: "Excluído" });
  }
  static async relatorio(req, res) {

    try {

        const { status } = req.query;

const dados = await AdocaoModel.relatorioAdocoes(status);

        res.json(dados);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Erro ao gerar relatório de adoções"
        });
    }
}
}

export default AdocaoController;