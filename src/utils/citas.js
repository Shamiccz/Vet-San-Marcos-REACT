import { validarRequerido, sinErrores } from "./validaciones.js";
import { hoyISO, sumarMeses, sumarDias } from "./formato.js";

export const ESTADOS_CITA = {
  PENDIENTE: "pendiente",
  CONFIRMADA: "confirmada",
  REPROGRAMADA: "reprogramada", // la clínica propuso otro horario; el dueño debe aceptarlo
  CANCELADA: "cancelada",
  ATENDIDA: "atendida",
};

const ESTADOS_QUE_OCUPAN_CUPO = ["pendiente", "confirmada", "reprogramada"];

// La clínica cuenta con 3 médicos veterinarios: hasta 3 citas por bloque horario.
export const CAPACIDAD_POR_HORARIO = 3;

// Supuesto: atención de lunes a viernes, bloques de 30 min entre 09:00 y 17:30.
export const HORAS_DISPONIBLES = Array.from({ length: 18 }, (_, i) => {
  const minutos = 9 * 60 + i * 30;
  return `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`;
});

export function esDiaHabil(fecha) {
  const dia = new Date(`${fecha}T12:00:00`).getDay();
  return dia >= 1 && dia <= 5;
}

export function cupoDisponible(citas, fecha, hora, excluirId = null) {
  const ocupados = citas.filter(
    (c) =>
      c.fecha === fecha &&
      c.hora === hora &&
      ESTADOS_QUE_OCUPAN_CUPO.includes(c.estado) &&
      String(c.id) !== String(excluirId),
  ).length;
  return ocupados < CAPACIDAD_POR_HORARIO;
}

export function validarFechaHora(fecha, hora, hoy = hoyISO()) {
  const errores = {};
  if (!fecha) errores.fecha = "Elige una fecha.";
  else if (fecha < hoy) errores.fecha = "La fecha no puede ser anterior a hoy.";
  else if (!esDiaHabil(fecha)) errores.fecha = "La clínica atiende de lunes a viernes.";
  if (!hora) errores.hora = "Elige un horario.";
  else if (!HORAS_DISPONIBLES.includes(hora)) errores.hora = "Elige un horario de la lista.";
  return errores;
}

export function validarCita(datos, hoy = hoyISO()) {
  const motivo = validarRequerido(datos.motivo, "Motivo");
  return {
    mascotaId: validarRequerido(datos.mascotaId, "Mascota"),
    servicioId: validarRequerido(datos.servicioId, "Servicio"),
    ...validarFechaHora(datos.fecha, datos.hora, hoy),
    motivo: motivo || (datos.motivo.trim().length < 5 ? "Describe el motivo en al menos 5 caracteres." : ""),
  };
}

// Flujo "pedido" del caso: el dueño solicita una cita (queda pendiente).
// Recibe la "db" como parámetro para poder probarla con un almacenamiento falso.
export function solicitarCita(db, datos, duenoId, hoy = hoyISO()) {
  const errores = validarCita(datos, hoy);
  if (!sinErrores(errores)) return { ok: false, tipo: "validacion", errores };

  const mascota = db.obtener("mascotas", datos.mascotaId);
  const servicio = db.obtener("servicios", datos.servicioId);
  if (!mascota || mascota.duenoId !== duenoId)
    return { ok: false, tipo: "permiso", error: "Esa mascota no está registrada en tu cuenta." };
  if (!servicio) return { ok: false, tipo: "validacion", error: "El servicio ya no está disponible." };
  if (!servicio.especies.includes(mascota.especie))
    return { ok: false, tipo: "especie", error: `${servicio.nombre} no se realiza en ${mascota.especie.toLowerCase()}s.` };
  if (/ficha previa/i.test(servicio.observaciones) && !db.buscar("fichas", (f) => f.mascotaId === mascota.id).length)
    return { ok: false, tipo: "ficha", error: `${servicio.nombre} requiere una ficha clínica previa de ${mascota.nombre}.` };
  if (!cupoDisponible(db.listar("citas"), datos.fecha, datos.hora))
    return { ok: false, tipo: "cupo", error: `El ${datos.fecha} a las ${datos.hora} ya no tiene cupos. Elige otro horario.` };

  const cita = db.crear("citas", {
    duenoId,
    mascotaId: mascota.id,
    servicioId: servicio.id,
    fecha: datos.fecha,
    hora: datos.hora,
    motivo: datos.motivo.trim(),
    estado: ESTADOS_CITA.PENDIENTE,
    creadaEn: hoy,
  });
  return { ok: true, cita };
}

// La recepcionista propone otro horario: la cita queda "reprogramada" hasta que el dueño la acepte.
export function reagendarCita(db, id, fecha, hora, hoy = hoyISO()) {
  const errores = validarFechaHora(fecha, hora, hoy);
  if (!sinErrores(errores)) return { ok: false, error: errores.fecha || errores.hora };
  if (!cupoDisponible(db.listar("citas"), fecha, hora, id))
    return { ok: false, error: "Ese horario no tiene cupos disponibles." };
  const cita = db.actualizar("citas", id, { fecha, hora, estado: ESTADOS_CITA.REPROGRAMADA });
  return cita ? { ok: true, cita } : { ok: false, error: "La cita no existe." };
}

export function cambiarEstadoCita(db, id, estado) {
  return db.actualizar("citas", id, { estado });
}

// Vacunas: refuerzo anual y aviso antes del vencimiento.
export function calcularProximoRefuerzo(fechaAplicacion, meses = 12) {
  return sumarMeses(fechaAplicacion, meses);
}

export function vacunaPorVencer(proximoRefuerzo, hoy = hoyISO(), dias = 30) {
  return proximoRefuerzo <= sumarDias(hoy, dias);
}

// Agrega nombres legibles (mascota, dueño, servicio) para mostrar citas en tablas.
export function enriquecerCitas(db, citas) {
  return citas
    .map((c) => ({
      ...c,
      mascota: db.obtener("mascotas", c.mascotaId)?.nombre ?? "Sin registro",
      dueno: db.obtener("usuarios", c.duenoId)?.nombre ?? "Sin registro",
      servicio: db.obtener("servicios", c.servicioId)?.nombre ?? c.servicioId,
    }))
    .sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
}
