import { useState } from "react";
import CampoFormulario from "../../components/CampoFormulario.jsx";
import { db } from "../../data/db.js";
import { formatoCLP, hoyISO, sumarDias } from "../../utils/formato.js";
import { atencionesPorPeriodo, pacientesNuevosPorMes } from "../../utils/reportes.js";

function Reportes() {
  const [rango, setRango] = useState({ desde: sumarDias(hoyISO(), -30), hasta: hoyISO() });
  const resumen = atencionesPorPeriodo(db.listar("citas"), db.listar("servicios"), rango.desde, rango.hasta);
  const nuevos = pacientesNuevosPorMes(db.listar("mascotas"));

  return (
    <main className="container py-4">
      <h1>Reportes</h1>
      <section className="mb-5">
        <h2 className="h4">Atenciones por período</h2>
        <div className="row">
          <div className="col-6 col-md-3"><CampoFormulario id="r-desde" tipo="date" etiqueta="Desde" value={rango.desde} onChange={(e) => setRango({ ...rango, desde: e.target.value })} /></div>
          <div className="col-6 col-md-3"><CampoFormulario id="r-hasta" tipo="date" etiqueta="Hasta" value={rango.hasta} onChange={(e) => setRango({ ...rango, hasta: e.target.value })} /></div>
        </div>
        <p>
          <strong>{resumen.total}</strong> atenciones, {formatoCLP(resumen.ingresos)} en servicios.
        </p>
        {resumen.porCategoria.length === 0 ? (
          <p role="status" className="alert alert-light border">No hay atenciones en este período.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead><tr><th>Categoría</th><th>Atenciones</th><th>Ingresos</th></tr></thead>
              <tbody>
                {resumen.porCategoria.map((f) => (
                  <tr key={f.categoria}><td>{f.categoria}</td><td>{f.cantidad}</td><td>{formatoCLP(f.ingresos)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section>
        <h2 className="h4">Pacientes nuevos por mes</h2>
        <div className="table-responsive">
          <table className="table">
            <thead><tr><th>Mes</th><th>Pacientes nuevos</th></tr></thead>
            <tbody>
              {nuevos.map((f) => (<tr key={f.mes}><td>{f.mes}</td><td>{f.cantidad}</td></tr>))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Reportes;
