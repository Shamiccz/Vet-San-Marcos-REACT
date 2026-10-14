import { useState } from "react";
import CampoFormulario from "./CampoFormulario.jsx";
import { ESPECIES } from "./FiltroServicios.jsx";
import { sinErrores, validarMascota } from "../utils/validaciones.js";

const VACIO = { nombre: "", especie: "", raza: "", fechaNacimiento: "", pesoKg: "" };

function FormularioMascota({ inicial = null, hoy, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(inicial ? { ...VACIO, ...inicial, pesoKg: String(inicial.pesoKg) } : VACIO);
  const [errores, setErrores] = useState({});
  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });

  function guardar(e) {
    e.preventDefault();
    const nuevos = validarMascota(valores, hoy);
    setErrores(nuevos);
    if (sinErrores(nuevos)) onGuardar({ ...valores, nombre: valores.nombre.trim(), pesoKg: Number(valores.pesoKg) });
  }

  return (
    <form onSubmit={guardar} noValidate>
      <div className="row">
        <div className="col-12 col-md-6">
          <CampoFormulario id="m-nombre" name="nombre" etiqueta="Nombre" value={valores.nombre} onChange={cambiar} error={errores.nombre} />
        </div>
        <div className="col-12 col-md-6">
          <CampoFormulario
            id="m-especie"
            name="especie"
            tipo="select"
            etiqueta="Especie"
            value={valores.especie}
            onChange={cambiar}
            error={errores.especie}
            opciones={[{ valor: "", texto: "Selecciona una especie" }, ...ESPECIES.map((e) => ({ valor: e, texto: e }))]}
          />
        </div>
        <div className="col-12 col-md-4">
          <CampoFormulario id="m-raza" name="raza" etiqueta="Raza (opcional)" value={valores.raza} onChange={cambiar} />
        </div>
        <div className="col-6 col-md-4">
          <CampoFormulario id="m-nac" name="fechaNacimiento" tipo="date" max={hoy} etiqueta="Fecha de nacimiento" value={valores.fechaNacimiento} onChange={cambiar} error={errores.fechaNacimiento} />
        </div>
        <div className="col-6 col-md-4">
          <CampoFormulario id="m-peso" name="pesoKg" tipo="number" step="0.1" etiqueta="Peso (kg)" value={valores.pesoKg} onChange={cambiar} error={errores.pesoKg} />
        </div>
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          Guardar mascota
        </button>
        {onCancelar && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default FormularioMascota;
