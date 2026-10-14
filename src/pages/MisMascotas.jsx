import { useState } from "react";
import FormularioMascota from "../components/FormularioMascota.jsx";
import HistorialMascota from "../components/HistorialMascota.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../data/db.js";
import { hoyISO } from "../utils/formato.js";

// El dueño solo ve y administra sus propias mascotas (regla de privacidad del caso).
function MisMascotas() {
  const { usuario } = useAuth();
  const hoy = hoyISO();
  const propias = () => db.buscar("mascotas", (m) => m.duenoId === usuario.id);
  const [mascotas, setMascotas] = useState(propias);
  const [editando, setEditando] = useState(null); // null | "nueva" | mascota
  const servicios = db.listar("servicios");

  function guardar(datos) {
    if (editando === "nueva") db.crear("mascotas", { ...datos, duenoId: usuario.id, creadoEn: hoy });
    else db.actualizar("mascotas", editando.id, datos);
    setMascotas(propias());
    setEditando(null);
  }

  function eliminar(m) {
    if (!window.confirm(`¿Eliminar a ${m.nombre}? Se pierde su registro en tu cuenta.`)) return;
    db.eliminar("mascotas", m.id);
    setMascotas(propias());
  }

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Mis mascotas</h1>
        {!editando && (
          <button type="button" className="btn btn-primary" onClick={() => setEditando("nueva")}>
            Agregar mascota
          </button>
        )}
      </div>

      {editando && (
        <section className="card card-body mb-4">
          <h2 className="h5">{editando === "nueva" ? "Nueva mascota" : `Editar a ${editando.nombre}`}</h2>
          <FormularioMascota inicial={editando === "nueva" ? null : editando} hoy={hoy} onGuardar={guardar} onCancelar={() => setEditando(null)} />
        </section>
      )}

      {mascotas.length === 0 && !editando && (
        <p role="status" className="alert alert-light border">
          Aún no registras mascotas. Agrega la primera para solicitar citas y ver su historial.
        </p>
      )}

      {mascotas.map((m) => (
        <article key={m.id} className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between flex-wrap gap-2">
              <div>
                <h2 className="h5 mb-0">{m.nombre}</h2>
                <small className="text-muted">
                  {m.especie}
                  {m.raza ? `, ${m.raza}` : ""}, {m.pesoKg} kg
                </small>
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setEditando(m)}>
                  Editar
                </button>
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => eliminar(m)}>
                  Eliminar
                </button>
              </div>
            </div>
            <details className="mt-3">
              <summary>Ver historial clínico y vacunas</summary>
              <div className="mt-3">
                <HistorialMascota
                  fichas={db.buscar("fichas", (f) => f.mascotaId === m.id)}
                  vacunas={db.buscar("vacunas", (v) => v.mascotaId === m.id)}
                  servicios={servicios}
                  hoy={hoy}
                />
              </div>
            </details>
          </div>
        </article>
      ))}
    </main>
  );
}

export default MisMascotas;
