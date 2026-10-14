import { Link, useLocation } from "react-router-dom";

function CitaError() {
  const { state } = useLocation();
  return (
    <main className="container py-4">
      <div className="card card-body border-danger mx-auto" style={{ maxWidth: 560 }}>
        <h1 className="h3 text-danger">No se pudo solicitar la cita</h1>
        <p role="alert">{state?.mensaje ?? "Ocurrió un problema al registrar la solicitud."}</p>
        <div className="d-flex gap-2">
          <Link className="btn btn-primary" to="/citas/nueva">
            Volver a solicitar
          </Link>
          <Link className="btn btn-outline-secondary" to="/mis-citas">
            Ir a mis citas
          </Link>
        </div>
      </div>
    </main>
  );
}

export default CitaError;
