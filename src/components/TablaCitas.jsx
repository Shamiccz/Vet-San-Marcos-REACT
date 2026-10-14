import BadgeEstado from "./BadgeEstado.jsx";
import { formatoFecha } from "../utils/formato.js";

// filas: [{ id, fecha, hora, mascota, dueno, servicio, motivo, estado }]
function TablaCitas({ filas, mostrarDueno = false, renderAcciones }) {
  if (filas.length === 0) return <p role="status" className="alert alert-light border">No hay citas para mostrar.</p>;
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Mascota</th>
            {mostrarDueno && <th>Dueño</th>}
            <th>Servicio</th>
            <th>Estado</th>
            {renderAcciones && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.id}>
              <td>{formatoFecha(f.fecha)}</td>
              <td>{f.hora}</td>
              <td>{f.mascota}</td>
              {mostrarDueno && <td>{f.dueno}</td>}
              <td>
                {f.servicio}
                <div className="small text-muted">{f.motivo}</div>
              </td>
              <td>
                <BadgeEstado estado={f.estado} />
              </td>
              {renderAcciones && <td className="d-flex flex-wrap gap-1">{renderAcciones(f)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaCitas;
