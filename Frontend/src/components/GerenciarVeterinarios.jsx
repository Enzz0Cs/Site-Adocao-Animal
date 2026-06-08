import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table, Card, InputGroup, Alert } from 'react-bootstrap';
import { Edit, Trash2, Search } from 'lucide-react';
import './EstilosAbrigo.css';
import VeterinarioService from '../services/VeterinarioService';
import PageHeader from './PageHeader';

function GerenciarVeterinarios() {

  const [veterinarios, setVeterinarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [editando, setEditando] = useState(false);

  const initialFormState = {
    VeterinarioID: null,
    NomeCompletoVeterinario: '',
    CPFVeterinario: '',
    CRMVVeterinario: '',
    EspecialidadeVeterinario: '',
    TelefoneVeterinario: '',
    email: '',
    EnderecoVeterinario: '',
    StatusVeterinario: 'Ativo'
  };

  const [formData, setFormData] = useState(initialFormState);

  // máscaras
  const mascaraCPF = (v) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').slice(0, 14);
  const mascaraTelefone = (v) => v.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').slice(0, 15);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === 'CPFVeterinario') val = mascaraCPF(value);
    if (name === 'TelefoneVeterinario') val = mascaraTelefone(value);

    setFormData({ ...formData, [name]: val });
  };

  const carregarDados = async () => {
    try {
      const dados = await VeterinarioService.listar(filtro);
      setVeterinarios(Array.isArray(dados) ? dados : []);
    } catch {
      setMensagem({ tipo: 'danger', texto: 'Erro ao carregar veterinários.' });
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
      await VeterinarioService.salvar(formData);

      setMensagem({
        tipo: 'bg-pink',
        texto: editando ? 'Cadastro atualizado!' : 'Veterinário cadastrado!'
      });

      setFormData(initialFormState);
      setEditando(false);
      carregarDados();

    } catch (error) {
      const msg = error?.response?.data?.error || 'Erro ao salvar dados.';
      setMensagem({ tipo: 'danger', texto: msg });
    }
  };

  const prepararEdicao = (veterinario) => {
    setFormData(veterinario);
    setEditando(true);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container-fluid p-0 min-vh-100 bg-light">
      <PageHeader title="Gerenciar Veterinários" />

      <Container className="pb-5">

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
            {editando ? '📝 Editar Veterinário' : '🩺 Novo Cadastro'}
          </h5>
        </Card.Header>

        <Card.Body className="bg-white">

          <Form onSubmit={handleSubmit}>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Nome Completo *</Form.Label>
                  <Form.Control
                    name="NomeCompletoVeterinario"
                    value={formData.NomeCompletoVeterinario}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">CPF *</Form.Label>
                  <Form.Control
                    name="CPFVeterinario"
                    value={formData.CPFVeterinario}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">CRMV *</Form.Label>
                  <Form.Control
                    name="CRMVVeterinario"
                    value={formData.CRMVVeterinario}
                    onChange={handleInputChange}
                    placeholder="Ex: SP-12345"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Especialidade</Form.Label>
                  <Form.Control
                    name="EspecialidadeVeterinario"
                    value={formData.EspecialidadeVeterinario}
                    onChange={handleInputChange}
                    placeholder="Ex: Clínica Geral, Cirurgia..."
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Telefone *</Form.Label>
                  <Form.Control
                    name="TelefoneVeterinario"
                    value={formData.TelefoneVeterinario}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Status</Form.Label>
                  <Form.Select
                    name="StatusVeterinario"
                    value={formData.StatusVeterinario}
                    onChange={handleInputChange}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

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

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Endereço</Form.Label>
                  <Form.Control
                    name="EnderecoVeterinario"
                    value={formData.EnderecoVeterinario}
                    onChange={handleInputChange}
                    placeholder="Rua, número, bairro..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button data-tour="salvar" className="custom-btn flex-grow-1" type="submit">
                {editando ? 'Atualizar Veterinário' : 'Salvar Veterinário'}
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
          placeholder="Pesquisar por nome, CPF, CRMV ou email..."
          onChange={e => setFiltro(e.target.value)}
        />
      </InputGroup>

      <Card data-tour="listagem" className="custom-card shadow-sm border-0">
        <Table responsive hover className="text-center align-middle mb-0 bg-white">

          <thead className="bg-pink text-white">
            <tr>
              <th>Nome</th>
              <th>CRMV</th>
              <th>Especialidade</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {veterinarios.length > 0 ? veterinarios.map(v => (
              <tr key={v.VeterinarioID}>
                <td className="fw-bold">{v.NomeCompletoVeterinario}</td>
                <td>{v.CRMVVeterinario}</td>
                <td>{v.EspecialidadeVeterinario || 'Não informada'}</td>
                <td>{v.TelefoneVeterinario}</td>
                <td>{v.email}</td>
                <td data-tour="acoes">
                  <span className={`badge ${v.StatusVeterinario === 'Ativo' ? 'bg-success' : 'bg-secondary'}`}>
                    {v.StatusVeterinario}
                  </span>
                </td>
                <td>
                  <Button
                    variant="link"
                    className="text-primary me-2"
                    onClick={() => prepararEdicao(v)}
                  >
                    <Edit size={18} />
                  </Button>

                  <Button
                    variant="link"
                    className="text-danger"
                    onClick={() => {
                      if (window.confirm('Excluir este veterinário?'))
                        VeterinarioService.excluir(v.VeterinarioID).then(carregarDados)
                    }}
                  >
                    <Trash2 size={18} />
                  </Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="py-4 text-muted">
                  Nenhum veterinário encontrado.
                </td>
              </tr>
            )}
          </tbody>

        </Table>
      </Card>
      </Container>
    </div>
  );
}

export default GerenciarVeterinarios;
