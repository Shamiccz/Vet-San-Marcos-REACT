import { formatoFecha, hoyISO } from "../utils/formato.js";
import { vacunaPorVencer } from "../utils/citas.js";

// Historial clínico y de vacunación. Los dueños solo lo ven para sus propias mascotas.
function HistorialMascota({ fichas, vacunas, servicios, hoy = hoyISO() }) {
  const nombre = (id) => servicios.find((s) => s.id === id)?.nombre ?? id;
  return (
    <div className="row g-3">
      <section className="col-12 col-lg-6">
        <h3 className="h6">Vacunas</h3>
        {vacunas.length === 0 ? (
          <p className="text-muted small">Aún no hay vacunas registradas.</p>
        ) : (
          <ul className="list-group">
            {vacunas.map((v) => (
              <li key={v.id} className="list-group-item">
                <div>{nombre(v.servicioId)}</div>
                <small className="text-muted">
                  Aplicada el {formatoFecha(v.fecha)}. Próximo refuerzo: {formatoFecha(v.proximoRefuerzo)}
                </small>
                {vacunaPorVencer(v.proximoRefuerzo, hoy) && (
                  <span className="badge text-bg-warning text-dark ms-2">
                    {v.proximoRefuerzo < hoy ? "Refuerzo vencido" : "Refuerzo por vencer"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="col-12 col-lg-6">
        <h3 className="h6">Consultas</h3>
        {fichas.length === 0 ? (
          <p className="text-muted small">Aún no hay consultas registradas.</p>
        ) : (
          <ul className="list-group">
            {fichas.map((f) => (
              <li key={f.id} className="list-group-item">
                <div>
                  {formatoFecha(f.fecha)}: {nombre(f.servicioId)}
                </div>
                <small className="d-block">Diagnóstico: {f.diagnostico}</small>
                <small className="d-block">Tratamiento: {f.tratamiento}</small>
                {f.proximoControl && <small className="text-muted">Próximo control: {formatoFecha(f.proximoControl)}</small>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default HistorialMascota;
