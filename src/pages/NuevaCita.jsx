import { Link, useNavigate, useSearchParams } from "react-router-dom";
import FormularioCita from "../components/FormularioCita.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../data/db.js";
import { solicitarCita } from "../utils/citas.js";
import { hoyISO } from "../utils/formato.js";

function NuevaCita() {
  const { usuario } = useAuth();
  const navegar = useNavigate();
  const [params] = useSearchParams();
  const mascotas = db.buscar("mascotas", (m) => m.duenoId === usuario.id);

  function enviar(datos) {
    const r = solicitarCita(db, datos, usuario.id);
    if (r.ok) navegar(`/citas/exito/${r.cita.id}`);
    else navegar("/citas/error", { state: { mensaje: r.error ?? "Revisa los datos de la solicitud." } });
  }

  return (
    <main className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7">
          <h1>Solicitar cita</h1>
          {mascotas.length === 0 ? (
            <p role="status" className="alert alert-warning">
              Primero registra a tu mascota en <Link to="/mis-mascotas">Mis mascotas</Link>.
            </p>
          ) : (
            <FormularioCita mascotas={mascotas} servicios={db.listar("servicios")} hoy={hoyISO()} servicioInicial={params.get("servicio") ?? ""} onEnviar={enviar} />
          )}
        </div>
      </div>
    </main>
  );
}

export default NuevaCita;
