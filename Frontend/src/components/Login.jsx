import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [nivelAcesso, setNivelAcesso] = useState("funcionario");
  const [modo, setModo] = useState("login");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const alternarModo = (novoModo) => {
    setModo(novoModo);
    setErro("");
    setSucesso("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const response = await axios.post("http://localhost:3001/api/login", { email, senha });
      localStorage.setItem("usuario", JSON.stringify(response.data));
      navigate("/home");
    } catch (err) {
      setErro(err.response?.data?.error || "Email ou senha inválidos");
    }
  };

  const handleRegistrar = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      await axios.post("http://localhost:3001/api/registrar", {
        nome,
        email,
        senha,
        nivel_acesso: nivelAcesso
      });
      setSucesso("Usuário cadastrado com sucesso! Faça o login.");
      setModo("login");
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao cadastrar usuário");
    }
  };

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      await axios.put("http://localhost:3001/api/resetar-senha", {
        email
      });
      setSucesso("Enviamos um link de redefinicao para seu e-mail.");
      setModo("login");
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao atualizar senha");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg p-4" style={{ width: "450px", borderRadius: "15px" }}>

        <div className="text-center mb-4">
          <h2 className="fw-bold">🐾 Abrigo Teodoro</h2>
          <p className="text-muted">
            {modo === "login" && "Bem-vindo de volta!"}
            {modo === "registrar" && "Crie sua conta de acesso"}
            {modo === "recuperar" && "Receba um link de redefinicao"}
          </p>
        </div>

        {erro && <div className="alert alert-danger py-2 small text-center">{erro}</div>}
        {sucesso && <div className="alert alert-success py-2 small text-center">{sucesso}</div>}

        {modo === "login" && (
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Email</label>
              <input type="email" className="form-control" placeholder="exemplo@abrigo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Senha</label>
              <input type="password" className="form-control" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            <button className="btn btn-primary w-100 fw-bold py-2">Entrar</button>
            <div className="text-center mt-3">
              <button type="button" className="btn btn-link btn-sm text-decoration-none" onClick={() => alternarModo("recuperar")}>Esqueceu a senha?</button>
              <hr />
              <button type="button" className="btn btn-outline-secondary w-100" onClick={() => alternarModo("registrar")}>Criar nova conta</button>
            </div>
          </form>
        )}

        {modo === "registrar" && (
          <form onSubmit={handleRegistrar}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Nome Completo</label>
              <input type="text" className="form-control" placeholder="Nome do usuário" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Email</label>
              <input type="email" className="form-control" placeholder="joao@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Senha</label>
              <input type="password" className="form-control" placeholder="Crie uma senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold">Nível de Acesso</label>
              <select className="form-select" value={nivelAcesso} onChange={(e) => setNivelAcesso(e.target.value)}>
                <option value="funcionario">Funcionário</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <button className="btn btn-success w-100 fw-bold py-2">Finalizar Cadastro</button>
            <button type="button" className="btn btn-link w-100 mt-2 text-decoration-none text-muted" onClick={() => alternarModo("login")}>Voltar para o Login</button>
          </form>
        )}

        {modo === "recuperar" && (
          <form onSubmit={handleRecuperar}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Email cadastrado</label>
              <input type="email" className="form-control" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button className="btn btn-warning w-100 text-white fw-bold py-2">Enviar link de redefinicao</button>
            <button type="button" className="btn btn-link w-100 mt-2 text-decoration-none text-muted" onClick={() => alternarModo("login")}>Cancelar</button>
          </form>
        )}

      </div>
    </div>
  );
}

export default Login;
