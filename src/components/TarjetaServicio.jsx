import { Link } from "react-router-dom";
import { formatoCLP, formatoDuracion } from "../utils/formato.js";

function TarjetaServicio({ servicio, onSolicitar }) {
  const obligatoria = /obligatoria/i.test(servicio.observaciones);
  return (
    <article className="card h-100 tarjeta-servicio">
      <div className="card-body d-flex flex-column">
        <p className="small text-muted mb-1">{servicio.categoria}</p>
        <h2 className="h5">{servicio.nombre}</h2>
        <p className="mb-1">{servicio.especies.join(", ")}</p>
        <p className="mb-2">
          {formatoDuracion(servicio.duracionMin)} · <strong>{formatoCLP(servicio.precio)}</strong>
        </p>
        {servicio.observaciones && <p className="small text-muted mb-2">{servicio.observaciones}</p>}
        {obligatoria && <span className="badge text-bg-warning text-dark align-self-start mb-2">Obligatoria por ley</span>}
        <div className="mt-auto d-flex gap-2 flex-wrap">
          <Link className="btn btn-outline-primary btn-sm" to={`/servicios/${servicio.id}`}>
            Ver detalle
          </Link>
          {onSolicitar && (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onSolicitar(servicio)}>
              Solicitar cita
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default TarjetaServicio;
