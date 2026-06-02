import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const RedefinirSenha = () => {
  const { token } = useParams();
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (senha.length < 4) {
      setErro('A senha deve ter pelo menos 4 caracteres');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas nao conferem');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, senha })
      });

      const data = await response.json();

      if (response.ok) {
        setSucesso(true);
      } else {
        setErro(data.error || 'Erro ao redefinir senha');
      }
    } catch {
      setErro('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-lg p-4" style={{ width: "450px", borderRadius: "15px" }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold">🐾 Abrigo Teodoro</h2>
            <p className="text-success fw-bold">Senha redefinida!</p>
          </div>
          <p className="text-muted text-center">Sua senha foi alterada com sucesso.</p>
          <Link to="/" className="btn btn-primary w-100 fw-bold py-2">Fazer login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg p-4" style={{ width: "450px", borderRadius: "15px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">🐾 Abrigo Teodoro</h2>
          <p className="text-muted">Redefina sua senha</p>
        </div>

        {erro && <div className="alert alert-danger py-2 small text-center">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Nova senha</label>
            <input type="password" className="form-control" placeholder="Digite a nova senha" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={4} />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Confirmar senha</label>
            <input type="password" className="form-control" placeholder="Confirme a nova senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required minLength={4} />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={loading}>
            {loading ? 'Redefinindo...' : 'Redefinir senha'}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/" className="btn btn-link text-decoration-none text-muted">Voltar ao login</Link>
        </div>
      </div>
    </div>
  );
};

export default RedefinirSenha;
