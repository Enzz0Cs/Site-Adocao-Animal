import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Table, Card, Alert } from 'react-bootstrap';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './EstilosAbrigo.css';

import AnimalService from '../services/AnimalService.js';
import ProcedimentoVeterinarioService from '../services/ProcedimentoVeterinarioService.js';
import VeterinarioService from '../services/VeterinarioService.js';

const GerenciarProcedimentosVeterinarios = () => {
  const [animais, setAnimais] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [veterinarios, setVeterinarios] = useState([]);

  const [formData, setFormData] = useState({
    ProcedimentoID: null,
    animal_id: '',
    tipo: '',
    data_procedimento: '',
    descricao: '',
    veterinario: '',
    situacao: 'Realizado',
    confirmarDuplicidade: false
  });

  const carregarAnimais = async () => {
    try {
      const dados = await AnimalService.listar();
      setAnimais(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
      setMensagem({ tipo: 'danger', texto: 'Erro ao carregar animais.' });
    }
  };

  const carregarProcedimentos = async () => {
    setIsLoading(true);
    try {
      const dados = await ProcedimentoVeterinarioService.listar();
      setProcedimentos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error('Erro ao carregar procedimentos:', error);
      setProcedimentos([]);
      setMensagem({ tipo: 'danger', texto: 'Erro ao carregar procedimentos veterinários.' });
    } finally {
      setIsLoading(false);
    }
  };

    const carregarVeterinarios = async () => {
    try {
      const dados = await VeterinarioService.listar();
      const ativos = Array.isArray(dados) ? dados.filter(v => v.StatusVeterinario === 'Ativo') : [];
      setVeterinarios(ativos);
    } catch (error) {
      console.error('Erro ao carregar veterinários:', error);
    }
  };

  useEffect(() => {
    carregarAnimais();
    carregarProcedimentos();
    carregarVeterinarios();
  }, []);

  const limparFormulario = () => {
    setFormData({
      ProcedimentoID: null,
      animal_id: '',
      tipo: '',
      data_procedimento: '',
      descricao: '',
      veterinario: '',
      situacao: 'Realizado',
      confirmarDuplicidade: false
    });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();

    try {
      await ProcedimentoVeterinarioService.salvar(formData);

      setMensagem({
        tipo: 'success',
        texto: formData.ProcedimentoID
          ? 'Procedimento veterinário atualizado com sucesso!'
          : 'Procedimento veterinário cadastrado com sucesso!'
      });

      limparFormulario();
      carregarProcedimentos();
    } catch (error) {
      console.error('Erro ao salvar procedimento:', error);

      if (error?.response?.status === 409 && error?.response?.data?.duplicidade) {
        const confirmar = window.confirm(
          'Já existe um procedimento semelhante para este animal na mesma data. Deseja gravar mesmo assim?'
        );

        if (confirmar) {
          try {
            await ProcedimentoVeterinarioService.salvar({
              ...formData,
              confirmarDuplicidade: true
            });

            setMensagem({
              tipo: 'warning',
              texto: 'Procedimento salvo com confirmação de duplicidade.'
            });

            limparFormulario();
            carregarProcedimentos();
            return;
          } catch (novoErro) {
            console.error('Erro ao confirmar duplicidade:', novoErro);
          }
        }

        return;
      }

      setMensagem({
        tipo: 'danger',
        texto: error?.response?.data?.error || 'Erro ao salvar procedimento veterinário.'
      });
    }
  };

  const handleEditar = (procedimento) => {
    setFormData({
      ProcedimentoID: procedimento.ProcedimentoID,
      animal_id: procedimento.animal_id,
      tipo: procedimento.tipo,
      data_procedimento: procedimento.data_procedimento?.split('T')[0] || procedimento.data_procedimento,
      descricao: procedimento.descricao,
      veterinario: procedimento.veterinario,
      situacao: procedimento.situacao,
      confirmarDuplicidade: false
    });
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Deseja excluir este procedimento veterinário?')) {
      try {
        await ProcedimentoVeterinarioService.excluir(id);
        setMensagem({ tipo: 'info', texto: 'Procedimento veterinário removido.' });
        carregarProcedimentos();
      } catch (error) {
        console.error('Erro ao excluir procedimento:', error);
        setMensagem({ tipo: 'danger', texto: 'Erro ao excluir procedimento veterinário.' });
      }
    }
  };

  return (
    <div className="container-fluid p-0 min-vh-100 bg-light">
      <header data-tour="page-header" className="navbar custom-navbar p-3 mb-4" style={{ backgroundColor: '#FF69B4' }}>
        <div className="container-fluid">
          <Link to="/home" className="btn btn-dark">
            <ArrowLeft size={20} />
          </Link>
          <span className="text-white fw-bold">
            Controle de Procedimentos Veterinários
          </span>
          <div style={{ width: 40 }}></div>
        </div>
      </header>

      <Container>

      {mensagem.texto && (
        <Alert
          variant={mensagem.tipo}
          dismissible
          onClose={() => setMensagem({ tipo: '', texto: '' })}
        >
          {mensagem.texto}
        </Alert>
      )}

      <Card data-tour="formulario" className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-3">
            {formData.ProcedimentoID ? 'Editar Procedimento Veterinário' : 'Novo Procedimento Veterinário'}
          </h5>

          <Form onSubmit={handleSalvar}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Animal *</Form.Label>
                  <Form.Select
                    value={formData.animal_id}
                    onChange={(e) => setFormData({ ...formData, animal_id: e.target.value })}
                    required
                  >
                    <option value="">Selecione um animal</option>
                    {animais.map((animal) => (
                      <option key={animal.id} value={animal.id}>
                        {animal.nome_animal}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tipo *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Consulta, exame, cirurgia, tratamento..."
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Data *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.data_procedimento}
                    onChange={(e) => setFormData({ ...formData, data_procedimento: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Veterinário *</Form.Label>
                  <Form.Select
                    value={formData.veterinario}
                    onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
                    required
                  >
                    <option value="">Selecione um veterinário</option>
                    {veterinarios.map((v) => (
                      <option key={v.VeterinarioID} value={v.NomeCompletoVeterinario}>
                        {v.NomeCompletoVeterinario} | {v.CRMVVeterinario}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Situação *</Form.Label>
                  <Form.Select
                    value={formData.situacao}
                    onChange={(e) => setFormData({ ...formData, situacao: e.target.value })}
                    required
                  >
                    <option value="Realizado">Realizado</option>
                    <option value="Previsto">Previsto</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Cancelado">Cancelado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Descrição *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button data-tour="salvar" type="submit" variant="success">
                Salvar
              </Button>

              {formData.ProcedimentoID && (
                <Button type="button" variant="secondary" onClick={limparFormulario}>
                  Cancelar
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card data-tour="listagem" className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Procedimentos cadastrados</h5>

          {isLoading ? (
            <p>Carregando...</p>
          ) : procedimentos.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Animal</th>
                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Veterinário</th>
                  <th>Situação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {procedimentos.map((p) => (
                  <tr key={p.ProcedimentoID}>
                    <td>#{p.ProcedimentoID}</td>
                    <td>{p.nome_animal || p.animal_id}</td>
                    <td>{p.tipo}</td>
                    <td>{new Date(p.data_procedimento).toLocaleDateString('pt-BR')}</td>
                    <td>{p.descricao}</td>
                    <td>{p.veterinario}</td>
                    <td>{p.situacao}</td>
                    <td data-tour="acoes" className="d-flex gap-2">
                      <Button variant="warning" size="sm" onClick={() => handleEditar(p)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleExcluir(p.ProcedimentoID)}>
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Nenhum procedimento veterinário cadastrado.</p>
          )}
        </Card.Body>
      </Card>
      </Container>
    </div>
  );
};

export default GerenciarProcedimentosVeterinarios;
