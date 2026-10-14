import { useState } from "react";
import CampoFormulario from "../../components/CampoFormulario.jsx";
import TablaCitas from "../../components/TablaCitas.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { db } from "../../data/db.js";
import { HORAS_DISPONIBLES, cambiarEstadoCita, enriquecerCitas, reagendarCita } from "../../utils/citas.js";
import { hoyISO } from "../../utils/formato.js";
import { ROLES } from "../../utils/roles.js";

// La recepcionista confirma, reagenda o cancela; el veterinario marca la cita como atendida.
function GestionCitas() {
  const { usuario } = useAuth();
  const hoy = hoyISO();
  const todas = () => enriquecerCitas(db, db.listar("citas"));
  const [filas, setFilas] = useState(todas);
  const [estado, setEstado] = useState("");
  const [reagendando, setReagendando] = useState(null);
  const [nueva, setNueva] = useState({ fecha: "", hora: "" });
  const [error, setError] = useState("");
  const puedeAtender = usuario.rol === ROLES.VETERINARIO || usuario.rol === ROLES.ADMIN;

  function cambiar(id, nuevoEstado) {
    cambiarEstadoCita(db, id, nuevoEstado);
    setFilas(todas());
  }

  function proponer(e) {
    e.preventDefault();
    const r = reagendarCita(db, reagendando.id, nueva.fecha, nueva.hora, hoy);
    if (!r.ok) return setError(r.error);
    setError("");
    setReagendando(null);
    setFilas(todas());
  }

  const acciones = (f) => (
    <>
      {f.estado === "pendiente" && (
        <button type="button" className="btn btn-success btn-sm" onClick={() => cambiar(f.id, "confirmada")}>
          Confirmar
        </button>
      )}
      {["pendiente", "confirmada"].includes(f.estado) && (
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => { setReagendando(f); setNueva({ fecha: f.fecha, hora: f.hora }); setError(""); }}>
          Proponer otro horario
        </button>
      )}
      {f.estado === "confirmada" && puedeAtender && (
        <button type="button" className="btn btn-primary btn-sm" onClick={() => cambiar(f.id, "atendida")}>
          Marcar atendida
        </button>
      )}
      {["pendiente", "confirmada", "reprogramada"].includes(f.estado) && (
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => cambiar(f.id, "cancelada")}>
          Cancelar
        </button>
      )}
    </>
  );

  return (
    <main className="container py-4">
      <h1>Citas de la clínica</h1>
      <div className="row">
        <div className="col-12 col-md-4">
          <CampoFormulario
            id="g-estado"
            tipo="select"
            etiqueta="Filtrar por estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            opciones={[{ valor: "", texto: "Todos" }, ...["pendiente", "confirmada", "reprogramada", "atendida", "cancelada"].map((s) => ({ valor: s, texto: s }))]}
          />
        </div>
      </div>

      {reagendando && (
        <form className="card card-body mb-3" onSubmit={proponer} noValidate>
          <h2 className="h6">
            Proponer otro horario para {reagendando.mascota} (cita #{reagendando.id})
          </h2>
          {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
          <div className="row align-items-end">
            <div className="col-12 col-sm-4">
              <CampoFormulario id="g-fecha" tipo="date" etiqueta="Fecha" min={hoy} value={nueva.fecha} onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })} />
            </div>
            <div className="col-12 col-sm-4">
              <CampoFormulario
                id="g-hora"
                tipo="select"
                etiqueta="Horario"
                value={nueva.hora}
                onChange={(e) => setNueva({ ...nueva, hora: e.target.value })}
                opciones={HORAS_DISPONIBLES.map((h) => ({ valor: h, texto: h }))}
              />
            </div>
            <div className="col-12 col-sm-4 mb-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary">Enviar propuesta</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setReagendando(null)}>Cancelar</button>
            </div>
          </div>
        </form>
      )}

      <TablaCitas filas={estado ? filas.filter((f) => f.estado === estado) : filas} mostrarDueno renderAcciones={acciones} />
    </main>
  );
}

export default GestionCitas;
