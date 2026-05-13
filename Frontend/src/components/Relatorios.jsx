import { Link } from "react-router-dom";


function Relatorios() {

    return (

        <div className="container mt-5">
            <Link
                to="/home"
                className="btn btn-dark mb-4"
            >
                ← Voltar
            </Link>

            <h1 className="mb-5">
                📊 Central de Relatórios
            </h1>

            <div className="row g-4">

                {/* RELATÓRIO ANIMAIS */}
                <div className="col-md-4">

                    <div className="card shadow h-100">

                        <div className="card-body d-flex flex-column">

                            <h4>🐶 Relatório de Animais</h4>

                            <p className="mt-3">
                                Lista todos os animais cadastrados no sistema.
                            </p>

                            <Link
                                to="/relatorio-animais"
                                className="btn btn-primary mt-auto"
                            >
                                Acessar
                            </Link>

                        </div>

                    </div>

                </div>

                {/* RELATÓRIO SAÚDE */}
                <div className="col-md-4">

                    <div className="card shadow h-100">

                        <div className="card-body d-flex flex-column">

                            <h4>🩺 Relatório de Saúde</h4>

                            <p className="mt-3">
                                Histórico de vacinas aplicadas nos animais.
                            </p>

                            <Link
                                to="/relatorio-saude"
                                className="btn btn-success mt-auto"
                            >
                                Acessar
                            </Link>

                        </div>

                    </div>

                </div>

                {/* RELATÓRIO ADOÇÕES */}
                <div className="col-md-4">

                    <div className="card shadow h-100">

                        <div className="card-body d-flex flex-column">

                            <h4>🐾 Relatório de Adoções</h4>

                            <p className="mt-3">
                                Lista adoções realizadas no sistema.
                            </p>

                            <Link
                                to="/relatorio-adocoes"
                                className="btn btn-dark mt-auto"
                            >
                                Acessar
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Relatorios;