import { useState } from "react";
import { Link } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario.jsx";
import FormularioMascota from "../../components/FormularioMascota.jsx";
import { db } from "../../data/db.js";
import { hoyISO } from "../../utils/formato.js";

// Registro y edición de fichas de pacientes (recepción, veterinarios y administración).
function Pacientes() {
  const hoy = hoyISO();
  const [mascotas, setMascotas] = useState(() => db.listar("mascotas"));
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null); // null | "nueva" | mascota
  const [duenoId, setDuenoId] = useState("");
  const [errorDueno, setErrorDueno] = useState("");
  const duenos = db.buscar("usuarios", (u) => u.rol === "dueno" && u.activo);
  const nombreDueno = (id) => db.obtener("usuarios", id)?.nombre ?? "Sin registro";

  function guardar(datos) {
    if (editando === "nueva") {
      if (!duenoId) return setErrorDueno("Elige al dueño de la mascota.");
      db.crear("mascotas", { ...datos, duenoId: Number(duenoId), creadoEn: hoy });
    } else db.actualizar("mascotas", editando.id, datos);
    setMascotas(db.listar("mascotas"));
    setEditando(null);
    setErrorDueno("");
  }

  const t = busqueda.trim().toLowerCase();
  const visibles = mascotas.filter((m) => !t || m.nombre.toLowerCase().includes(t) || nombreDueno(m.duenoId).toLowerCase().includes(t));

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Pacientes</h1>
        {!editando && (
          <button type="button" className="btn btn-primary" onClick={() => { setEditando("nueva"); setDuenoId(""); }}>
            Registrar paciente
          </button>
        )}
      </div>

      {editando && (
        <section className="card card-body mb-4">
          <h2 className="h5">{editando === "nueva" ? "Nuevo paciente" : `Editar ficha de ${editando.nombre}`}</h2>
          {editando === "nueva" && (
            <CampoFormulario
              id="p-dueno"
              tipo="select"
              etiqueta="Dueño"
              value={duenoId}
              onChange={(e) => setDuenoId(e.target.value)}
              error={errorDueno}
              opciones={[{ valor: "", texto: "Selecciona al dueño" }, ...duenos.map((d) => ({ valor: String(d.id), texto: d.nombre }))]}
            />
          )}
          <FormularioMascota inicial={editando === "nueva" ? null : editando} hoy={hoy} onGuardar={guardar} onCancelar={() => setEditando(null)} />
        </section>
      )}

      <CampoFormulario id="p-buscar" etiqueta="Buscar por mascota o dueño" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

      {visibles.length === 0 ? (
        <p role="status" className="alert alert-light border">No hay pacientes que coincidan con la búsqueda.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr><th>Paciente</th><th>Especie</th><th>Dueño</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {visibles.map((m) => (
                <tr key={m.id}>
                  <td>{m.nombre}</td>
                  <td>{m.especie}</td>
                  <td>{nombreDueno(m.duenoId)}</td>
                  <td className="d-flex gap-1">
                    <Link className="btn btn-outline-primary btn-sm" to={`/gestion/pacientes/${m.id}`}>Ver ficha</Link>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditando(m)}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Pacientes;
