import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home';
import Relatorios from "./components/Relatorios";
import RelatorioAdocoes from "./components/RelatorioAdocoes";
import RelatorioAnimais from "./components/RelatorioAnimais";
import RelatorioSaude from "./components/RelatorioSaude";
import GerenciadorAbrigoAnimais from './components/GerenciadorAbrigoAnimais';

import GerenciarAdotante from './components/GerenciarAdotante';
import GerenciarEstoque from './components/GerenciarEstoque';
import GerenciadorAdocoes from './components/GerenciadorAdocoes';
import Login from './components/Login';
import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from './components/ProtectedRoute';
import GerenciarProcedimentosVeterinarios from './components/GerenciarProcedimentosVeterinarios';
import GerenciarVeterinarios from './components/GerenciarVeterinarios';
import GerenciarFinanceiro from './components/GerenciarFinanceiro';
import TourGuia from './components/TourGuia';
import ConfirmacaoAdocao from './components/ConfirmacaoAdocao';
import RedefinirSenha from './components/RedefinirSenha';

function App() {
  return (
    <BrowserRouter>
      <TourGuia />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/confirmacao/:token" element={<ConfirmacaoAdocao />} />
        <Route path="/redefinir-senha/:token" element={<RedefinirSenha />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/animais"
          element={
            <PrivateRoute>
              <ProtectedRoute niveisPermitidos={["admin", "funcionario", "responsavel_tecnico"]}>
                <GerenciadorAbrigoAnimais />
              </ProtectedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/adocoes"
          element={
            <PrivateRoute>
              <ProtectedRoute niveisPermitidos={["admin", "funcionario"]}>
                <GerenciadorAdocoes />
              </ProtectedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/adotantes"
          element={
            <PrivateRoute>
              <ProtectedRoute niveisPermitidos={["admin", "funcionario"]}>
                <GerenciarAdotante />
              </ProtectedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/estoque"
          element={
            <PrivateRoute>
              <ProtectedRoute niveisPermitidos={["admin", "funcionario", "responsavel_tecnico"]}>
                <GerenciarEstoque />
              </ProtectedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/procedimentos-veterinarios"
          element={
            <PrivateRoute>
              <GerenciarProcedimentosVeterinarios />
            </PrivateRoute>
          }
        />

        <Route
          path="/veterinarios"
          element={
            <PrivateRoute>
              <ProtectedRoute niveisPermitidos={["admin", "responsavel_tecnico"]}>
                 <GerenciarVeterinarios />
              </ProtectedRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/financeiro"
          element={
            <PrivateRoute>
              <ProtectedRoute niveisPermitidos={["admin", "funcionario"]}>
                <GerenciarFinanceiro />
              </ProtectedRoute>
            </PrivateRoute>
          }
        />

        <Route
  path="/relatorio-animais"
  element={
    <PrivateRoute>
      <RelatorioAnimais />
    </PrivateRoute>
  }
/>

<Route
  path="/relatorio-saude"
  element={
    <PrivateRoute>
      <RelatorioSaude />
    </PrivateRoute>
  }
/>
<Route
  path="/relatorio-adocoes"
  element={
    <PrivateRoute>
      <RelatorioAdocoes />
    </PrivateRoute>
  }
/>
<Route
  path="/relatorios"
  element={
    <PrivateRoute>
      <Relatorios />
    </PrivateRoute>
  }
/>


      </Routes>
    </BrowserRouter>
  );
  
}

export default App;
