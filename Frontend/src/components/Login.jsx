import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [senha,setSenha] = useState("");
  const [erro,setErro] = useState("");

  const fazerLogin = async (e) => {

    e.preventDefault();

    try{

      const response = await axios.post(
        "http://localhost:3001/api/login",
        {email,senha}
      );

      localStorage.setItem("usuario", JSON.stringify(response.data));

      navigate("/home");

    }catch(err){

      setErro("Email ou senha inválidos");

    }

  };

  return(

    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">

      <div className="card shadow-lg p-4" style={{width:"400px"}}>

        <div className="text-center mb-4">
          <h3>🐾 Abrigo Teodoro Sampaio</h3>
          <p className="text-muted">Acesso ao sistema</p>
        </div>

        {erro && (
          <div className="alert alert-danger">
            {erro}
          </div>
        )}

        <form onSubmit={fazerLogin}>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Digite seu email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e)=>setSenha(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100">
            Entrar
          </button>

        </form>

      </div>

    </div>

  );

}

export default Login;