import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPaw, FaSyringe, FaUserFriends, FaBoxes, FaUserCircle, FaHeart, FaStethoscope } from 'react-icons/fa'; // Adicionado FaHeart
import './EstilosAbrigo.css';

const Home = () => {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        window.location.href = "/";
        return null;
    }

    const logout = () => {
        localStorage.removeItem("usuario");
        navigate("/");
    };

    return (
        <div className="container-fluid p-0 min-vh-100 bg-light">
            <header className="navbar custom-navbar shadow-sm p-4 mb-5" style={{ backgroundColor: '#FF69B4' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="custom-title m-0 text-white">🐾 Abrigo Teodoro Sampaio</h1>

                    <div className="d-flex align-items-center gap-3">
                        <div className="text-white d-flex align-items-center gap-2 border-end pe-3">
                            <FaUserCircle size={25} />
                            <div className="d-flex flex-column" style={{ lineHeight: '1.2' }}>
                                <span className="fw-bold">{usuario.nome}</span>
                                <small className="text-dark fw-bold" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
                                    {usuario.nivel}
                                </small>
                            </div>
                        </div>

                        <button className="btn btn-dark btn-sm" onClick={logout}>Sair</button>
                    </div>
                </div>
            </header>

            <main className="container pb-5">
                <div className="row justify-content-center g-4 text-center">
                    {(usuario.nivel === "admin" || usuario.nivel === "funcionario") && (
                        <div className="col-md-3">
                            <div className="card h-100 shadow p-4 border-0">
                                <FaPaw size={50} color="#FF69B4" className="mx-auto mb-3" />
                                <h3>Animais</h3>
                                <Link to="/animais" className="btn btn-primary mt-3">Acessar</Link>
                            </div>
                        </div>
                    )}

                    {(usuario.nivel === "admin" || usuario.nivel === "funcionario") && (
                        <div className="col-md-3">
                            <div className="card h-100 shadow p-4 border-0">
                                <FaHeart size={50} color="#FF69B4" className="mx-auto mb-3" />
                                <h3>Adoções</h3>
                                <Link to="/adocoes" className="btn btn-primary mt-3">Registrar</Link>
                            </div>
                        </div>
                    )}

                    {(usuario.nivel === "admin" || usuario.nivel === "responsavel_tecnico") && (
                        <div className="col-md-3">
                            <div className="card h-100 shadow p-4 border-0">
                                <FaSyringe size={50} color="#FF69B4" className="mx-auto mb-3" />
                                <h3>Vacinas</h3>
                                <Link to="/vacinas" className="btn btn-primary mt-3">Ver Estoque</Link>
                            </div>
                        </div>
                    )}

                    {(usuario.nivel === "admin" || usuario.nivel === "funcionario") && (
                        <div className="col-md-3">
                            <div className="card h-100 shadow p-4 border-0">
                                <FaUserFriends size={50} color="#FF69B4" className="mx-auto mb-3" />
                                <h3>Adotantes</h3>
                                <Link to="/adotantes" className="btn btn-primary mt-3">Gerenciar</Link>
                            </div>
                        </div>
                    )}

                    {(usuario.nivel === "admin" || usuario.nivel === "funcionario") && (
                        <div className="col-md-3">
                            <div className="card h-100 shadow p-4 border-0">
                                <FaBoxes size={50} color="#FF69B4" className="mx-auto mb-3" />
                                <h3>Estoque</h3>
                                <Link to="/estoque" className="btn btn-primary mt-3">Gerenciar</Link>
                            </div>
                        </div>
                    )}

                    {(usuario.nivel === "admin" || usuario.nivel === "responsavel_tecnico" || usuario.nivel === "funcionario") && (
                        <div className="col-md-3">
                            <div className="card h-100 shadow p-4 border-0">
                                <FaStethoscope size={50} color="#FF69B4" className="mx-auto mb-3" />
                                <h3>Procedimentos</h3>
                                <Link to="/procedimentos-veterinarios" className="btn btn-primary mt-3">Acessar</Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;