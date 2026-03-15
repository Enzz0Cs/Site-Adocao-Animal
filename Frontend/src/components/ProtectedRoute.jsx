import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, niveisPermitidos }) {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        return <Navigate to="/" />;
    }

    if (!niveisPermitidos.includes(usuario.nivel)) {
        return <Navigate to="/home" />;
    }

    return children;
}

export default ProtectedRoute;