import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table, Card, InputGroup, Alert } from 'react-bootstrap';
import { Edit, Trash2, Search, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './EstilosAbrigo.css';
import AdotanteService from '../services/AdotanteService';

function GerenciarAdotantes() {

  const [adotantes, setAdotantes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [editando, setEditando] = useState(false);

  const initialFormState = {
    AdotanteID: null,
    NomeCompletoAdotante: '',
    CPFAdotante: '',
    RGAdotante: '',
    TelefoneAdotante: '',
    RuaNumeroAdotante: '',
    BairroAdotante: '',
    CEPAdotante: '',
    email: '' // 🔥 NOVO
  };

  const [formData, setFormData] = useState(initialFormState);

  // máscaras
  const mascaraCPF = (v) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').slice(0, 14);
  const mascaraTelefone = (v) => v.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').slice(0, 15);
  const mascaraCEP = (v) => v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
  const mascaraRG = (v) => v.replace(/[^0-9xX]/g, '').toUpperCase().slice(0, 12);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === 'CPFAdotante') val = mascaraCPF(value);
    if (name === 'TelefoneAdotante') val = mascaraTelefone(value);
    if (name === 'CEPAdotante') val = mascaraCEP(value);
    if (name === 'RGAdotante') val = mascaraRG(value);

    setFormData({ ...formData, [name]: val });
  };

  const carregarDados = async () => {
    try {
      const dados = await AdotanteService.listar(filtro);
      setAdotantes(Array.isArray(dados) ? dados : []);
    } catch {
      setMensagem({ tipo: 'danger', texto: 'Erro ao carregar adotantes.' });
    }
  };

  useEffect(() => {
    carregarDados();
  }, [filtro]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setMensagem({ tipo: 'danger', texto: 'Email é obrigatório!' });
      return;
    }

    try {
      await AdotanteService.salvar(formData);

      setMensagem({
        tipo: 'bg-pink',
        texto: editando ? 'Cadastro atualizado!' : 'Adotante cadastrado!'
      });

      setFormData(initialFormState);
      setEditando(false);
      carregarDados();

    } catch {
      setMensagem({ tipo: 'danger', texto: 'Erro ao salvar dados.' });
    }
  };

  const prepararEdicao = (adotante) => {
    setFormData(adotante);
    setEditando(true);
    window.scrollTo(0, 0);
  };

  return (
    <Container className="mt-4 pb-5">

      <header className="d-flex align-items-center mb-4 gap-3">
        <Link to="/home" className="btn btn-dark custom-btn-back" style={{ border: '1px solid #FF69B4' }}>
          <ArrowLeft size={20} color="#FF69B4" />
        </Link>
        <h2 className="custom-subtitle m-0 d-flex align-items-center gap-2">
          <User size={30} /> Gerenciar Adotantes
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

      <Card className="custom-card shadow-sm mb-4 border-0">
        <Card.Header className="custom-navbar text-white">
          <h5 className="m-0 text-white">
            {editando ? '📝 Editar Adotante' : '👤 Novo Cadastro'}
          </h5>
        </Card.Header>

        <Card.Body className="bg-white">

          <Form onSubmit={handleSubmit}>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Nome Completo *</Form.Label>
                  <Form.Control
                    name="NomeCompletoAdotante"
                    value={formData.NomeCompletoAdotante}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">CPF *</Form.Label>
                  <Form.Control
                    name="CPFAdotante"
                    value={formData.CPFAdotante}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">RG</Form.Label>
                  <Form.Control
                    name="RGAdotante"
                    value={formData.RGAdotante}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* 🔥 EMAIL */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="exemplo@email.com"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Telefone *</Form.Label>
                  <Form.Control
                    name="TelefoneAdotante"
                    value={formData.TelefoneAdotante}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">CEP</Form.Label>
                  <Form.Control
                    name="CEPAdotante"
                    value={formData.CEPAdotante}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Bairro</Form.Label>
                  <Form.Control
                    name="BairroAdotante"
                    value={formData.BairroAdotante}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Rua e Nº *</Form.Label>
                  <Form.Control
                    name="RuaNumeroAdotante"
                    value={formData.RuaNumeroAdotante}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button className="custom-btn flex-grow-1" type="submit">
                {editando ? 'Atualizar Adotante' : 'Salvar Adotante'}
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

      <InputGroup className="mb-4 shadow-sm">
        <InputGroup.Text className="bg-white">
          <Search size={18} />
        </InputGroup.Text>
        <Form.Control
          placeholder="Pesquisar por nome, CPF ou email..."
          onChange={e => setFiltro(e.target.value)}
        />
      </InputGroup>

      <Card className="custom-card shadow-sm border-0">
        <Table responsive hover className="text-center align-middle mb-0 bg-white">

          <thead className="bg-pink text-white">
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th> {/* 🔥 NOVO */}
              <th>Telefone</th>
              <th>Bairro</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {adotantes.length > 0 ? adotantes.map(a => (
              <tr key={a.AdotanteID}>
                <td className="fw-bold">{a.NomeCompletoAdotante}</td>
                <td>{a.CPFAdotante}</td>
                <td>{a.email}</td> {/* 🔥 NOVO */}
                <td>{a.TelefoneAdotante}</td>
                <td>{a.BairroAdotante || 'Não informado'}</td>

                <td>
                  <Button
                    variant="link"
                    className="text-primary me-2"
                    onClick={() => prepararEdicao(a)}
                  >
                    <Edit size={18} />
                  </Button>

                  <Button
                    variant="link"
                    className="text-danger"
                    onClick={() => {
                      if (window.confirm('Excluir?'))
                        AdotanteService.excluir(a.AdotanteID).then(carregarDados)
                    }}
                  >
                    <Trash2 size={18} />
                  </Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-4 text-muted">
                  Nenhum adotante encontrado.
                </td>
              </tr>
            )}
          </tbody>

        </Table>
      </Card>
    </Container>
  );
}

export default GerenciarAdotantes;