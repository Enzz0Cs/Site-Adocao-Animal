import { Link } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

function Relatorios() {
    return (
        <div className="container-fluid p-0 min-vh-100 bg-light">
            <header className="navbar custom-navbar p-3 mb-4" style={{ backgroundColor: '#FF69B4' }}>
                <div className="container-fluid">
                    <Link to="/home" className="btn btn-dark">
                        <ArrowLeft size={20} />
                    </Link>
                    <span className="text-white fw-bold">Central de Relatórios</span>
                    <div style={{ width: 40 }}></div>
                </div>
            </header>

            <div className="container">
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card shadow h-100">
                            <div className="card-body d-flex flex-column">
                                <h4>🐶 Relatório de Animais</h4>
                                <p className="mt-3">Lista todos os animais cadastrados no sistema.</p>
                                <Link to="/relatorio-animais" className="btn btn-primary mt-auto">Acessar</Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow h-100">
                            <div className="card-body d-flex flex-column">
                                <h4>🩺 Relatório de Saúde</h4>
                                <p className="mt-3">Histórico de vacinas aplicadas nos animais.</p>
                                <Link to="/relatorio-saude" className="btn btn-success mt-auto">Acessar</Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow h-100">
                            <div className="card-body d-flex flex-column">
                                <h4>🐾 Relatório de Adoções</h4>
                                <p className="mt-3">Lista adoções realizadas no sistema.</p>
                                <Link to="/relatorio-adocoes" className="btn btn-dark mt-auto">Acessar</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Relatorios;