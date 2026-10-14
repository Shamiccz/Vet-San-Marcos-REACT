import { CLINICA, urlIndicaciones } from "../data/clinica.js";
import MapaClinica from "../components/MapaClinica.jsx";

function Contacto() {
  // Pide la ubicación actual para trazar la ruta; si se rechaza, abre el mapa sin origen.
  function comoLlegar() {
    const abrir = (origen) => window.open(urlIndicaciones(origen), "_blank", "noopener");
    if (!navigator.geolocation) return abrir(null);
    navigator.geolocation.getCurrentPosition(
      (p) => abrir({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => abrir(null),
    );
  }

  return (
    <main className="container py-4">
      <h1>Cómo llegar</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <address>
            <strong>{CLINICA.nombre}</strong>
            <br />
            {CLINICA.direccion}
            <br />
            {CLINICA.telefono}
            <br />
            {CLINICA.horario}
          </address>
          <button type="button" className="btn btn-primary" onClick={comoLlegar}>
            Cómo llegar desde mi ubicación
          </button>
        </div>
        <div className="col-12 col-lg-8">
          <MapaClinica />
        </div>
      </div>
    </main>
  );
}

export default Contacto;
