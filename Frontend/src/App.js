import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home';
import GerenciadorAbrigoAnimais from './components/GerenciadorAbrigoAnimais';
import GerenciarVacinas from './components/GerenciarVacinas';
import GerenciarAdotante from './components/GerenciarAdotante';
import GerenciarEstoque from './components/GerenciarEstoque';
import GerenciadorAdocoes from './components/GerenciadorAdocoes';
import Login from './components/Login';
import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from './components/ProtectedRoute';
import GerenciarProcedimentosVeterinarios from './components/GerenciarProcedimentosVeterinarios';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

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
              <ProtectedRoute niveisPermitidos={["admin", "funcionario"]}>
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
          path="/vacinas"
          element={
            <PrivateRoute>
              <ProtectedRoute niveisPermitidos={["admin", "responsavel_tecnico"]}>
                <GerenciarVacinas />
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
              <ProtectedRoute niveisPermitidos={["admin", "funcionario"]}>
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;