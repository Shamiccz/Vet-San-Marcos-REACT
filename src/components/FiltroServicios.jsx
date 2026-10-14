import CampoFormulario from "./CampoFormulario.jsx";

export const ESPECIES = ["Perro", "Gato", "Conejo", "Ave"];

// Componente controlado: el estado de los filtros vive en la página que lo usa.
function FiltroServicios({ filtros, categorias, onCambio }) {
  const cambiar = (e) => onCambio({ ...filtros, [e.target.name]: e.target.value });
  return (
    <form className="row g-3 mb-4" role="search" onSubmit={(e) => e.preventDefault()}>
      <div className="col-12 col-md-6">
        <CampoFormulario id="f-texto" name="texto" etiqueta="Buscar servicio" value={filtros.texto} onChange={cambiar} placeholder="Ej: vacuna, esterilización" />
      </div>
      <div className="col-6 col-md-3">
        <CampoFormulario
          id="f-categoria"
          name="categoria"
          tipo="select"
          etiqueta="Categoría"
          value={filtros.categoria}
          onChange={cambiar}
          opciones={[{ valor: "", texto: "Todas" }, ...categorias.map((c) => ({ valor: c, texto: c }))]}
        />
      </div>
      <div className="col-6 col-md-3">
        <CampoFormulario
          id="f-especie"
          name="especie"
          tipo="select"
          etiqueta="Especie"
          value={filtros.especie}
          onChange={cambiar}
          opciones={[{ valor: "", texto: "Todas" }, ...ESPECIES.map((e) => ({ valor: e, texto: e }))]}
        />
      </div>
    </form>
  );
}

export default FiltroServicios;
