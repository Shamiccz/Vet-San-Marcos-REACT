import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { rutaInicio } from "../utils/roles.js";

// Sin sesión válida -> /login. Con sesión pero sin el rol requerido -> su pantalla de inicio.
function RutaProtegida({ roles, children }) {
  const { usuario } = useAuth();
  const ubicacion = useLocation();
  if (!usuario) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to={rutaInicio(usuario.rol)} replace />;
  return children;
}

export default RutaProtegida;
