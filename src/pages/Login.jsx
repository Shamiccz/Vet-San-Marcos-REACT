import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { rutaInicio } from "../utils/roles.js";
import { validarEmail, validarRequerido } from "../utils/validaciones.js";

const CUENTAS_DEMO = [
  ["Administrador", "admin@sanmarcos.cl", "Admin123"],
  ["Recepcionista", "recepcion@sanmarcos.cl", "Recep123"],
  ["Veterinario", "vet@sanmarcos.cl", "Vet12345"],
  ["Dueño", "camila@correo.cl", "Dueno123"],
];

function Login() {
  const { usuario, iniciarSesion } = useAuth();
  const ubicacion = useLocation();
  const [valores, setValores] = useState({ email: "", clave: "" });
  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to={ubicacion.state?.desde ?? rutaInicio(usuario.rol)} replace />;

  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    const nuevos = { email: validarEmail(valores.email), clave: validarRequerido(valores.clave, "Clave") };
    setErrores(nuevos);
    if (nuevos.email || nuevos.clave) return;
    setEnviando(true);
    const r = await iniciarSesion(valores.email, valores.clave);
    setEnviando(false);
    if (!r.ok) setErrorGlobal(r.error);
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center g-4">
        <div className="col-12 col-md-7 col-lg-5">
          <img src="/logo.svg" alt="Logo de Veterinaria San Marcos" width="72" height="72" className="mb-3" />
          <h1 className="h3 mb-3">Ingresa a tu cuenta</h1>
          {errorGlobal && (
            <div className="alert alert-danger" role="alert">
              {errorGlobal}
            </div>
          )}
          <form onSubmit={enviar} noValidate>
            <CampoFormulario id="l-email" name="email" tipo="email" etiqueta="Correo" value={valores.email} onChange={cambiar} error={errores.email} autoComplete="username" />
            <CampoFormulario id="l-clave" name="clave" tipo="password" etiqueta="Clave" value={valores.clave} onChange={cambiar} error={errores.clave} autoComplete="current-password" />
            <button type="submit" className="btn btn-primary w-100" disabled={enviando}>
              {enviando ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
          <p className="mt-3">
            ¿Primera vez? <Link to="/registro">Crea tu cuenta de dueño</Link>
          </p>
        </div>
        <aside className="col-12 col-md-5 col-lg-4">
          <div className="card bg-light border-0">
            <div className="card-body">
              <h2 className="h6">Cuentas de demostración</h2>
              <ul className="list-unstyled small mb-0">
                {CUENTAS_DEMO.map(([rol, email, clave]) => (
                  <li key={email} className="mb-2">
                    <strong>{rol}</strong>
                    <br />
                    {email} / {clave}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Login;
