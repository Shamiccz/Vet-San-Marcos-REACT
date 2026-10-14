import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario.jsx";
import HistorialMascota from "../../components/HistorialMascota.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { db } from "../../data/db.js";
import { calcularProximoRefuerzo } from "../../utils/citas.js";
import { hoyISO } from "../../utils/formato.js";
import { ROLES } from "../../utils/roles.js";
import { validarRequerido } from "../../utils/validaciones.js";

function FichaPaciente() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const hoy = hoyISO();
  const mascota = db.obtener("mascotas", id);
  const [version, setVersion] = useState(0); // fuerza releer los datos tras guardar
  const [consulta, setConsulta] = useState({ servicioId: "", diagnostico: "", tratamiento: "", proximoControl: "" });
  const [vacuna, setVacuna] = useState({ servicioId: "", fecha: hoy });
  const [errC, setErrC] = useState({});
  const [errV, setErrV] = useState("");
  const puedeRegistrar = usuario.rol === ROLES.VETERINARIO || usuario.rol === ROLES.ADMIN;

  if (!mascota)
    return (
      <main className="container py-4">
        <h1>Paciente no encontrado</h1>
        <Link to="/gestion/pacientes">Volver a pacientes</Link>
      </main>
    );

  const servicios = db.listar("servicios");
  const delPaciente = servicios.filter((s) => s.especies.includes(mascota.especie));
  const vacunasServicio = delPaciente.filter((s) => s.categoria === "Vacunación");
  const dueno = db.obtener("usuarios", mascota.duenoId);

  function guardarConsulta(e) {
    e.preventDefault();
    const errores = {
      servicioId: validarRequerido(consulta.servicioId, "Servicio"),
      diagnostico: validarRequerido(consulta.diagnostico, "Diagnóstico"),
      tratamiento: validarRequerido(consulta.tratamiento, "Tratamiento"),
    };
    setErrC(errores);
    if (Object.values(errores).some(Boolean)) return;
    db.crear("fichas", { ...consulta, mascotaId: mascota.id, fecha: hoy, veterinarioId: usuario.id, proximoControl: consulta.proximoControl || null });
    setConsulta({ servicioId: "", diagnostico: "", tratamiento: "", proximoControl: "" });
    setVersion(version + 1);
  }

  function guardarVacuna(e) {
    e.preventDefault();
    if (!vacuna.servicioId || !vacuna.fecha) return setErrV("Elige la vacuna y la fecha de aplicación.");
    db.crear("vacunas", { mascotaId: mascota.id, servicioId: vacuna.servicioId, fecha: vacuna.fecha, proximoRefuerzo: calcularProximoRefuerzo(vacuna.fecha) });
    setErrV("");
    setVacuna({ servicioId: "", fecha: hoy });
    setVersion(version + 1);
  }

  return (
    <main className="container py-4" data-version={version}>
      <Link to="/gestion/pacientes">&larr; Pacientes</Link>
      <h1 className="mt-2">{mascota.nombre}</h1>
      <p className="text-muted">
        {mascota.especie}
        {mascota.raza ? `, ${mascota.raza}` : ""}, {mascota.pesoKg} kg. Dueño: {dueno?.nombre ?? "Sin registro"}
        {dueno?.telefono ? ` (${dueno.telefono})` : ""}
      </p>
      <HistorialMascota
        fichas={db.buscar("fichas", (f) => f.mascotaId === mascota.id)}
        vacunas={db.buscar("vacunas", (v) => v.mascotaId === mascota.id)}
        servicios={servicios}
        hoy={hoy}
      />

      {puedeRegistrar && (
        <div className="row g-4 mt-1">
          <form className="col-12 col-lg-7" onSubmit={guardarConsulta} noValidate>
            <h2 className="h5">Registrar consulta</h2>
            <CampoFormulario id="fc-serv" tipo="select" etiqueta="Servicio realizado" value={consulta.servicioId} error={errC.servicioId} onChange={(e) => setConsulta({ ...consulta, servicioId: e.target.value })} opciones={[{ valor: "", texto: "Selecciona un servicio" }, ...delPaciente.map((s) => ({ valor: s.id, texto: s.nombre }))]} />
            <CampoFormulario id="fc-diag" tipo="textarea" etiqueta="Diagnóstico" value={consulta.diagnostico} error={errC.diagnostico} onChange={(e) => setConsulta({ ...consulta, diagnostico: e.target.value })} />
            <CampoFormulario id="fc-trat" tipo="textarea" etiqueta="Tratamiento y medicamentos" value={consulta.tratamiento} error={errC.tratamiento} onChange={(e) => setConsulta({ ...consulta, tratamiento: e.target.value })} />
            <CampoFormulario id="fc-ctrl" tipo="date" etiqueta="Próximo control (opcional)" min={hoy} value={consulta.proximoControl} onChange={(e) => setConsulta({ ...consulta, proximoControl: e.target.value })} />
            <button type="submit" className="btn btn-primary">Guardar consulta</button>
          </form>
          <form className="col-12 col-lg-5" onSubmit={guardarVacuna} noValidate>
            <h2 className="h5">Registrar vacuna</h2>
            {errV && <div className="alert alert-danger py-2" role="alert">{errV}</div>}
            <CampoFormulario id="fv-serv" tipo="select" etiqueta="Vacuna" value={vacuna.servicioId} onChange={(e) => setVacuna({ ...vacuna, servicioId: e.target.value })} opciones={[{ valor: "", texto: "Selecciona una vacuna" }, ...vacunasServicio.map((s) => ({ valor: s.id, texto: s.nombre }))]} />
            <CampoFormulario id="fv-fecha" tipo="date" etiqueta="Fecha de aplicación" max={hoy} value={vacuna.fecha} onChange={(e) => setVacuna({ ...vacuna, fecha: e.target.value })} ayuda="El refuerzo se programa a 12 meses." />
            <button type="submit" className="btn btn-primary">Guardar vacuna</button>
          </form>
        </div>
      )}
    </main>
  );
}

export default FichaPaciente;
