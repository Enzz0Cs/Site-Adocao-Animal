import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

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
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Container className="d-flex justify-content-center">
        <Card className="p-5 text-center shadow" style={{ maxWidth: 500 }}>
          {status === 'carregando' && (
            <>
              <Spinner animation="border" variant="primary" className="mb-3" />
              <h4>Confirmando sua adoção...</h4>
            </>
          )}

          {status === 'sucesso' && (
            <>
              <CheckCircle size={64} className="text-success mb-3 mx-auto" />
              <h3 className="text-success">Adoção Confirmada!</h3>
              <p className="text-muted">
                Sua adoção foi confirmada com sucesso. O abrigo entrará em contato em breve para finalizar o processo.
              </p>
              <Link to="/" className="btn btn-primary mt-3">Voltar ao início</Link>
            </>
          )}

          {status === 'erro' && (
            <>
              <XCircle size={64} className="text-danger mb-3 mx-auto" />
              <h3 className="text-danger">Link inválido ou expirado</h3>
              <p className="text-muted">
                Este link de confirmação não é válido ou já foi utilizado.
              </p>
              <Link to="/" className="btn btn-primary mt-3">Voltar ao início</Link>
            </>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default ConfirmacaoAdocao;
