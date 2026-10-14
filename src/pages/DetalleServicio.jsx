import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../data/db.js";
import { formatoCLP, formatoDuracion } from "../utils/formato.js";
import { ROLES } from "../utils/roles.js";

function DetalleServicio() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const navegar = useNavigate();
  const servicio = db.obtener("servicios", id);

  if (!servicio)
    return (
      <main className="container py-4">
        <h1>Servicio no encontrado</h1>
        <p>El servicio que buscas no existe o fue retirado del catálogo.</p>
        <Link to="/servicios">Volver a servicios</Link>
      </main>
    );

  return (
    <main className="container py-4">
      <p className="text-muted mb-1">{servicio.categoria}</p>
      <h1>{servicio.nombre}</h1>
      <dl className="row">
        <dt className="col-sm-3">Especies</dt>
        <dd className="col-sm-9">{servicio.especies.join(", ")}</dd>
        <dt className="col-sm-3">Duración</dt>
        <dd className="col-sm-9">{formatoDuracion(servicio.duracionMin)}</dd>
        <dt className="col-sm-3">Precio</dt>
        <dd className="col-sm-9">{formatoCLP(servicio.precio)}</dd>
        {servicio.observaciones && (
          <>
            <dt className="col-sm-3">Observaciones</dt>
            <dd className="col-sm-9">{servicio.observaciones}</dd>
          </>
        )}
      </dl>
      <div className="d-flex gap-2">
        <Link className="btn btn-outline-secondary" to="/servicios">
          Volver
        </Link>
        {usuario?.rol === ROLES.DUENO && (
          <button type="button" className="btn btn-primary" onClick={() => navegar(`/citas/nueva?servicio=${servicio.id}`)}>
            Solicitar cita
          </button>
        )}
      </div>
    </main>
  );
}

export default DetalleServicio;
