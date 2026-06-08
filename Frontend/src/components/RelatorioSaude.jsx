import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PageHeader from "./PageHeader";

function RelatorioSaude() {

    const [dados, setDados] = useState([]);
    const [nome, setNome] = useState("");

    const carregarRelatorio = async () => {

        try {

            let url =
                "http://localhost:3001/api/animais/relatorio-saude";

            if (nome) {
                url += `?nome=${encodeURIComponent(nome)}`;
            }

            const response = await axios.get(url);

            setDados(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {
        carregarRelatorio();
    }, []);

    const exportarPDF = () => {

        const doc = new jsPDF();

        doc.text("Relatório de Saúde", 14, 15);

        autoTable(doc, {

            startY: 25,

            head: [[
                "ID",
                "Animal",
                "Vacina",
                "Data Aplicação",
                "Observações"
            ]],

            body: dados.map((item) => [

                item.id,
                item.nome_animal,
                item.vacina_id,

                new Date(item.data_aplicacao)
                    .toLocaleDateString("pt-BR"),

                item.observacoes || "-"
            ])
        });

        doc.save("relatorio-saude.pdf");
    };

    return (

        <div className="container-fluid p-0 min-vh-100 bg-light">
            <PageHeader title="Relatório de Saúde" backTo="/relatorios">
                <button
                    className="btn btn-danger"
                    onClick={exportarPDF}
                >
                    Exportar PDF
                </button>
            </PageHeader>

            <div className="container pb-5">

            {/* FILTRO */}
            <div className="row mb-4">

                <div className="col-md-4">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar animal..."
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                </div>

                <div className="col-md-2">

                    <button
                        className="btn btn-primary"
                        onClick={carregarRelatorio}
                    >
                        Filtrar
                    </button>

                </div>

            </div>

            <table className="table table-bordered table-hover">

                <thead className="table-dark">

                    <tr>
                        <th>ID</th>
                        <th>Animal</th>
                        <th>Vacina</th>
                        <th>Data Aplicação</th>
                        <th>Observações</th>
                    </tr>

                </thead>

                <tbody>

                    {dados.length > 0 ? (

                        dados.map((item) => (

                            <tr key={item.id}>

                                <td>{item.id}</td>

                                <td>{item.nome_animal}</td>

                                <td>{item.vacina_id}</td>

                                <td>
                                    {new Date(item.data_aplicacao)
                                        .toLocaleDateString("pt-BR")}
                                </td>

                                <td>
                                    {item.observacoes || "-"}
                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan="5"
                                className="text-center"
                            >
                                Nenhum resultado encontrado
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

            </div>
        </div>
    );
}

export default RelatorioSaude;
