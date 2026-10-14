import { Navigate, Route, Routes } from "react-router-dom";
import Navegacion from "./components/Navegacion.jsx";
import PiePagina from "./components/PiePagina.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { PERSONAL_CLINICA, ROLES, rutaInicio } from "./utils/roles.js";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Servicios from "./pages/Servicios.jsx";
import DetalleServicio from "./pages/DetalleServicio.jsx";
import Contacto from "./pages/Contacto.jsx";
import MisMascotas from "./pages/MisMascotas.jsx";
import MisCitas from "./pages/MisCitas.jsx";
import NuevaCita from "./pages/NuevaCita.jsx";
import CitaExitosa from "./pages/CitaExitosa.jsx";
import CitaError from "./pages/CitaError.jsx";
import GestionCitas from "./pages/gestion/GestionCitas.jsx";
import Pacientes from "./pages/gestion/Pacientes.jsx";
import FichaPaciente from "./pages/gestion/FichaPaciente.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Usuarios from "./pages/admin/Usuarios.jsx";
import Medicamentos from "./pages/admin/Medicamentos.jsx";
import Reportes from "./pages/admin/Reportes.jsx";
import NoEncontrada from "./pages/NoEncontrada.jsx";

const protegida = (pagina, roles) => <RutaProtegida roles={roles}>{pagina}</RutaProtegida>;

function App() {
  const { usuario, cerrarSesion } = useAuth();
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navegacion usuario={usuario} onSalir={cerrarSesion} />
      <div className="flex-grow-1">
        <Routes>
          {/* Únicas rutas públicas: inicio de sesión y registro (regla de seguridad del caso). */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/" element={<Navigate to={usuario ? rutaInicio(usuario.rol) : "/login"} replace />} />

          {/* Cualquier usuario autenticado */}
          <Route path="/servicios" element={protegida(<Servicios />)} />
          <Route path="/servicios/:id" element={protegida(<DetalleServicio />)} />
          <Route path="/contacto" element={protegida(<Contacto />)} />

          {/* Dueño de mascota */}
          <Route path="/mis-mascotas" element={protegida(<MisMascotas />, [ROLES.DUENO])} />
          <Route path="/mis-citas" element={protegida(<MisCitas />, [ROLES.DUENO])} />
          <Route path="/citas/nueva" element={protegida(<NuevaCita />, [ROLES.DUENO])} />
          <Route path="/citas/exito/:id" element={protegida(<CitaExitosa />, [ROLES.DUENO])} />
          <Route path="/citas/error" element={protegida(<CitaError />, [ROLES.DUENO])} />

          {/* Personal de la clínica */}
          <Route path="/gestion/citas" element={protegida(<GestionCitas />, PERSONAL_CLINICA)} />
          <Route path="/gestion/pacientes" element={protegida(<Pacientes />, PERSONAL_CLINICA)} />
          <Route path="/gestion/pacientes/:id" element={protegida(<FichaPaciente />, PERSONAL_CLINICA)} />

          {/* Solo administrador */}
          <Route path="/admin" element={protegida(<Dashboard />, [ROLES.ADMIN])} />
          <Route path="/admin/usuarios" element={protegida(<Usuarios />, [ROLES.ADMIN])} />
          <Route path="/admin/medicamentos" element={protegida(<Medicamentos />, [ROLES.ADMIN])} />
          <Route path="/admin/reportes" element={protegida(<Reportes />, [ROLES.ADMIN])} />

          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </div>
      <PiePagina />
    </div>
  );
}

export default App;
