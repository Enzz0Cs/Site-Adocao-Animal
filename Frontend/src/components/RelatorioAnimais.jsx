import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

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
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link
                    to="/relatorios"
                    className="btn btn-dark mb-4"
                >
                    ← Voltar
                </Link>

                <h2>
                    📋 Relatório de Animais
                </h2>

                <button
                    className="btn btn-danger"
                    onClick={exportarPDF}
                >
                    Exportar PDF
                </button>

            </div>

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
    );
}

export default RelatorioAnimais;