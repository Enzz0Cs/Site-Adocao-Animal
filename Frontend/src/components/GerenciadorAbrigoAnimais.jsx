import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, InputGroup, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Pencil, Trash2, Search, ShieldCheck } from 'lucide-react';
import './EstilosAbrigo.css';

import AnimalService from '../services/AnimalService';
import VacinaService from '../services/VacinaService';
import HistoricoService from '../services/HistoricoService';

const GerenciadorAbrigoAnimais = () => {
    const [animais, setAnimais] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [termoBusca, setTermoBusca] = useState('');
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

    const [showModal, setShowModal] = useState(false);
    const [showVacinaModal, setShowVacinaModal] = useState(false);
    const [showValidarModal, setShowValidarModal] = useState(false);

    const [animalSelecionado, setAnimalSelecionado] = useState(null);
    const [vacinas, setVacinas] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [justificativa, setJustificativa] = useState("");

    const [formVacina, setFormVacina] = useState({
        vacina_id: '',
        data_aplicacao: '',
        observacoes: ''
    });

    const initialFormState = {
        id: null,
        nome_animal: '',
        data_cadastro: new Date().toISOString().split('T')[0],
        sexo: 'Macho',
        raca: '',
        porte: 'Médio',
        idade: '2',
        status_adocao: 'Apto'
    };

    const [formData, setFormData] = useState(initialFormState);

    const carregarAnimais = async (termo = '') => {
        setIsLoading(true);
        try {
            const resposta = await AnimalService.listar(termo);
            const dadosLista = Array.isArray(resposta) ? resposta : (resposta?.data || []);
            const animaisEmAbrigo = dadosLista.filter(animal => animal.status_adocao !== 'Adotado');

            setAnimais(animaisEmAbrigo);
        } catch (error) {
            console.error("Erro ao carregar animais:", error);
            setAnimais([]);
            setMensagem({ tipo: 'danger', texto: 'Erro ao conectar com o banco de Teodoro Sampaio.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { carregarAnimais(); }, []);

    useEffect(() => {
        const timer = setTimeout(() => carregarAnimais(termoBusca), 400);
        return () => clearTimeout(timer);
    }, [termoBusca]);

    const handleShow = (animal = null) => {
        if (animal) {
            setFormData({
                id: animal.id || animal.animal_id,
                nome_animal: animal.nome_animal || '',
                data_cadastro: animal.data_cadastro ? animal.data_cadastro.split('T')[0] : '',
                sexo: animal.sexo || 'Macho',
                raca: animal.raca || '',
                porte: animal.porte || 'Médio',
                idade: animal.idade || '2',
                status_adocao: animal.status_adocao || 'Apto'
            });
        } else {
            setFormData(initialFormState);
        }
        setShowModal(true);
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        try {
            await AnimalService.salvar(formData);

            setMensagem({
                tipo: 'bg-pink',
                texto: formData.id ? 'Dados atualizados com sucesso!' : 'Animal cadastrado no abrigo!'
            });

            setShowModal(false);
            carregarAnimais();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            setMensagem({ tipo: 'danger', texto: 'Erro ao salvar. Verifique o console do VS Code.' });
        }
    };

    const handleExcluir = async (id) => {
        if (!id) return;
        if (window.confirm("Tem certeza que deseja excluir permanentemente este animal?")) {
            try {
                await AnimalService.excluir(id);
                setMensagem({ tipo: 'info', texto: 'Animal removido do sistema.' });
                carregarAnimais();
            } catch (error) {
                setMensagem({ tipo: 'danger', texto: 'Erro ao excluir animal.' });
            }
        }
    };

    const abrirModalVacina = async (animal) => {
        const id = animal.id || animal.animal_id;
        setAnimalSelecionado(animal);
        setShowVacinaModal(true);
        const vacinasLista = await VacinaService.listar();
        setVacinas(vacinasLista.data || vacinasLista);
        const hist = await HistoricoService.listar(id);
        setHistorico(hist);
    };

    const aplicarVacina = async () => {
        try {
            const id = animalSelecionado.id || animalSelecionado.animal_id;
            await HistoricoService.aplicar({ animal_id: id, ...formVacina });
            setMensagem({ tipo: 'info', texto: 'Vacina registrada no histórico!' });
            setShowVacinaModal(false);
            carregarAnimais();
        } catch {
            setMensagem({ tipo: 'danger', texto: 'Erro ao aplicar vacina.' });
        }
    };

    const abrirValidacao = (animal) => {
        setAnimalSelecionado(animal);
        setShowValidarModal(true);
    };

    const validarAnimal = async () => {
        try {
            const id = animalSelecionado.id || animalSelecionado.animal_id;
            await AnimalService.validar({ animalId: id, justificativa });
            setMensagem({ tipo: 'bg-pink', texto: 'Aptidão técnica validada!' });
            setShowValidarModal(false);
            setJustificativa("");
            carregarAnimais();
        } catch {
            setMensagem({ tipo: 'danger', texto: 'Erro ao validar.' });
        }
    };

    return (
        <div className="container-fluid p-0 min-vh-100 bg-light">
            <header className="navbar custom-navbar shadow-sm p-3 mb-4 sticky-top">
                <div className="container-fluid">
                    <div className="d-flex align-items-center">
                        <Link to="/home" className="btn btn-dark me-3">
                            <ArrowLeft size={20} />
                        </Link>
                        <span className="navbar-brand custom-title text-white">
                            🐾 Abrigo de Teodoro Sampaio
                        </span>
                    </div>
                    <Button className="custom-btn" onClick={() => handleShow()}>
                        <PlusCircle size={18} className="me-2" /> Cadastrar
                    </Button>
                </div>
            </header>

            <Container>
                <InputGroup className="mb-4">
                    <InputGroup.Text><Search size={16} /></InputGroup.Text>
                    <Form.Control
                        placeholder="Buscar por nome, raça ou status..."
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
                    <div className="text-center py-5">Sincronizando com o MySQL...</div>
                ) : (
                    <Row>
                        {animais.map(animal => (
                            <Col md={6} lg={4} key={animal.id || animal.animal_id} className="mb-4">
                                <Card className="custom-card shadow-sm border-0 h-100">
                                    <Card.Body>
                                        <h5 className="fw-bold text-pink">{animal.nome_animal || "Sem nome cadastrado"}</h5>
                                        <p className="mb-1"><strong>Raça:</strong> {animal.raca || "Não informada"}</p>
                                        <p className="mb-1"><strong>Sexo:</strong> {animal.sexo || "Não informado"}</p>
                                        <p className="mb-1"><strong>Porte:</strong> {animal.porte || "Não informado"}</p>
                                        <p className="mb-0">
                                            <strong>Status:</strong>
                                            <span className={
                                                animal.status_adocao === "Apto"
                                                    ? "text-success fw-bold ms-1"
                                                    : "text-danger fw-bold ms-1"
                                            }>
                                                {" "}{animal.status_adocao || "Apto"}
                                            </span>
                                        </p>
                                    </Card.Body>
                                    <Card.Footer className="bg-white border-0 d-flex gap-2 justify-content-end pb-3">
                                        <Button variant="outline-primary" size="sm" onClick={() => abrirModalVacina(animal)} title="Vacinas">💉</Button>
                                        <Button variant="outline-success" size="sm" onClick={() => abrirValidacao(animal)}>
                                            <ShieldCheck size={16} />
                                        </Button>
                                        <Button variant="outline-secondary" size="sm" onClick={() => handleShow(animal)}>
                                            <Pencil size={16} />
                                        </Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleExcluir(animal.id || animal.animal_id)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <div className="custom-modal-content">
                    <Modal.Header closeButton className="bg-pink text-white" style={{ backgroundColor: '#FF69B4' }}>
                        <Modal.Title className="text-white">
                            {formData.id ? '✏️ Editar Animal' : '🐾 Novo Cadastro'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSalvar}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Nome do Animal</Form.Label>
                                        <Form.Control
                                            required
                                            placeholder="Ex: Rex, Mel..."
                                            value={formData.nome_animal}
                                            onChange={(e) => setFormData({ ...formData, nome_animal: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Data de Registro</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={formData.data_cadastro}
                                            onChange={(e) => setFormData({ ...formData, data_cadastro: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Sexo</Form.Label>
                                        <Form.Select
                                            value={formData.sexo}
                                            onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                                        >
                                            <option>Macho</option>
                                            <option>Fêmea</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Raça</Form.Label>
                                        <Form.Control
                                            placeholder="Ex: SRD, Poodle..."
                                            value={formData.raca}
                                            onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Porte</Form.Label>
                                        <Form.Select
                                            value={formData.porte}
                                            onChange={(e) => setFormData({ ...formData, porte: e.target.value })}
                                        >
                                            <option>Pequeno</option>
                                            <option>Médio</option>
                                            <option>Grande</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Faixa Etária</Form.Label>
                                        <Form.Select
                                            value={formData.idade}
                                            onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                                        >
                                            <option value="1">Filhote</option>
                                            <option value="2">Adulto</option>
                                            <option value="3">Idoso</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                {formData.id && (
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Status de Aptidão</Form.Label>
                                            <Form.Select
                                                value={formData.status_adocao}
                                                onChange={(e) => setFormData({ ...formData, status_adocao: e.target.value })}
                                            >
                                                <option value="Apto">Apto</option>
                                                <option value="Inapto">Inapto</option>
                                                <option value="Em análise">Em análise</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                )}
                            </Row>

                            <div className="mt-4 d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                                <Button style={{ backgroundColor: '#FF69B4', border: 'none' }} type="submit">
                                    {formData.id ? 'Salvar Alterações' : 'Finalizar Cadastro'}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </div>
            </Modal>

            <Modal show={showVacinaModal} onHide={() => setShowVacinaModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Vacinação</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Tipo da Vacina</Form.Label>
                        <Form.Select
                            value={formVacina.vacina_id}
                            onChange={(e) => setFormVacina({ ...formVacina, vacina_id: e.target.value })}
                        >
                            <option value="">Selecione...</option>
                            {vacinas.map(v => (
                                <option key={v.VacinaID} value={v.VacinaID}>{v.NomeVacina}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Data da Aplicação</Form.Label>
                        <Form.Control
                            type="date"
                            onChange={(e) => setFormVacina({ ...formVacina, data_aplicacao: e.target.value })}
                        />
                    </Form.Group>
                    <Button variant="primary" className="w-100" onClick={aplicarVacina}>Registrar Vacina</Button>
                    <hr />
                    <h6>Histórico Recente:</h6>
                    {historico.length === 0 ? <p className="text-muted small">Nenhuma vacina aplicada.</p> :
                        historico.map(h => (
                            <div key={h.id} className="small border-bottom mb-1">
                                💉 {h.nome_vacina} - {new Date(h.data_aplicacao).toLocaleDateString()}
                            </div>
                        ))
                    }
                </Modal.Body>
            </Modal>

            <Modal show={showValidarModal} onHide={() => setShowValidarModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>Validar Aptidão</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p>Avaliação técnica para: <strong>{animalSelecionado?.nome_animal}</strong></p>
                    <Form.Group>
                        <Form.Label>Parecer/Justificativa</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={justificativa}
                            onChange={(e) => setJustificativa(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowValidarModal(false)}>Voltar</Button>
                    <Button style={{ backgroundColor: '#FF69B4', border: 'none' }} onClick={validarAnimal}>Validar Animal</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default GerenciadorAbrigoAnimais;