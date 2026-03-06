import React, { useState, useMemo, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EstilosAbrigo.css';
import AnimalService from '../services/AnimalService';

const GerenciadorAbrigoAnimais = () => {
    const [animais, setAnimais] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const initialFormState = {
        nome: '',
        dataCadastro: new Date().toISOString().split('T')[0],
        sexo: 'Macho',
        raca: '',
        porte: 'Médio',
        idade: 'Adulto',
    };

    const [dadosFormulario, setDadosFormulario] = useState(initialFormState);
    const [termoBusca, setTermoBusca] = useState('');

    const carregarAnimais = async (termo = '') => {
        setIsLoading(true);
        try {
            const dadosDoBackend = await AnimalService.listar(termo);
            
            const animaisMapeados = dadosDoBackend.map(animal => {
                let dataFormatada = animal.data_cadastro;
                if (dataFormatada && dataFormatada.includes('T')) {
                    dataFormatada = dataFormatada.split('T')[0];
                }

                return {
                    id: animal.animal_id,
                    nome: animal.nome_animal,
                    dataCadastro: dataFormatada,
                    sexo: animal.sexo,
                    raca: animal.raca,
                    porte: animal.porte,
                    idade: animal.idade,
                };
            });
            
            setAnimais(animaisMapeados);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            alert("Erro ao carregar animais: " + (error.response?.data?.error || error.message));
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        carregarAnimais();
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            carregarAnimais(termoBusca);
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [termoBusca]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDadosFormulario(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const abrirNovoCadastro = () => {
        setDadosFormulario(initialFormState);
    };

    const prepararEdicao = (animal) => {
        setDadosFormulario({
            id: animal.id,
            nome: animal.nome,
            dataCadastro: animal.dataCadastro,
            sexo: animal.sexo,
            raca: animal.raca,
            porte: animal.porte,
            idade: animal.idade,
        });
    };

    const lidarComEnvio = async (e) => {
        e.preventDefault();
        
        const dadosParaBackend = {
            nome_animal: dadosFormulario.nome,
            data_cadastro: dadosFormulario.dataCadastro,
            sexo: dadosFormulario.sexo,
            raca: dadosFormulario.raca,
            porte: dadosFormulario.porte,
            idade: dadosFormulario.idade,
        };
        
        try {
            if (dadosFormulario.id) {
                await AnimalService.salvar({ ...dadosParaBackend, animal_id: dadosFormulario.id });
                alert(`Cadastro de ${dadosFormulario.nome} atualizado com sucesso!`);
            } else {
                await AnimalService.salvar(dadosParaBackend);
                alert(`Animal ${dadosFormulario.nome} cadastrado com sucesso!`);
            }
            
            await carregarAnimais();

            if (window.bootstrap && window.bootstrap.Modal) {
                const modalElement = document.getElementById('cadastroModal');
                const modal = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
                modal.hide();
            }
            
            setDadosFormulario(initialFormState);
            
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar: " + (error.response?.data?.error || error.message));
        }
    };

    const deletarAnimal = async (id) => {
        if (window.confirm("Tem certeza que deseja DELETAR este cadastro?")) {
            try {
                await AnimalService.excluir(id);
                alert("Animal excluído com sucesso!");
                await carregarAnimais();
            } catch (error) {
                console.error("Erro ao deletar:", error);
                alert("Erro ao excluir: " + (error.response?.data?.error || error.message));
            }
        }
    };

    const animaisFiltrados = useMemo(() => animais, [animais]);

    return (
        <div className="container-fluid p-0">
            <header className="navbar custom-navbar shadow-sm p-3 mb-4 sticky-top">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1 custom-title">
                        🐾 Abrigo de Animais de Teodoro Sampaio
                    </span>
                    <div className="d-flex align-items-center">
                        <input
                            type="text"
                            className="form-control me-2 search-input"
                            placeholder="Buscar por nome, raça, porte..."
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                        />
                        <span className="text-white me-3 fw-bold">
                            Total: {animais.length}
                        </span>
                        
                        <button 
                            className="btn btn-primary custom-btn" 
                            data-bs-toggle="modal" 
                            data-bs-target="#cadastroModal"
                            onClick={abrirNovoCadastro}
                        >
                            <i className="bi bi-plus-circle-fill me-1"></i> Cadastrar
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="container-lg py-4">
                <h2 className="text-center mb-4 custom-subtitle">Gerenciamento de Cadastros</h2>
                
                {isLoading && <p className="text-center text-info">Carregando dados...</p>}

                {!isLoading && animaisFiltrados.length === 0 ? (
                    <p className="text-center text-muted">Nenhum animal cadastrado.</p>
                ) : (
                    <div className="row">
                        {animaisFiltrados.map(animal => (
                            <div key={animal.id} className="col-lg-4 col-md-6 mb-4">
                                <div className="card custom-card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title text-uppercase custom-card-title">{animal.nome}</h5>
                                        <p className="card-text mb-1"><small>Data: {animal.dataCadastro}</small></p>
                                        <hr/>
                                        <p className="card-text mb-1">
                                            <strong>Raça:</strong> {animal.raca} | <strong>Sexo:</strong> {animal.sexo}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Porte:</strong> {animal.porte}
                                        </p>
                                        <p className="card-text mb-1">
                                            <strong>Idade:</strong> {animal.idade}
                                        </p>
                                    </div>
                                    <div className="card-footer d-flex justify-content-end bg-transparent border-0 pt-0">
                                        <button 
                                            className="btn btn-sm btn-warning me-2 text-dark"
                                            data-bs-toggle="modal" 
                                            data-bs-target="#cadastroModal"
                                            onClick={() => prepararEdicao(animal)}
                                        >
                                            <i className="bi bi-pencil-fill"></i> Editar
                                        </button>

                                        <button 
                                            className="btn btn-sm btn-danger custom-delete-btn" 
                                            onClick={() => deletarAnimal(animal.id)}
                                        >
                                            <i className="bi bi-trash-fill"></i> Deletar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            
            <div className="modal fade" id="cadastroModal" tabIndex="-1" aria-labelledby="cadastroModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content custom-modal-content">
                        <div className="modal-header custom-modal-header">
                            <h5 className="modal-title custom-modal-title" id="cadastroModalLabel">
                                {dadosFormulario.id ? 'Editar Cadastro' : 'Novo Cadastro de Animal'}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={lidarComEnvio}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="nome" className="form-label">Nome do Animal *</label>
                                            <input type="text" className="form-control" id="nome" name="nome" 
                                                value={dadosFormulario.nome} onChange={handleChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="dataCadastro" className="form-label">Data do Cadastro *</label>
                                            <input type="date" className="form-control" id="dataCadastro" name="dataCadastro" 
                                                value={dadosFormulario.dataCadastro} onChange={handleChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sexo" className="form-label">Sexo *</label>
                                            <select className="form-select" id="sexo" name="sexo" 
                                                value={dadosFormulario.sexo} onChange={handleChange} required>
                                                <option value="Macho">Macho</option>
                                                <option value="Fêmea">Fêmea</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="raca" className="form-label">Raça *</label>
                                            <input type="text" className="form-control" id="raca" name="raca" 
                                                value={dadosFormulario.raca} onChange={handleChange} required />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="porte" className="form-label">Porte *</label>
                                            <select className="form-select" id="porte" name="porte" 
                                                value={dadosFormulario.porte} onChange={handleChange} required>
                                                <option value="Pequeno">Pequeno</option>
                                                <option value="Médio">Médio</option>
                                                <option value="Grande">Grande</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="idade" className="form-label">Idade *</label>
                                            <select className="form-select" id="idade" name="idade" 
                                                value={dadosFormulario.idade} onChange={handleChange} required>
                                                <option value="Filhote">Filhote</option>
                                                <option value="Adulto">Adulto</option>
                                                <option value="Idoso">Idoso</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="d-grid mt-4">
                                    <button type="submit" className="btn btn-lg custom-btn">
                                        <i className="bi bi-save me-2"></i> {dadosFormulario.id ? 'Atualizar Dados' : 'Salvar Cadastro'}
                                    </button>
                                </div>
                                <p className="text-muted mt-2"><small>* Campos obrigatórios</small></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GerenciadorAbrigoAnimais;