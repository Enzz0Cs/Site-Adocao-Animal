import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import PageHeader from './PageHeader';

const ConfirmacaoAdocao = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('carregando');

  useEffect(() => {
    const confirmar = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/adocoes/confirmar/${token}`);
        if (response.ok) {
          setStatus('sucesso');
        } else {
          setStatus('erro');
        }
      } catch {
        setStatus('erro');
      }
    };
    confirmar();
  }, [token]);

  return (
    <div className="container-fluid p-0 min-vh-100 bg-light">
      <PageHeader title="Confirmação de Adoção" backTo="/" />

      <div className="d-flex align-items-center justify-content-center px-3" style={{ minHeight: 'calc(100vh - 96px)' }}>
        <div className="card shadow-lg p-4" style={{ width: "450px", borderRadius: "15px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">🐾 Abrigo Teodoro</h2>
          {status === 'carregando' && <p className="text-muted">Confirmando adoção...</p>}
          {status === 'sucesso' && <p className="text-success fw-bold">Adoção confirmada!</p>}
          {status === 'erro' && <p className="text-danger fw-bold">Link inválido</p>}
        </div>

        {status === 'carregando' && (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {status === 'sucesso' && (
          <>
            <div className="text-center mb-3">
              <p className="text-muted">
                Sua adoção foi confirmada com sucesso! O animal será atualizado como adotado no sistema.
              </p>
            </div>
            <Link to="/" className="btn btn-primary w-100 fw-bold py-2">Voltar ao início</Link>
          </>
        )}

        {status === 'erro' && (
          <>
            <div className="text-center mb-3">
              <p className="text-muted">
                Este link de confirmação não é válido ou já foi utilizado.
              </p>
            </div>
            <Link to="/" className="btn btn-primary w-100 fw-bold py-2">Voltar ao início</Link>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmacaoAdocao;
