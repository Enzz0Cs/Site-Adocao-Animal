import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import PageHeader from "./PageHeader";

function RelatorioAnimais() {

    const [animais, setAnimais] = useState([]);
    const [status, setStatus] = useState("");

    const carregarRelatorio = async () => {

        try {

            let url = "http://localhost:3001/api/animais/relatorio";

            if (status) {
                url += `?status=${status}`;
            }

            const response = await axios.get(url);

            setAnimais(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        carregarRelatorio();
    }, []);
    const exportarPDF = () => {

        const doc = new jsPDF();

        doc.text("Relatório de Animais", 14, 15);

        autoTable(doc, {

            startY: 25,

            head: [[
                "ID",
                "Nome",
                "Raça",
                "Sexo",
                "Porte",
                "Status"
            ]],

            body: animais.map((animal) => [

                animal.id,
                animal.nome_animal,
                animal.raca,
                animal.sexo,
                animal.porte,
                animal.status_adocao
            ])
        });

        doc.save("relatorio-animais.pdf");
    };

    return (
        <div className="container-fluid p-0 min-vh-100 bg-light">
            <PageHeader title="Relatório de Animais" backTo="/relatorios">
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
                        <option value="">Todos Status</option>
                        <option value="Apto">Apto</option>
                        <option value="Inapto">Inapto</option>
                        <option value="Adotado">Adotado</option>
                        <option value="Em análise">Em análise</option>
                    </select>

                </div>

                <div className="col-md-2">

                    <button
                        className="btn btn-primary"
                        onClick={carregarRelatorio}
                    >
                        Buscar
                    </button>

                </div>

            </div>

            {/* TABELA */}
            <table className="table table-bordered table-hover">

                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Raça</th>
                        <th>Sexo</th>
                        <th>Porte</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    {animais.map((animal) => (

                        <tr key={animal.id}>
                            <td>{animal.id}</td>
                            <td>{animal.nome_animal}</td>
                            <td>{animal.raca}</td>
                            <td>{animal.sexo}</td>
                            <td>{animal.porte}</td>
                            <td>{animal.status_adocao}</td>
                        </tr>

                    ))}

                </tbody>

            </table>

            </div>
        </div>
    );
}

export default RelatorioAnimais;
