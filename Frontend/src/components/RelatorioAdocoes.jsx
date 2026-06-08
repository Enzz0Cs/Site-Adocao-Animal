import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import PageHeader from "./PageHeader";

function RelatorioAdocoes() {

    const [dados, setDados] = useState([]);
    const [status, setStatus] = useState("");

    const carregarRelatorio = async () => {

        try {

            let url =
                "http://localhost:3001/api/adocoes/relatorio";

            if (status) {
                url += `?status=${encodeURIComponent(status)}`;
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

    // 🔥 EXPORTAR PDF
    const exportarPDF = () => {

        const doc = new jsPDF();

        doc.text("Relatório de Adoções", 14, 15);

        autoTable(doc, {

            startY: 25,

            head: [[
                "ID",
                "Animal",
                "Adotante",
                "Data",
                "Status"
            ]],

            body: dados.map((item) => [
                item.id,
                item.nome_animal,
                item.adotante,
                new Date(item.data_adocao)
                    .toLocaleDateString("pt-BR"),
                item.status
            ])
        });

        doc.save("relatorio-adocoes.pdf");
    };

    return (

        <div className="container-fluid p-0 min-vh-100 bg-light">
            <PageHeader title="Relatório de Adoções" backTo="/relatorios">
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

                    <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">
                            Todos Status
                        </option>

                        <option value="Finalizada">
                            Finalizada
                        </option>

                        <option value="Confirmado">
                            Confirmado
                        </option>

                        <option value="Aguardando assinatura">
                            Aguardando assinatura
                        </option>

                    </select>

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
            <h5>{dados.length} resultados</h5>

            <table className="table table-bordered table-hover">

                <thead className="table-dark">

                    <tr>
                        <th>ID</th>
                        <th>Animal</th>
                        <th>Adotante</th>
                        <th>Data Adoção</th>
                        <th>Status</th>
                    </tr>

                </thead>

                <tbody>

                    {dados.length > 0 ? (

                        dados.map((item) => (

                            <tr key={item.id}>

                                <td>{item.id}</td>

                                <td>{item.nome_animal}</td>

                                <td>{item.adotante}</td>

                                <td>
                                    {new Date(item.data_adocao)
                                        .toLocaleDateString("pt-BR")}
                                </td>

                                <td>{item.status}</td>

                            </tr>

                        ))

                    ) : (

                        <tr>

                            <td colSpan="5" className="text-center">
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

export default RelatorioAdocoes;
