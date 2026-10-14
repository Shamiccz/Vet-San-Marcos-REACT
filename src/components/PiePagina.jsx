import { CLINICA } from "../data/clinica.js";

function PiePagina() {
  return (
    <footer className="pie-clinica py-4 mt-auto">
      <div className="container">
        <p className="mb-1">
          <strong>{CLINICA.nombre}</strong> · Rancagua
        </p>
        <address className="mb-1">
          {CLINICA.horario} · <a href={`mailto:${CLINICA.email}`}>{CLINICA.email}</a>
        </address>
      </div>
    </footer>
  );
}

export default PiePagina;
