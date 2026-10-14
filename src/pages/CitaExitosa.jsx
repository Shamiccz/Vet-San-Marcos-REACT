import { Link, useParams } from "react-router-dom";
import BadgeEstado from "../components/BadgeEstado.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../data/db.js";
import { formatoFecha } from "../utils/formato.js";

function CitaExitosa() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const cita = db.obtener("citas", id);

  if (!cita || cita.duenoId !== usuario.id)
    return (
      <main className="container py-4">
        <h1>No encontramos esa solicitud</h1>
        <Link to="/mis-citas">Ir a mis citas</Link>
      </main>
    );

  return (
    <main className="container py-4">
      <div className="card card-body mx-auto" style={{ maxWidth: 560 }}>
        <h1 className="h3">Solicitud enviada, cita #{cita.id}</h1>
        <p>
          <BadgeEstado estado={cita.estado} /> La recepción la confirmará o te propondrá otro horario. Verás el cambio en Mis citas.
        </p>
        <dl className="row mb-0">
          <dt className="col-5">Mascota</dt>
          <dd className="col-7">{db.obtener("mascotas", cita.mascotaId)?.nombre}</dd>
          <dt className="col-5">Servicio</dt>
          <dd className="col-7">{db.obtener("servicios", cita.servicioId)?.nombre}</dd>
          <dt className="col-5">Fecha y hora</dt>
          <dd className="col-7">
            {formatoFecha(cita.fecha)} a las {cita.hora}
          </dd>
          <dt className="col-5">Motivo</dt>
          <dd className="col-7">{cita.motivo}</dd>
        </dl>
        <Link className="btn btn-primary mt-3" to="/mis-citas">
          Ver mis citas
        </Link>
      </div>
    </main>
  );
}

export default CitaExitosa;
