import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Table, Modal, Card, InputGroup, Alert } from 'react-bootstrap';
import { Edit, Trash2, Search, User, Home, Check, Frown, ClipboardCheck } from 'lucide-react';

const AdotanteService = {
  listar: async (filtro) => {
    const url = filtro ? `http://localhost:3000/api/adotantes?busca=${filtro}` : `http://localhost:3000/api/adotantes`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do servidor');
    }
    return await response.json();
  },

  salvar: async (dados) => {
    const method = dados.AdotanteID ? 'PUT' : 'POST';
    const url = `http://localhost:3000/api/adotantes${dados.AdotanteID ? `/${dados.AdotanteID}` : ''}`;

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw { response: { status: response.status, data: errData } };
    }
    return await response.json();
  },

  excluir: async (id) => {
    const response = await fetch(`http://localhost:3000/api/adotantes/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const message = errData.error || `Erro do servidor: ${response.status}`;
      throw new Error(message);
    }
    return true;
  }
};

function GerenciarAdotantes() {
  const [adotantes, setAdotantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const [showModal, setShowModal] = useState(false);
  const [adotanteExcluir, setAdotanteExcluir] = useState(null);

  const [editando, setEditando] = useState(false);
  const [adotanteEditando, setAdotanteEditando] = useState(null);

  const [formData, setFormData] = useState({
    NomeCompletoAdotante: '',
    CPFAdotante: '',
    RGAdotante: '',
    TelefoneAdotante: '',
    RuaNumeroAdotante: '',
    BairroAdotante: '',
    CEPAdotante: '',
  });

  const resetForm = () => {
    setFormData({
      NomeCompletoAdotante: '', CPFAdotante: '', RGAdotante: '',
      TelefoneAdotante: '', RuaNumeroAdotante: '', BairroAdotante: '', CEPAdotante: '',
    });
    setEditando(false);
    setAdotanteEditando(null);
    setErros({});
  };

  const aplicarMascaraCPF = (valor) => {
    valor = valor.replace(/\D/g, '');
    if (valor.length <= 11) {
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return valor;
  };

  const aplicarMascaraRG = (valor) => {
    valor = valor.toUpperCase().replace(/[^0-9X]/g, '');
    if (valor.length > 12) valor = valor.slice(0, 12);
    if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
    if (valor.length > 6) valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    if (valor.length > 9) valor = valor.replace(/^(\d{2})\.(\d{3})\.(\d{3})([0-9X]{1})$/, '$1.$2.$3-$4');
    return valor;
  };

  const aplicarMascaraTelefone = (valor) => {
    valor = valor.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (valor.length > 5) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
    }
    return valor;
  };

  const aplicarMascaraCEP = (valor) => {
    valor = valor.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    return valor;
  };

  const processarMascara = (e, funcaoMascara) => {
    const valorAtual = e.target.value;
    let formatado = funcaoMascara(valorAtual);
    return formatado;
  };

  const handleCPFChange = (e) => {
    const formatado = processarMascara(e, aplicarMascaraCPF);
    setFormData({ ...formData, CPFAdotante: formatado });
  };

  const handleRGChange = (e) => {
    const formatado = processarMascara(e, aplicarMascaraRG);
    setFormData({ ...formData, RGAdotante: formatado });
  };

  const handleTelefoneChange = (e) => {
    const { name } = e.target;
    const formatado = processarMascara(e, aplicarMascaraTelefone);
    setFormData({ ...formData, [name]: formatado });
  };

  const handleCEPChange = (e) => {
    const formatado = processarMascara(e, aplicarMascaraCEP);
    setFormData({ ...formData, CEPAdotante: formatado });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const editarAdotante = (adotante) => {
    setFormData(adotante);
    setEditando(true);
    setAdotanteEditando(adotante);
    setErros({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validarFormulario = () => {
    const novosErros = {};
    if (!formData.NomeCompletoAdotante) novosErros.NomeCompletoAdotante = 'Nome obrigatório.';
    if (!formData.CPFAdotante || formData.CPFAdotante.replace(/\D/g, '').length < 11) novosErros.CPFAdotante = 'CPF incompleto ou inválido.';
    if (!formData.TelefoneAdotante || formData.TelefoneAdotante.replace(/\D/g, '').length < 10) novosErros.TelefoneAdotante = 'Telefone incompleto.';
    if (!formData.RuaNumeroAdotante) novosErros.RuaNumeroAdotante = 'Endereço obrigatório.';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      const dadosParaEnviar = {
        ...formData,
        AdotanteID: editando ? adotanteEditando.AdotanteID : undefined
      };

      await AdotanteService.salvar(dadosParaEnviar);
      await carregarAdotantes();

      resetForm();
      setMensagem({ tipo: 'success', texto: editando ? 'Adotante atualizado com sucesso!' : 'Novo adotante registrado!' });

    } catch (error) {
      console.error("Erro ao salvar:", error);

      let msgErro = 'Erro ao salvar o registro. Verifique a conexão.';

      if (error.response && error.response.data && error.response.data.error) {
        msgErro = error.response.data.error;
      }
      else if (error.message) {
        msgErro = error.message;
      }

      setMensagem({ tipo: 'danger', texto: msgErro });
    }
  };

  const carregarAdotantes = async () => {
    setLoading(true);
    try {
      const dados = await AdotanteService.listar(filtro);
      setAdotantes(dados);
      setMensagem({ tipo: '', texto: '' });
    } catch (error) {
      console.error("Erro ao carregar:", error);
      setMensagem({ tipo: 'danger', texto: 'Erro ao conectar ao servidor. Verifique se o backend está rodando na porta 3000 e o CORS está ativo.' });
      setAdotantes([]);
    } finally {
      setLoading(false);
    }
  };

  const excluirAdotante = async () => {
    try {
      await AdotanteService.excluir(adotanteExcluir.AdotanteID);
      await carregarAdotantes();
      setMensagem({ tipo: 'info', texto: 'Adotante excluído com sucesso.' });
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao excluir:", error);
      let msgErro = error.message.includes("Foreign key") || error.message.includes("Referential integrity")
        ? "Não foi possível excluir o adotante. Ele pode estar ligado a um registro de adoção ativo."
        : error.message;

      setMensagem({ tipo: 'danger', texto: msgErro });
      setShowModal(false);
    }
  };

  const confirmarExclusao = (adotante) => {
    setAdotanteExcluir(adotante);
    setShowModal(true);
  };

  useEffect(() => {
    carregarAdotantes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarAdotantes();
    }, 500);
    return () => clearTimeout(timer);
  }, [filtro]);


  return (
    <Container className="mt-5 pb-5">

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>⚠️ Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {adotanteExcluir && (
            <p className="text-center">
              Deseja excluir o registro de <strong>{adotanteExcluir.NomeCompletoAdotante}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={excluirAdotante}>Confirmar</Button>
        </Modal.Footer>
      </Modal>

      <h2 className="mb-4 text-primary fw-bold d-flex align-items-center gap-2">
        <User size={32} /> Gerenciar Adotantes
      </h2>

      {mensagem.texto && (
        <Alert variant={mensagem.tipo === 'info' ? 'success' : mensagem.tipo} onClose={() => setMensagem({ tipo: '', texto: '' })} dismissible>
          {mensagem.texto}
        </Alert>
      )}

      <Card className="shadow-sm border-0 mb-5">
        <Card.Header className="bg-primary text-white d-flex align-items-center">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            {editando ? <Edit size={20} /> : <Check size={20} />}
            {editando ? ' Editar Adotante' : ' Novo Adotante'}
          </h5>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit}>

            <h6 className="text-muted text-uppercase small fw-bold mb-3">👤 Dados Pessoais</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Completo *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><User size={18} /></InputGroup.Text>
                    <Form.Control type="text" name="NomeCompletoAdotante" value={formData.NomeCompletoAdotante} onChange={handleInputChange} isInvalid={!!erros.NomeCompletoAdotante} />
                    <Form.Control.Feedback type="invalid">{erros.NomeCompletoAdotante}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>CPF *</Form.Label>
                  <Form.Control type="text" value={formData.CPFAdotante} onChange={handleCPFChange} maxLength="14" isInvalid={!!erros.CPFAdotante} placeholder="000.000.000-00" />
                  <Form.Control.Feedback type="invalid">{erros.CPFAdotante}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>RG</Form.Label>
                  <Form.Control type="text" name="RGAdotante" value={formData.RGAdotante} onChange={handleRGChange} placeholder="XX.XXX.XXX-X" maxLength="13" />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="text-muted text-uppercase small fw-bold mt-3 mb-3">🏠 Contato e Endereço</h6>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefone *</Form.Label>
                  <Form.Control type="text" name="TelefoneAdotante" value={formData.TelefoneAdotante} onChange={handleTelefoneChange} placeholder="(XX) XXXXX-XXXX" maxLength="15" isInvalid={!!erros.TelefoneAdotante} />
                  <Form.Control.Feedback type="invalid">{erros.TelefoneAdotante}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Rua e Número *</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><Home size={18} /></InputGroup.Text>
                    <Form.Control type="text" name="RuaNumeroAdotante" value={formData.RuaNumeroAdotante} onChange={handleInputChange} placeholder="Rua, Número" isInvalid={!!erros.RuaNumeroAdotante} />
                    <Form.Control.Feedback type="invalid">{erros.RuaNumeroAdotante}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Bairro</Form.Label>
                  <Form.Control type="text" name="BairroAdotante" value={formData.BairroAdotante} onChange={handleInputChange} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>CEP</Form.Label>
                  <Form.Control type="text" name="CEPAdotante" value={formData.CEPAdotante} onChange={handleCEPChange} placeholder="00000-000" maxLength="9" />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4 gap-2">
              {editando && <Button variant="secondary" onClick={resetForm}>Cancelar</Button>}

              <Button variant="success" type="submit" size="lg" className="px-4 d-flex align-items-center gap-2">
                {editando ? <><Edit size={18} /> Salvar Alterações</> : <><Check size={18} /> Cadastrar Adotante</>}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <h4 className="mb-3 text-secondary d-flex align-items-center gap-2">
        <ClipboardCheck size={24} /> Lista de Adotantes Cadastrados
      </h4>
      <InputGroup className="mb-4 shadow-sm">
        <InputGroup.Text className="bg-white border-end-0"><Search size={18} className="text-muted" /></InputGroup.Text>
        <Form.Control type="text" placeholder="Pesquisar por nome, CPF ou endereço..." className="border-start-0 ps-0" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      </InputGroup>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3 ps-3">Nome Completo</th>
                <th>CPF</th>
                <th>RG</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-3 text-muted">Carregando adotantes...</td></tr>
              ) : adotantes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    {filtro ? (
                      <div className="d-flex flex-column align-items-center">
                        <Frown size={48} className="mb-2 opacity-50" />
                        <span>Não encontramos adotantes para: <strong>"{filtro}"</strong></span>
                      </div>
                    ) : (
                      "Nenhum adotante registrado ainda."
                    )}
                  </td>
                </tr>
              ) : (
                adotantes.map((item) => (
                  <tr key={item.AdotanteID}>
                    <td className="ps-3 fw-bold text-primary">{item.NomeCompletoAdotante}</td>
                    <td>{item.CPFAdotante}</td>
                    <td>{item.RGAdotante}</td>
                    <td>{item.TelefoneAdotante}</td>
                    <td>{item.RuaNumeroAdotante}</td>
                    <td className="text-center">
                      <Button variant="outline-warning" size="sm" className="me-2" onClick={() => editarAdotante(item)} title="Editar"><Edit size={16} /></Button>
                      <Button variant="outline-danger" size="sm" onClick={() => confirmarExclusao(item)} title="Excluir"><Trash2 size={16} /></Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default GerenciarAdotantes;