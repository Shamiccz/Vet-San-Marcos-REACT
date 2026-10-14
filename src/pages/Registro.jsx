import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { rutaInicio } from "../utils/roles.js";

function Registro() {
  const { usuario, registrar } = useAuth();
  const [valores, setValores] = useState({ nombre: "", email: "", telefono: "", clave: "", confirmacion: "" });
  const [errores, setErrores] = useState({});

  if (usuario) return <Navigate to={rutaInicio(usuario.rol)} replace />;

  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    const r = await registrar(valores);
    if (!r.ok) setErrores(r.errores);
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <img src="/logo.svg" alt="Logo de Veterinaria San Marcos" width="72" height="72" className="mb-3" />
          <h1 className="h3 mb-3">Crea tu cuenta</h1>
          <form onSubmit={enviar} noValidate>
            <CampoFormulario id="r-nombre" name="nombre" etiqueta="Nombre completo" value={valores.nombre} onChange={cambiar} error={errores.nombre} />
            <CampoFormulario id="r-email" name="email" tipo="email" etiqueta="Correo" value={valores.email} onChange={cambiar} error={errores.email} />
            <CampoFormulario id="r-tel" name="telefono" tipo="tel" etiqueta="Teléfono (opcional)" value={valores.telefono} onChange={cambiar} error={errores.telefono} />
            <CampoFormulario id="r-clave" name="clave" tipo="password" etiqueta="Clave" ayuda="Mínimo 8 caracteres, con letras y números." value={valores.clave} onChange={cambiar} error={errores.clave} autoComplete="new-password" />
            <CampoFormulario id="r-conf" name="confirmacion" tipo="password" etiqueta="Repite la clave" value={valores.confirmacion} onChange={cambiar} error={errores.confirmacion} autoComplete="new-password" />
            <button type="submit" className="btn btn-primary w-100">
              Crear cuenta
            </button>
          </form>
          <p className="mt-3">
            ¿Ya tienes cuenta? <Link to="/login">Ingresa aquí</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Registro;
