import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// COMPONENTES
import Home from './components/Home';
import GerenciadorAbrigoAnimais from './components/GerenciadorAbrigoAnimais';
import GerenciarVacinas from './components/GerenciarVacinas';
import GerenciarAdotante from './components/GerenciarAdotante';
import Login from './components/Login';

// PROTEÇÃO
import PrivateRoute from "./components/PrivateRoute";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* HOME */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* ANIMAIS */}
        <Route
          path="/animais"
          element={
            <PrivateRoute>
              <ProtectedRoute niveisPermitidos={["admin","funcionario"]}>
                <GerenciadorAbrigoAnimais />
              </ProtectedRoute>
            </PrivateRoute>
          }
        />

        {/* VACINAS */}
        <Route
          path="/vacinas"
          element={
            <PrivateRoute>
              <ProtectedRoute niveisPermitidos={["admin","responsavel_tecnico"]}>
                <GerenciarVacinas />
              </ProtectedRoute>
            </PrivateRoute>
          }
        />

        {/* ADOTANTES */}
        <Route
          path="/adotantes"
          element={
            <PrivateRoute>
              <ProtectedRoute niveisPermitidos={["admin","funcionario"]}>
                <GerenciarAdotante />
              </ProtectedRoute>
            </PrivateRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;