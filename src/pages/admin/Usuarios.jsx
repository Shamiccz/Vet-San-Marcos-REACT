import { useState } from "react";
import CampoFormulario from "../../components/CampoFormulario.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { db } from "../../data/db.js";
import { hoyISO } from "../../utils/formato.js";
import { ETIQUETA_ROL } from "../../utils/roles.js";
import { hashClave } from "../../utils/seguridad.js";
import { sinErrores, validarClave, validarEmail, validarRequerido, validarTelefono } from "../../utils/validaciones.js";

const VACIO = { nombre: "", email: "", telefono: "", rol: "recepcionista", clave: "", activo: true };

// Administración de usuarios: crear, editar, desactivar y asignar roles.
function Usuarios() {
  const { usuario: yo } = useAuth();
  const [usuarios, setUsuarios] = useState(() => db.listar("usuarios"));
  const [editando, setEditando] = useState(null); // null | "nuevo" | usuario
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});

  const refrescar = () => setUsuarios(db.listar("usuarios"));
  const abrir = (u) => { setEditando(u); setValores(u === "nuevo" ? VACIO : { ...VACIO, ...u, clave: "" }); setErrores({}); };
  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  async function guardar(e) {
    e.preventDefault();
    const nuevo = editando === "nuevo";
    const repetido = db.buscar("usuarios", (u) => u.email.toLowerCase() === valores.email.trim().toLowerCase() && u.id !== editando?.id).length > 0;
    const errs = {
      nombre: validarRequerido(valores.nombre, "Nombre"),
      email: validarEmail(valores.email) || (repetido ? "Ya existe un usuario con ese correo." : ""),
      telefono: validarTelefono(valores.telefono),
      clave: nuevo || valores.clave ? validarClave(valores.clave) : "",
    };
    setErrores(errs);
    if (!sinErrores(errs)) return;
    const datos = { nombre: valores.nombre.trim(), email: valores.email.trim(), telefono: valores.telefono.trim(), rol: valores.rol, activo: valores.activo };
    if (valores.clave) datos.claveHash = await hashClave(valores.clave);
    if (nuevo) db.crear("usuarios", { ...datos, creadoEn: hoyISO() });
    else db.actualizar("usuarios", editando.id, datos);
    refrescar();
    setEditando(null);
  }

  function alternar(u) {
    db.actualizar("usuarios", u.id, { activo: !u.activo });
    refrescar();
  }

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Usuarios</h1>
        {!editando && <button type="button" className="btn btn-primary" onClick={() => abrir("nuevo")}>Nuevo usuario</button>}
      </div>

      {editando && (
        <form className="card card-body mb-4" onSubmit={guardar} noValidate>
          <h2 className="h5">{editando === "nuevo" ? "Nuevo usuario" : `Editar a ${editando.nombre}`}</h2>
          <div className="row">
            <div className="col-12 col-md-6"><CampoFormulario id="u-nombre" name="nombre" etiqueta="Nombre" value={valores.nombre} onChange={cambiar} error={errores.nombre} /></div>
            <div className="col-12 col-md-6"><CampoFormulario id="u-email" name="email" tipo="email" etiqueta="Correo" value={valores.email} onChange={cambiar} error={errores.email} /></div>
            <div className="col-12 col-md-4"><CampoFormulario id="u-tel" name="telefono" etiqueta="Teléfono (opcional)" value={valores.telefono} onChange={cambiar} error={errores.telefono} /></div>
            <div className="col-12 col-md-4">
              <CampoFormulario id="u-rol" name="rol" tipo="select" etiqueta="Rol" value={valores.rol} onChange={cambiar} opciones={Object.entries(ETIQUETA_ROL).map(([valor, texto]) => ({ valor, texto }))} />
            </div>
            <div className="col-12 col-md-4">
              <CampoFormulario id="u-clave" name="clave" tipo="password" etiqueta={editando === "nuevo" ? "Clave" : "Nueva clave (opcional)"} value={valores.clave} onChange={cambiar} error={errores.clave} autoComplete="new-password" />
            </div>
          </div>
          <div className="form-check mb-3">
            <input id="u-activo" name="activo" type="checkbox" className="form-check-input" checked={valores.activo} onChange={cambiar} disabled={editando !== "nuevo" && editando.id === yo.id} />
            <label htmlFor="u-activo" className="form-check-label">Cuenta activa</label>
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">Guardar usuario</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setEditando(null)}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="table-responsive">
        <table className="table align-middle">
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{ETIQUETA_ROL[u.rol] ?? u.rol}</td>
                <td>{u.activo ? <span className="badge text-bg-success">Activo</span> : <span className="badge text-bg-secondary">Desactivado</span>}</td>
                <td className="d-flex gap-1">
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => abrir(u)}>Editar</button>
                  <button type="button" className="btn btn-outline-secondary btn-sm" disabled={u.id === yo.id} onClick={() => alternar(u)}>
                    {u.activo ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Usuarios;
