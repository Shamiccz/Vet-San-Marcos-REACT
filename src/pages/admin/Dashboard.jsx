import { Link } from "react-router-dom";
import { db } from "../../data/db.js";
import { medicamentosCriticos } from "../../utils/inventario.js";

function Tarjeta({ titulo, valor, a, texto, alerta }) {
  return (
    <div className="col-6 col-lg-3">
      <div className={`card h-100 ${alerta ? "border-warning" : ""}`}>
        <div className="card-body">
          <p className="text-muted mb-1">{titulo}</p>
          <p className="display-6 mb-2">{valor}</p>
          <Link to={a}>{texto}</Link>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const citas = db.listar("citas");
  const criticos = medicamentosCriticos(db.listar("medicamentos")).length;
  return (
    <main className="container py-4">
      <h1>Panel de administración</h1>
      <div className="row g-3">
        <Tarjeta titulo="Citas pendientes" valor={citas.filter((c) => c.estado === "pendiente").length} a="/gestion/citas" texto="Gestionar citas" />
        <Tarjeta titulo="Pacientes" valor={db.listar("mascotas").length} a="/gestion/pacientes" texto="Ver pacientes" />
        <Tarjeta titulo="Usuarios activos" valor={db.buscar("usuarios", (u) => u.activo).length} a="/admin/usuarios" texto="Administrar usuarios" />
        <Tarjeta titulo="Stock crítico" valor={criticos} a="/admin/medicamentos" texto="Revisar medicamentos" alerta={criticos > 0} />
      </div>
      <p className="mt-4">
        <Link to="/admin/reportes">Ver reportes de atenciones y pacientes nuevos</Link>
      </p>
    </main>
  );
}

export default Dashboard;
