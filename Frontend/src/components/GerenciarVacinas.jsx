import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table, Card, InputGroup, Alert } from 'react-bootstrap';
import { Edit, Trash2, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './EstilosAbrigo.css';
import VacinaService from '../services/VacinaService';

const GerenciarVacinas = () => {
    const [vacinas, setVacinas] = useState([]);
    const [formData, setFormData] = useState({ VacinaID: null, CodigoVacina: '', NomeVacina: '' });
    const [termoBusca, setTermoBusca] = useState('');
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
    const [isLoading, setIsLoading] = useState(false);

    const carregarVacinas = async (termo = '') => {
        setIsLoading(true);
        try {
            const dados = await VacinaService.listar(termo);
            setVacinas(Array.isArray(dados) ? dados : (dados?.data || []));
        } catch (error) {
            console.error("Erro ao carregar:", error);
            setVacinas([]);
            setMensagem({ tipo: 'danger', texto: 'Erro ao conectar com o servidor.' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { carregarVacinas(); }, []);
    useEffect(() => {
        const timer = setTimeout(() => carregarVacinas(termoBusca), 500);
        return () => clearTimeout(timer);
    }, [termoBusca]);

    const handleSalvar = async (e) => {
        e.preventDefault();
        try {
            const dadosParaEnviar = {
                CodigoVacina: formData.CodigoVacina,
                NomeVacina: formData.NomeVacina
            };

            if (formData.VacinaID) {
                dadosParaEnviar.VacinaID = formData.VacinaID;
            }

            await VacinaService.salvar(dadosParaEnviar);

            setMensagem({ tipo: 'bg-pink', texto: formData.VacinaID ? 'Vacina atualizada!' : 'Vacina cadastrada com sucesso!' });
            setFormData({ VacinaID: null, CodigoVacina: '', NomeVacina: '' });
            carregarVacinas();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            setMensagem({ tipo: 'danger', texto: 'Erro ao salvar: Verifique a conexão com a porta 3001.' });
        }
    };

    const handleExcluir = async (id) => {
        if (window.confirm('Deseja excluir esta vacina?')) {
            try {
                await VacinaService.excluir(id);
                setMensagem({ tipo: 'info', texto: 'Vacina removida.' });
                carregarVacinas();
            } catch (error) {
                setMensagem({ tipo: 'danger', texto: 'Erro ao excluir.' });
            }
        }
    };

    return (
        <Container className="mt-4 pb-5">
            <header data-tour="page-header" className="d-flex align-items-center mb-4 gap-3">
                <Link to="/home" className="btn btn-dark custom-btn-back" style={{ border: '1px solid #FF69B4' }}>
                    <ArrowLeft size={20} color="#FF69B4" />
                </Link>
                <h2 className="custom-subtitle m-0">💉 Controle de Vacinação</h2>
            </header>

            {mensagem.texto && (
                <Alert variant={mensagem.tipo === 'bg-pink' ? 'light' : 'danger'} className={mensagem.tipo} dismissible onClose={() => setMensagem({ tipo: '', texto: '' })}>
                    {mensagem.texto}
                </Alert>
            )}

            <Card data-tour="formulario" className="custom-card shadow-sm mb-5 border-0">
                <Card.Header className="custom-navbar text-white">
                    <h5 className="m-0 custom-title text-white">
                        {formData.VacinaID ? '📝 Editar Vacina' : '➕ Nova Vacina'}
                    </h5>
                </Card.Header>
                <Card.Body className="bg-white">
                    <Form onSubmit={handleSalvar}>
                        <Row className="align-items-end">
                            <Col md={3}>
                                <Form.Label className="small fw-bold">Código *</Form.Label>
                                <Form.Control
                                    placeholder="Ex: V01"
                                    value={formData.CodigoVacina}
                                    onChange={e => setFormData({ ...formData, CodigoVacina: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small fw-bold">Nome da Vacina *</Form.Label>
                                <Form.Control
                                    placeholder="Ex: Antirrábica"
                                    value={formData.NomeVacina}
                                    onChange={e => setFormData({ ...formData, NomeVacina: e.target.value })}
                                    required
                                />
                            </Col>
                            <Col md={3} className="d-flex gap-2">
                                <Button data-tour="salvar" className="custom-btn w-100" type="submit">Salvar</Button>
                                {formData.VacinaID && (
                                    <Button variant="secondary" onClick={() => setFormData({ VacinaID: null, CodigoVacina: '', NomeVacina: '' })}>Cancelar</Button>
                                )}
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Barra de Busca */}
            <InputGroup data-tour="busca" className="mb-4 shadow-sm">
                <InputGroup.Text className="bg-white border-end-0"><Search size={18} /></InputGroup.Text>
                <Form.Control
                    className="border-start-0"
                    placeholder="Buscar por nome ou código..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                />
            </InputGroup>

            {/* Tabela de Dados */}
            <Card data-tour="listagem" className="custom-card shadow-sm border-0">
                <Table responsive hover className="text-center align-middle mb-0 bg-white">
                    <thead className="bg-pink">
                        <tr className="text-white">
                            <th>ID</th>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="4" className="py-4">Carregando...</td></tr>
                        ) : vacinas.length > 0 ? (
                            vacinas.map(v => (
                                <tr key={v.VacinaID}>
                                    <td>#{v.VacinaID}</td>
                                    <td className="text-muted">{v.CodigoVacina}</td>
                                    <td className="fw-bold">{v.NomeVacina}</td>
                                    <td data-tour="acoes">
                                        <Button variant="link" className="text-primary me-2" onClick={() => setFormData(v)}>
                                            <Edit size={18} />
                                        </Button>
                                        <Button variant="link" className="text-danger" onClick={() => handleExcluir(v.VacinaID)}>
                                            <Trash2 size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="py-4 text-muted">Nenhuma vacina encontrada no abrigo.</td></tr>
                        )}
                    </tbody>
                </Table>
            </Card>
        </Container>
    );
};

export default GerenciarVacinas;
