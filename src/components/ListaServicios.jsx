import TarjetaServicio from "./TarjetaServicio.jsx";

function ListaServicios({ servicios, onSolicitar }) {
  if (servicios.length === 0)
    return (
      <p role="status" className="alert alert-light border">
        No hay servicios que coincidan con tu búsqueda. Prueba con otra categoría o especie.
      </p>
    );
  return (
    <div className="row g-4">
      {servicios.map((s) => (
        <div className="col-12 col-md-6 col-xl-4" key={s.id}>
          <TarjetaServicio servicio={s} onSolicitar={onSolicitar} />
        </div>
      ))}
    </div>
  );
}

export default ListaServicios;
