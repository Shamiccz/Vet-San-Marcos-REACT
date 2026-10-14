import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { ROLES, esPersonalClinica } from "../utils/roles.js";

export function enlacesPorRol(rol) {
  const comunes = [
    { a: "/servicios", texto: "Servicios" },
    { a: "/contacto", texto: "Cómo llegar" },
  ];
  if (rol === ROLES.DUENO)
    return [
      { a: "/mis-citas", texto: "Mis citas" },
      { a: "/mis-mascotas", texto: "Mis mascotas" },
      ...comunes,
    ];
  const personal = [
    { a: "/gestion/citas", texto: "Citas" },
    { a: "/gestion/pacientes", texto: "Pacientes" },
  ];
  if (rol === ROLES.ADMIN)
    return [
      { a: "/admin", texto: "Panel" },
      ...personal,
      { a: "/admin/usuarios", texto: "Usuarios" },
      { a: "/admin/medicamentos", texto: "Medicamentos" },
      { a: "/admin/reportes", texto: "Reportes" },
    ];
  return esPersonalClinica(rol) ? [...personal, ...comunes] : comunes;
}

// Menú que se colapsa en "hamburguesa" bajo 992 px (Bootstrap expand="lg").
function Navegacion({ usuario, onSalir }) {
  const [abierto, setAbierto] = useState(false);
  const enlaces = usuario ? enlacesPorRol(usuario.rol) : [];
  return (
    <Navbar expand="lg" expanded={abierto} onToggle={setAbierto} className="barra-clinica" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2">
          <img src="/logo.svg" alt="" width="36" height="36" />
          Veterinaria San Marcos
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto" onClick={() => setAbierto(false)}>
            {enlaces.map((e) => (
              <NavLink key={e.a} className="nav-link" to={e.a} end>
                {e.texto}
              </NavLink>
            ))}
          </Nav>
          <Nav className="align-items-lg-center" onClick={() => setAbierto(false)}>
            {usuario ? (
              <>
                <span className="navbar-text me-lg-3">{usuario.nombre}</span>
                <button type="button" className="btn btn-outline-light btn-sm" onClick={onSalir}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <NavLink className="nav-link" to="/login">
                  Ingresar
                </NavLink>
                <NavLink className="nav-link" to="/registro">
                  Crear cuenta
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navegacion;
