import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPaw, FaSyringe, FaUserFriends } from 'react-icons/fa';
import './EstilosAbrigo.css';

const Home = () => {

    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const nivel = usuario?.nivel;

    const logout = () => {
        localStorage.removeItem("usuario");
        navigate("/");
    };

    return (
        <div className="container-fluid p-0 min-vh-100 bg-light">

            <header className="navbar custom-navbar shadow-sm p-4 mb-5">
                <div className="container d-flex justify-content-between align-items-center">

                    <h1 className="custom-title m-0">🐾 Abrigo Teodoro Sampaio</h1>

                    <div className="d-flex align-items-center gap-3 text-white">
                        {usuario && (
                            <span>
                                👤 {usuario.nome}
                            </span>
                        )}

                        <button 
                            className="btn btn-dark"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>

                </div>
            </header>

            <main className="container pb-5">
                <div className="row justify-content-center g-4 text-center">

                    {/* ANIMAIS */}
                    {(nivel === "admin" || nivel === "funcionario") && (
                        <div className="col-md-4">
                            <div className="card custom-card h-100 shadow p-4">
                                <FaPaw size={50} color="#FF69B4" className="mx-auto mb-3" />
                                <h3 className="custom-card-title border-0">Animais</h3>
                                <p>Gerencie o cadastro e porte dos pets.</p>
                                <Link to="/animais" className="btn custom-btn w-100 mt-3">
                                    Acessar
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* VACINAS */}
                    {(nivel === "admin" || nivel === "responsavel_tecnico") && (
                        <div className="col-md-4">
                            <div className="card custom-card h-100 shadow p-4">
                                <FaSyringe size={50} color="#FF69B4" className="mx-auto mb-3" />
                                <h3 className="custom-card-title border-0">Vacinas</h3>
                                <p>Controle o estoque de vacinação.</p>
                                <Link to="/vacinas" className="btn custom-btn w-100 mt-3">
                                    Ver Estoque
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ADOTANTES */}
                    {(nivel === "admin" || nivel === "funcionario") && (
                        <div className="col-md-4">
                            <div className="card custom-card h-100 shadow p-4">
                                <FaUserFriends size={50} color="#FF69B4" className="mx-auto mb-3" />
                                <h3 className="custom-card-title border-0">Adotantes</h3>
                                <p>Registro de interessados em adoção.</p>
                                <Link to="/adotantes" className="btn custom-btn w-100 mt-3">
                                    Gerenciar
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </main>

        </div>
    );
};

export default Home;