// Campo de formulario accesible (etiqueta + control + mensaje de error). Tipos: texto, select, textarea.
function CampoFormulario({ id, etiqueta, error, ayuda, tipo = "text", opciones = [], ...resto }) {
  const comunes = {
    id,
    "aria-invalid": error ? "true" : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    ...resto,
  };
  const invalido = error ? " is-invalid" : "";
  let control;
  if (tipo === "select") {
    control = (
      <select className={`form-select${invalido}`} {...comunes}>
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
    );
  } else if (tipo === "textarea") {
    control = <textarea className={`form-control${invalido}`} rows={3} {...comunes} />;
  } else {
    control = <input type={tipo} className={`form-control${invalido}`} {...comunes} />;
  }
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {etiqueta}
      </label>
      {control}
      {ayuda && <div className="form-text">{ayuda}</div>}
      {error && (
        <div className="invalid-feedback" id={`${id}-error`}>
          {error}
        </div>
      )}
    </div>
  );
}

export default CampoFormulario;
