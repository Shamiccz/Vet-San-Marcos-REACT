import { useState } from "react";
import CampoFormulario from "./CampoFormulario.jsx";
import { HORAS_DISPONIBLES, validarCita } from "../utils/citas.js";
import { sinErrores } from "../utils/validaciones.js";

// Solicitud de cita (el "pedido" del caso). Valida en el cliente y entrega los datos con onEnviar.
function FormularioCita({ mascotas, servicios, hoy, servicioInicial = "", onEnviar }) {
  const [valores, setValores] = useState({ mascotaId: "", servicioId: servicioInicial, fecha: "", hora: "", motivo: "" });
  const [errores, setErrores] = useState({});

  const mascota = mascotas.find((m) => String(m.id) === valores.mascotaId);
  const serviciosDisponibles = mascota ? servicios.filter((s) => s.especies.includes(mascota.especie)) : servicios;

  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });

  function enviar(e) {
    e.preventDefault();
    const nuevos = validarCita(valores, hoy);
    setErrores(nuevos);
    if (sinErrores(nuevos)) onEnviar(valores);
  }

  return (
    <form onSubmit={enviar} noValidate>
      <CampoFormulario
        id="c-mascota"
        name="mascotaId"
        tipo="select"
        etiqueta="Mascota"
        value={valores.mascotaId}
        onChange={cambiar}
        error={errores.mascotaId}
        opciones={[{ valor: "", texto: "Selecciona una mascota" }, ...mascotas.map((m) => ({ valor: String(m.id), texto: `${m.nombre} (${m.especie})` }))]}
      />
      <CampoFormulario
        id="c-servicio"
        name="servicioId"
        tipo="select"
        etiqueta="Servicio"
        value={valores.servicioId}
        onChange={cambiar}
        error={errores.servicioId}
        opciones={[{ valor: "", texto: "Selecciona un servicio" }, ...serviciosDisponibles.map((s) => ({ valor: s.id, texto: s.nombre }))]}
      />
      <div className="row">
        <div className="col-12 col-sm-6">
          <CampoFormulario id="c-fecha" name="fecha" tipo="date" etiqueta="Fecha" min={hoy} value={valores.fecha} onChange={cambiar} error={errores.fecha} ayuda="Atendemos de lunes a viernes." />
        </div>
        <div className="col-12 col-sm-6">
          <CampoFormulario
            id="c-hora"
            name="hora"
            tipo="select"
            etiqueta="Horario"
            value={valores.hora}
            onChange={cambiar}
            error={errores.hora}
            opciones={[{ valor: "", texto: "Selecciona un horario" }, ...HORAS_DISPONIBLES.map((h) => ({ valor: h, texto: h }))]}
          />
        </div>
      </div>
      <CampoFormulario id="c-motivo" name="motivo" tipo="textarea" etiqueta="Motivo de la consulta" value={valores.motivo} onChange={cambiar} error={errores.motivo} />
      <button type="submit" className="btn btn-primary">
        Solicitar cita
      </button>
    </form>
  );
}

export default FormularioCita;
