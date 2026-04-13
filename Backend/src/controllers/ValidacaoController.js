import AnimalModel from "../models/AnimalModel.js";

class ValidacaoController {

    static async validar(req, res) {

        try {

            const { animal_id, status, justificativa } = req.body;

            if (!animal_id || !status) {
                return res.status(400).json({
                    error: "Animal e status são obrigatórios"
                });
            }

            // Verifica vacinas do animal
            const vacinas = await AnimalModel.verificarVacinas(animal_id);

            if (status === "Apto" && vacinas.length === 0) {
                return res.status(400).json({
                    error: "Animal não possui vacinas registradas"
                });
            }

            const resultado = await AnimalModel.validarAptidao(
                animal_id,
                status,
                justificativa
            );

            res.status(200).json({
                message: "Validação realizada com sucesso",
                resultado
            });

        } catch (error) {

            console.error("Erro ao validar adoção:", error);

            res.status(500).json({
                error: "Erro ao validar adoção"
            });

        }

    }

}

export default ValidacaoController;