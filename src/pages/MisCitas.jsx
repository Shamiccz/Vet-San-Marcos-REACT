import { useState } from "react";
import { Link } from "react-router-dom";
import TablaCitas from "../components/TablaCitas.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../data/db.js";
import { cambiarEstadoCita, enriquecerCitas } from "../utils/citas.js";

function MisCitas() {
  const { usuario } = useAuth();
  const propias = () => enriquecerCitas(db, db.buscar("citas", (c) => c.duenoId === usuario.id));
  const [filas, setFilas] = useState(propias);

  function cambiar(id, estado) {
    cambiarEstadoCita(db, id, estado);
    setFilas(propias());
  }

  const acciones = (f) => (
    <>
      {f.estado === "reprogramada" && (
        <button type="button" className="btn btn-success btn-sm" onClick={() => cambiar(f.id, "confirmada")}>
          Aceptar nuevo horario
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Mis citas</h1>
        <Link className="btn btn-primary" to="/citas/nueva">
          Solicitar cita
        </Link>
      </div>
      <p className="text-muted">
        Una cita nueva queda pendiente hasta que la recepción la confirme o proponga otro horario.
      </p>
      <TablaCitas filas={filas} renderAcciones={acciones} />
    </main>
  );
}

export default MisCitas;
