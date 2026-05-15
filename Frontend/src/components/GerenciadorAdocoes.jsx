import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, Modal, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Search, Trash2 } from 'lucide-react';
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

    // 🔄 CARREGAR DADOS
    const carregarDados = async () => {
        setIsLoading(true);
        try {
            const response = await AdocaoService.listar();
            const lista = Array.isArray(response) ? response : (response?.data || []);
            setAdocoes(lista);

            const resA = await AnimalService.listar();
            const dadosA = Array.isArray(resA) ? resA : (resA?.data || []);
            const aptos = dadosA.filter(a => a.status_adocao === 'Apto' || a.status_adocao === 'Disponível');
            setAnimaisDisponiveis(aptos);

            const resAd = await AdotanteService.listar();
            const dadosAd = Array.isArray(resAd) ? resAd : (resAd?.data || []);
            setAdotantes(dadosAd);

        } catch (error) {
            setMensagem({ tipo: 'danger', texto: 'Erro ao carregar dados.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    // 🔍 FILTRO
    const adocoesFiltradas = adocoes.filter(adocao => {
        const termo = termoBusca.toLowerCase();
        return (
            (adocao.nome_animal || "").toLowerCase().includes(termo) ||
            (adocao.NomeCompletoAdotante || "").toLowerCase().includes(termo)
        );
    });

    // ➕ CRIAR ADOÇÃO
    const handleSalvar = async (e) => {
        e.preventDefault();

        try {
            await AdocaoService.registrar(formData);

            setMensagem({
                tipo: 'success',
                texto: 'Adoção criada! Email enviado para o adotante 📩'
            });

            setShowModal(false);
            setFormData(initialFormState);
            carregarDados();

        } catch (error) {
            setMensagem({
                tipo: 'danger',
                texto: 'Erro ao registrar adoção'
            });
        }
    };

    // ❌ EXCLUIR
    const handleExcluir = async (id) => {
        if (window.confirm("Excluir adoção?")) {
            await AdocaoService.excluir(id);
            carregarDados();
        }
    };

    // ✅ FINALIZAR
    const finalizar = async (id) => {
        try {
            await AdocaoService.finalizar(id);

            setMensagem({
                tipo: 'success',
                texto: 'Adoção finalizada com sucesso 🎉'
            });

            carregarDados();

        } catch {
            setMensagem({
                tipo: 'danger',
                texto: 'Erro ao finalizar adoção'
            });
        }
    };

    return (
        <div className="container-fluid p-0 min-vh-100 bg-light">

            {/* HEADER */}
            <header className="navbar custom-navbar p-3 mb-4" style={{ backgroundColor: '#FF69B4' }}>
                <div className="container-fluid">

                    <Link to="/home" className="btn btn-dark">
                        <ArrowLeft size={20} />
                    </Link>

                    <span className="text-white fw-bold">
                        🤝 Registro de Adoções
                    </span>

                    <Button onClick={() => setShowModal(true)}>
                        <PlusCircle size={18} /> Nova Adoção
                    </Button>

                </div>
            </header>

            <Container>

                {/* BUSCA */}
                <InputGroup className="mb-4">
                    <Form.Control
                        placeholder="Buscar..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                    />
                </InputGroup>

                {/* ALERTA */}
                {mensagem.texto && (
                    <Alert variant={mensagem.tipo}>
                        {mensagem.texto}
                    </Alert>
                )}

                {/* LISTA */}
                <Row>
                    {adocoesFiltradas.map(adocao => (

                        <Col md={4} key={adocao.id}>
                            <Card className="mb-3 p-3">

                                {/* TÍTULO */}
                                <h5>
                                    {adocao.status === "Finalizada"
                                        ? "Final Feliz 🎉"
                                        : adocao.status === "Confirmado"
                                        ? "Pronto para Finalizar"
                                        : "Aguardando Confirmação"}
                                </h5>

                                <p><b>Animal:</b> {adocao.nome_animal}</p>
                                <p><b>Adotante:</b> {adocao.NomeCompletoAdotante}</p>

                                <p>
                                    <b>Status:</b>{" "}
                                    <span className={
                                        adocao.status === "Finalizada"
                                            ? "text-success"
                                            : adocao.status === "Confirmado"
                                            ? "text-primary"
                                            : "text-warning"
                                    }>
                                        {adocao.status}
                                    </span>
                                </p>

                                {/* DATA */}
                                {adocao.data_assinatura && (
                                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                        🖊️ Assinado em: {new Date(adocao.data_assinatura).toLocaleDateString()}
                                    </p>
                                )}

                                {/* DOCUMENTO */}
                                {adocao.status !== "Finalizada" && (
                                    <div className="border p-2 bg-light">
                                        <b>Documento:</b>
                                        <p>{adocao.documento}</p>
                                    </div>
                                )}

                                {/* BOTÃO FINALIZAR */}
                                {adocao.status === "Confirmado" && (
                                    <Button
                                        className="mt-2"
                                        onClick={() => finalizar(adocao.id)}
                                    >
                                        Finalizar Adoção
                                    </Button>
                                )}

                                {/* EXCLUIR */}
                                <Button
  variant="outline-danger"
  size="sm"
  className="mt-2 d-flex align-items-center justify-content-center"
  style={{ width: "40px", height: "40px" }}
  onClick={() => handleExcluir(adocao.id)}
>
  <Trash2 size={16} />
</Button>

                            </Card>
                        </Col>

                    ))}
                </Row>

            </Container>

            {/* MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>

                <div className="custom-modal-content">

                    <Modal.Header closeButton className="custom-modal-header text-white">
                        <Modal.Title className="custom-modal-title text-white">
                            Nova Adoção
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                        <Form onSubmit={handleSalvar}>

                            <Row>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Animal *</Form.Label>
                                        <Form.Select
                                            value={formData.animal_id}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    animal_id: e.target.value
                                                })
                                            }
                                            required
                                        >
                                            <option value="">Selecione</option>
                                            {animaisDisponiveis.map(a => (
                                                <option key={a.id} value={a.id}>
                                                    {a.nome_animal}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Adotante *</Form.Label>
                                        <Form.Select
  name="adotante_id"
  value={formData.adotante_id}
  onChange={(e) =>
    setFormData({ ...formData, adotante_id: e.target.value })
  }
  required
>
  <option value="">Selecione</option>

  {adotantes.map(a => (
    <option key={a.AdotanteID} value={a.AdotanteID}>
      {a.NomeCompletoAdotante}
    </option>
  ))}
</Form.Select>
                                    </Form.Group>
                                </Col>

                            </Row>

                            <Row className="mt-3">

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Data da Adoção *</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={formData.data_adocao}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    data_adocao: e.target.value
                                                })
                                            }
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                            </Row>

                            <div className="mt-4 d-flex justify-content-end gap-2">

                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </Button>

                                <Button className="custom-btn" type="submit">
                                    Criar Adoção
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