import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table, Card, InputGroup, Alert } from 'react-bootstrap';
import { Edit, Trash2, Search, DollarSign, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './EstilosAbrigo.css';
import FinanceiroService from '../services/FinanceiroService';

function GerenciarFinanceiro() {

  const [movimentos, setMovimentos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [editando, setEditando] = useState(false);

  const initialFormState = {
    id: null,
    tipo: 'Entrada',
    valor: '',
    categoria: '',
    data_movimento: new Date().toISOString().split('T')[0],
    descricao: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const carregarDados = async () => {
    try {
      const dados = await FinanceiroService.listar(filtro);
      setMovimentos(Array.isArray(dados) ? dados : []);
    } catch {
      setMensagem({ tipo: 'danger', texto: 'Erro ao carregar movimentações.' });
    }
  };

  useEffect(() => {
    carregarDados();
  }, [filtro]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.valor || Number(formData.valor) <= 0) {
      setMensagem({ tipo: 'danger', texto: 'Valor deve ser maior que zero.' });
      return;
    }

    try {
      await FinanceiroService.salvar(formData);

      setMensagem({
        tipo: 'bg-pink',
        texto: editando ? 'Movimentação atualizada!' : 'Movimentação registrada!'
      });

      setFormData(initialFormState);
      setEditando(false);
      carregarDados();

    } catch {
      setMensagem({ tipo: 'danger', texto: 'Erro ao salvar dados.' });
    }
  };

  const prepararEdicao = (mov) => {
    setFormData({
      id: mov.id,
      tipo: mov.tipo,
      valor: mov.valor,
      categoria: mov.categoria,
      data_movimento: mov.data_movimento ? mov.data_movimento.split('T')[0] : mov.data_movimento,
      descricao: mov.descricao || ''
    });
    setEditando(true);
    window.scrollTo(0, 0);
  };

  const formatarValor = (valor) => {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data + 'T12:00:00').toLocaleDateString('pt-BR');
  };

  return (
    <Container className="mt-4 pb-5">

      <header data-tour="page-header" className="d-flex align-items-center mb-4 gap-3">
        <Link to="/home" className="btn btn-dark custom-btn-back" style={{ border: '1px solid #FF69B4' }}>
          <ArrowLeft size={20} color="#FF69B4" />
        </Link>
        <h2 className="custom-subtitle m-0 d-flex align-items-center gap-2">
          <DollarSign size={30} /> Controle Financeiro
        </h2>
      </header>

      {mensagem.texto && (
        <Alert
          variant={mensagem.tipo === 'bg-pink' ? 'light' : 'danger'}
          className={mensagem.tipo}
          dismissible
          onClose={() => setMensagem({ tipo: '', texto: '' })}
        >
          {mensagem.texto}
        </Alert>
      )}

      <Card data-tour="formulario" className="custom-card shadow-sm mb-4 border-0">
        <Card.Header className="custom-navbar text-white">
          <h5 className="m-0 text-white">
            {editando ? 'Editar Movimentação' : 'Nova Movimentação'}
          </h5>
        </Card.Header>

        <Card.Body className="bg-white">

          <Form onSubmit={handleSubmit}>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Tipo *</Form.Label>
                  <Form.Select
                    name="tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    required
                  >
                    <option value="Entrada">Entrada</option>
                    <option value="Saída">Saída</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Valor *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="valor"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    placeholder="0,00"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Categoria *</Form.Label>
                  <Form.Select
                    name="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    required
                  >
                    <option value="">Selecione</option>
                    {formData.tipo === 'Entrada' ? (
                      <>
                        <option value="Doação">Doação</option>
                        <option value="Evento">Evento</option>
                        <option value="Taxa de Adoção">Taxa de Adoção</option>
                        <option value="Subvenção">Subvenção</option>
                        <option value="Outra">Outra</option>
                      </>
                    ) : (
                      <>
                        <option value="Alimentação">Alimentação</option>
                        <option value="Medicamento">Medicamento</option>
                        <option value="Veterinário">Veterinário</option>
                        <option value="Manutenção">Manutenção</option>
                        <option value="Salário">Salário</option>
                        <option value="Contas">Contas (Água/Luz)</option>
                        <option value="Outra">Outra</option>
                      </>
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Data *</Form.Label>
                  <Form.Control
                    type="date"
                    name="data_movimento"
                    value={formData.data_movimento}
                    onChange={(e) => setFormData({ ...formData, data_movimento: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Descrição / Origem</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva a origem ou destino do valor..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button data-tour="salvar" className="custom-btn flex-grow-1" type="submit">
                {editando ? 'Atualizar Movimentação' : 'Registrar Movimentação'}
              </Button>

              {editando && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFormData(initialFormState);
                    setEditando(false);
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>

          </Form>
        </Card.Body>
      </Card>

      <InputGroup data-tour="busca" className="mb-4 shadow-sm">
        <InputGroup.Text className="bg-white">
          <Search size={18} />
        </InputGroup.Text>
        <Form.Control
          placeholder="Pesquisar por descrição ou categoria..."
          onChange={e => setFiltro(e.target.value)}
        />
      </InputGroup>

      <Card data-tour="listagem" className="custom-card shadow-sm border-0">
        <Table responsive hover className="text-center align-middle mb-0 bg-white">

          <thead className="bg-pink text-white">
            <tr>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Categoria</th>
              <th>Data</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {movimentos.length > 0 ? movimentos.map(m => (
              <tr key={m.id}>
                <td>
                  <span className={`badge ${m.tipo === 'Entrada' ? 'bg-success' : 'bg-danger'}`}>
                    {m.tipo}
                  </span>
                </td>
                <td className={m.tipo === 'Entrada' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                  {formatarValor(m.valor)}
                </td>
                <td>{m.categoria}</td>
                <td>{formatarData(m.data_movimento)}</td>
                <td className="text-muted small">{m.descricao || '-'}</td>

                <td data-tour="acoes">
                  <Button
                    variant="link"
                    className="text-primary me-2"
                    onClick={() => prepararEdicao(m)}
                  >
                    <Edit size={18} />
                  </Button>

                  <Button
                    variant="link"
                    className="text-danger"
                    onClick={() => {
                      if (window.confirm('Excluir esta movimentação?'))
                        FinanceiroService.excluir(m.id).then(carregarDados)
                    }}
                  >
                    <Trash2 size={18} />
                  </Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-4 text-muted">
                  Nenhuma movimentação encontrada.
                </td>
              </tr>
            )}
          </tbody>

        </Table>

        {movimentos.length > 0 && (
          <div className="p-3 bg-light border-top d-flex justify-content-around fw-bold">
            <span className="text-success">
              Total Entradas: {formatarValor(
                movimentos.filter(m => m.tipo === 'Entrada').reduce((s, m) => s + Number(m.valor), 0)
              )}
            </span>
            <span className="text-danger">
              Total Saídas: {formatarValor(
                movimentos.filter(m => m.tipo === 'Saída').reduce((s, m) => s + Number(m.valor), 0)
              )}
            </span>
            <span>
              Saldo: {formatarValor(
                movimentos.filter(m => m.tipo === 'Entrada').reduce((s, m) => s + Number(m.valor), 0) -
                movimentos.filter(m => m.tipo === 'Saída').reduce((s, m) => s + Number(m.valor), 0)
              )}
            </span>
          </div>
        )}
      </Card>
    </Container>
  );
}

export default GerenciarFinanceiro;