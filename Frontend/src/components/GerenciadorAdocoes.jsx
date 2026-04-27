import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, Modal, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, HeartHandshake, Trash2, Search } from 'lucide-react';
import './EstilosAbrigo.css';

import AdocaoService from '../services/AdocaoService';
import AnimalService from '../services/AnimalService';
import AdotanteService from '../services/AdotanteService';

const GerenciadorAdocoes = () => {
    const [adocoes, setAdocoes] = useState([]);
    const [animaisDisponiveis, setAnimaisDisponiveis] = useState([]);
    const [adotantes, setAdotantes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [termoBusca, setTermoBusca] = useState('');
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
    const [showModal, setShowModal] = useState(false);

    const initialFormState = {
        animal_id: '',
        adotante_id: '',
        data_adocao: new Date().toISOString().split('T')[0]
    };

    const [formData, setFormData] = useState(initialFormState);

    const carregarDados = async () => {
        setIsLoading(true);
        try {
            try {
                const response = await AdocaoService.listar();
                const lista = Array.isArray(response) ? response : (response?.data || []);
                setAdocoes(lista);
            } catch (e) {
                console.error("Erro ao carregar histórico de adoções:", e);
            }
            try {
                const resA = await AnimalService.listar();
                const dadosA = Array.isArray(resA) ? resA : (resA?.data || []);
                const aptos = dadosA.filter(a => a.status_adocao === 'Apto' || a.status_adocao === 'Disponível');
                setAnimaisDisponiveis(aptos);
            } catch (e) {
                console.error("Erro ao carregar animais:", e);
            }
            try {
                const resAd = await AdotanteService.listar();
                const dadosAd = Array.isArray(resAd) ? resAd : (resAd?.data || []);
                setAdotantes(dadosAd);
            } catch (e) {
                console.error("Erro ao carregar adotantes:", e);
            }

        } catch (error) {
            setMensagem({ tipo: 'danger', texto: 'Erro crítico ao carregar dados do servidor.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const adocoesFiltradas = adocoes.filter(adocao => {
        const termo = termoBusca.toLowerCase();
        const nomeAnimal = (adocao.nome_animal || "").toLowerCase();
        const nomeAdotante = (adocao.NomeCompletoAdotante || "").toLowerCase();

        return nomeAnimal.includes(termo) || nomeAdotante.includes(termo);
    });

    const handleSalvar = async (e) => {
        e.preventDefault();
        if (!formData.animal_id || !formData.adotante_id) {
            setMensagem({ tipo: 'danger', texto: 'Selecione o animal e o adotante!' });
            return;
        }

        try {
            await AdocaoService.registrar(formData);
            setMensagem({ tipo: 'bg-pink', texto: 'Adoção registrada com sucesso!' });
            setShowModal(false);
            setFormData(initialFormState);
            setTimeout(() => carregarDados(), 400);
        } catch (error) {
            const msgErro = error.response?.data?.error || 'Erro ao registrar adoção no banco.';
            setMensagem({ tipo: 'danger', texto: msgErro });
        }
    };

    const handleExcluir = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta adoção? O animal voltará a ficar disponível para adoção.")) {
            try {
                await AdocaoService.excluir(id);
                setMensagem({ tipo: 'bg-pink', texto: 'Adoção excluída e animal liberado!' });
                carregarDados();
            } catch (error) {
                console.error("Erro ao excluir:", error);
                setMensagem({ tipo: 'danger', texto: 'Erro ao excluir a adoção.' });
            }
        }
    };

    return (
        <div className="container-fluid p-0 min-vh-100 bg-light">
            <header className="navbar custom-navbar shadow-sm p-3 mb-4 sticky-top" style={{ backgroundColor: '#FF69B4' }}>
                <div className="container-fluid">
                    <div className="d-flex align-items-center">
                        <Link to="/home" className="btn btn-dark me-3">
                            <ArrowLeft size={20} />
                        </Link>
                        <span className="navbar-brand custom-title text-white">
                            🤝 Registro de Adoções - Teodoro Sampaio
                        </span>
                    </div>
                    <Button className="btn btn-light fw-bold" onClick={() => setShowModal(true)}>
                        <PlusCircle size={18} className="me-2" /> Nova Adoção
                    </Button>
                </div>
            </header>

            <Container>
                <InputGroup className="mb-4 shadow-sm">
                    <InputGroup.Text className="bg-white border-end-0">
                        <Search size={18} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                        className="border-start-0"
                        placeholder="Pesquisar por animal ou adotante..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                    />
                </InputGroup>

                {mensagem.texto && (
                    <Alert variant={mensagem.tipo === 'bg-pink' ? 'success' : 'danger'} dismissible onClose={() => setMensagem({})}>
                        {mensagem.texto}
                    </Alert>
                )}

                {isLoading ? (
                    <div className="text-center py-5">Sincronizando com o banco de Teodoro Sampaio...</div>
                ) : (
                    <Row>
                        {adocoesFiltradas.length === 0 ? (
                            <Col className="text-center mt-5 text-muted">
                                {termoBusca ? "Nenhum resultado para esta pesquisa." : "Nenhuma adoção registrada ainda."}
                            </Col>
                        ) : (
                            adocoesFiltradas.map(adocao => (
                                <Col md={6} lg={4} key={adocao.id} className="mb-4">
                                    <Card className="custom-card shadow-sm border-0 h-100 position-relative">
                                        <Button
                                            variant="link"
                                            className="text-danger position-absolute top-0 end-0 p-2"
                                            onClick={() => handleExcluir(adocao.id)}
                                            title="Excluir adoção"
                                        >
                                            <Trash2 size={18} />
                                        </Button>

                                        <Card.Body>
                                            <div className="d-flex align-items-center mb-3">
                                                <HeartHandshake className="text-pink me-2" size={24} style={{ color: '#FF69B4' }} />
                                                <h5 className="mb-0">Final Feliz!</h5>
                                            </div>
                                            <p className="mb-1"><strong>🐶 Animal:</strong> {adocao.nome_animal || "Não identificado"}</p>
                                            <p className="mb-1"><strong>👤 Adotante:</strong> {adocao.NomeCompletoAdotante || "Não identificado"}</p>
                                            <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                                                <strong>📅 Data:</strong> {new Date(adocao.data_adocao).toLocaleDateString()}
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        )}
                    </Row>
                )}
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <div className="custom-modal-content">
                    <Modal.Header closeButton className="bg-pink text-white" style={{ backgroundColor: '#FF69B4' }}>
                        <Modal.Title className="text-white">Registrar Nova Adoção</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSalvar}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Animal</Form.Label>
                                <Form.Select
                                    required
                                    value={formData.animal_id}
                                    onChange={(e) => setFormData({ ...formData, animal_id: e.target.value })}
                                >
                                    <option value="">Selecione o Animal...</option>
                                    {animaisDisponiveis.map(a => (
                                        <option key={a.id} value={a.id}>
                                            {a.nome_animal} ({a.raca})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Adotante</Form.Label>
                                <Form.Select
                                    required
                                    value={formData.adotante_id}
                                    onChange={(e) => setFormData({ ...formData, adotante_id: e.target.value })}
                                >
                                    <option value="">Selecione o Adotante...</option>
                                    {adotantes.map((ad) => (
                                        <option key={ad.AdotanteID} value={ad.AdotanteID}>
                                            {ad.NomeCompletoAdotante} - CPF: {ad.CPFAdotante}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Data da Adoção</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.data_adocao}
                                    onChange={(e) => setFormData({ ...formData, data_adocao: e.target.value })}
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                                <Button style={{ backgroundColor: '#FF69B4', border: 'none' }} type="submit">
                                    Confirmar Adoção
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>
        </div>
    );
};

export default GerenciadorAdocoes;