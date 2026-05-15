import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table, Card, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, LogOut, History } from 'lucide-react';
import './EstilosAbrigo.css';
import EstoqueService from '../services/EstoqueService';

const GerenciarEstoque = () => {
    const [itens, setItens] = useState([]);
    const [historico, setHistorico] = useState([]);
    const [mensagem, setMensagem] = useState({});

    const [showModalSaida, setShowModalSaida] = useState(false);
    const [itemParaSaida, setItemParaSaida] = useState(null);
    const [dadosSaida, setDadosSaida] = useState({ quantidade: 1, destino: '' });

    const [formData, setFormData] = useState({
        id: null, nome_item: '', categoria: '', quantidade_atual: '',
        unidade_medida: '', quantidade_minima: '', data_validade: ''
    });

    const carregar = async () => {
        try {
            const dadosEstoque = await EstoqueService.listar();
            setItens(Array.isArray(dadosEstoque) ? dadosEstoque : []);
        } catch (error) {
            console.error("Erro ao carregar inventário:", error);
            setMensagem({ tipo: 'danger', texto: 'Erro ao conectar com o banco de dados principal.' });
        }

        try {
            const dadosHistorico = await EstoqueService.listarHistorico();
            setHistorico(Array.isArray(dadosHistorico) ? dadosHistorico : []);
        } catch (error) {
            console.error("Histórico temporariamente indisponível:", error.message);
            setHistorico([]);
        }
    };

    useEffect(() => { carregar(); }, []);

    const handleConfirmarSaida = async () => {
        try {
            const usuarioJSON = localStorage.getItem('usuario');
            const usuarioLogado = usuarioJSON ? JSON.parse(usuarioJSON) : null;
            const idResponsavel = usuarioLogado?.id || usuarioLogado?.id_usuario;

            if (!idResponsavel) {
                setMensagem({ tipo: 'danger', texto: 'Erro: Usuário não identificado. Faça login novamente.' });
                return;
            }

            const payload = {
                estoque_id: itemParaSaida.id,
                quantidade: dadosSaida.quantidade,
                destino: dadosSaida.destino || "Uso Geral no Abrigo",
                responsavel_id: idResponsavel
            };

            await EstoqueService.registrarSaida(payload);

            setMensagem({ tipo: 'bg-pink', texto: 'Baixa realizada com sucesso!' });
            setShowModalSaida(false);
            setDadosSaida({ quantidade: 1, destino: '' });
            carregar();
        } catch (error) {
            const erroMsg = error.response?.data?.error || 'Erro ao registrar saída';
            setMensagem({ tipo: 'danger', texto: erroMsg });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await EstoqueService.salvar(formData);
            setMensagem({ tipo: 'bg-pink', texto: 'Salvo com sucesso!' });
            setFormData({
                id: null, nome_item: '', categoria: '', quantidade_atual: '',
                unidade_medida: '', quantidade_minima: '', data_validade: ''
            });
            carregar();
        } catch (error) {
            setMensagem({ tipo: 'danger', texto: 'Erro ao salvar dados do item.' });
        }
    };

    const editar = (item) => {
        setFormData(item);
        window.scrollTo(0, 0);
    };

    const excluir = async (id) => {
        if (window.confirm("Excluir item?")) {
            await EstoqueService.excluir(id);
            carregar();
        }
    };

    const prepararSaida = (item) => {
        setItemParaSaida(item);
        setShowModalSaida(true);
    };

    return (
        <Container className="mt-4 pb-5">
            <header className="d-flex align-items-center mb-4 gap-3">
                <Link to="/home" className="btn btn-dark custom-btn-back">
                    <ArrowLeft size={20} />
                </Link>
                <h2 className="custom-subtitle">📦 Controle de Estoque</h2>
            </header>

            {mensagem.texto && (
                <Alert variant="light" className={mensagem.tipo} onClose={() => setMensagem({})} dismissible>
                    {mensagem.texto}
                </Alert>
            )}

            <Card className="custom-card mb-4 shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={4}>
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    value={formData.nome_item || ''}
                                    onChange={e => setFormData({ ...formData, nome_item: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Categoria</Form.Label>
                                <Form.Select
                                    value={formData.categoria || ''}
                                    onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option>Alimentação</option>
                                    <option>Medicamento</option>
                                    <option>Higiene</option>
                                    <option>Outros</option>
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Label>Qtd</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.quantidade_atual || ''}
                                    onChange={e => setFormData({ ...formData, quantidade_atual: e.target.value })}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Unidade</Form.Label>
                                <Form.Select
                                    value={formData.unidade_medida || ''}
                                    onChange={e => setFormData({ ...formData, unidade_medida: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="Kg">Kg</option>
                                    <option value="Gramas">Gramas</option>
                                    <option value="Litros">Litros</option>
                                    <option value="UN">UN</option>
                                    <option value="Pacote">Pacote</option>
                                    <option value="Caixa">Caixa</option>
                                    <option value="Frasco">Frasco</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md={3}>
                                <Form.Label>Mínimo</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={formData.quantidade_minima || ''}
                                    onChange={e => setFormData({ ...formData, quantidade_minima: e.target.value })}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Label>Validade</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={formData.data_validade ? formData.data_validade.split('T')[0] : ''}
                                    onChange={e => setFormData({ ...formData, data_validade: e.target.value })}
                                />
                            </Col>
                        </Row>
                        <Button type="submit" className="custom-btn mt-3 w-100">Salvar</Button>
                    </Form>
                </Card.Body>
            </Card>

            <Row>
                <Col md={8}>
                    <Card className="custom-card shadow-sm">
                        <Card.Header className="bg-pink text-white d-flex align-items-center gap-2">
                            <History size={20} /> Inventário Atual
                        </Card.Header>
                        <Table hover responsive className="text-center mb-0">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Qtd</th>
                                    <th>Mín</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itens && itens.length > 0 ? (
                                    itens.map(i => (
                                        <tr key={i.id} className={i.quantidade_atual <= i.quantidade_minima ? 'table-warning' : ''}>
                                            <td className="text-start ps-3">{i.nome_item}</td>
                                            <td>{i.quantidade_atual} {i.unidade_medida}</td>
                                            <td>{i.quantidade_minima}</td>
                                            <td>
                                                <Button variant="link" className="text-warning p-1" onClick={() => prepararSaida(i)}>
                                                    <LogOut size={18} />
                                                </Button>
                                                <Button variant="link" className="p-1" onClick={() => editar(i)}>
                                                    <Edit size={18} />
                                                </Button>
                                                <Button variant="link" className="text-danger p-1" onClick={() => excluir(i.id)}>
                                                    <Trash2 size={18} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="py-3 text-muted">Aguardando dados...</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="custom-card shadow-sm border-dark">
                        <Card.Header className="bg-dark text-white">🕒 Histórico de Saídas</Card.Header>
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <Table size="sm" hover responsive className="text-center mb-0 small">
                                <thead className="table-secondary">
                                    <tr>
                                        <th>Item</th>
                                        <th>Qtd</th>
                                        <th>Destino</th>
                                        <th>Responsável</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historico && historico.length > 0 ? (
                                        historico.map(h => (
                                            <tr key={h.id}>
                                                <td className="text-start">{h.nome_item}</td>
                                                <td className="text-danger">-{h.quantidade_saída}</td>
                                                <td className="text-muted small">{h.destino || '-'}</td>
                                                <td className="fw-bold">{h.responsavel}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="py-3 text-muted">Aguardando dados...</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModalSaida} onHide={() => setShowModalSaida(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Saída: {itemParaSaida?.nome_item}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantidade para Retirar</Form.Label>
                            <Form.Control
                                type="number"
                                value={dadosSaida.quantidade}
                                onChange={(e) => setDadosSaida({ ...dadosSaida, quantidade: e.target.value })}
                                max={itemParaSaida?.quantidade_atual}
                                min="1"
                            />
                            <Form.Text className="text-muted">
                                Saldo disponível: {itemParaSaida?.quantidade_atual} {itemParaSaida?.unidade_medida}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Destino/Observação</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Ex: Baia 05, Uso Veterinário..."
                                value={dadosSaida.destino}
                                onChange={(e) => setDadosSaida({ ...dadosSaida, destino: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalSaida(false)}>Cancelar</Button>
                    <Button className="custom-btn" onClick={handleConfirmarSaida}>Confirmar Baixa</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default GerenciarEstoque;