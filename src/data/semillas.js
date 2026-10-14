import { hoyISO, sumarDias } from "../utils/formato.js";

// Hash SHA-256 de las claves de demostración (ver README):
// Admin123 · Recep123 · Vet12345 · Dueno123
const H = {
  admin: "3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2",
  recep: "0c01954c0f4f6bbda12d86eaecbd6a524225a0cad0fac52e6aaf4c237f7f9cbe",
  vet: "ad9f6d1557365446c90f3c4491533cca5d1f7f3dcad62b3c264d36c5f03928c8",
  dueno: "2151d1152283049ed6a5c1bd84dfcb001d4a42f429883993f7713f2e64354783",
};

// Datos de ejemplo. Las fechas se calculan respecto de "hoy" para que siempre sean coherentes.
export function crearSemillas(hoy = hoyISO()) {
  const d = (n) => sumarDias(hoy, n);
  return {
    usuarios: [
      { id: 1, nombre: "Administrador Clínica", email: "admin@sanmarcos.cl", claveHash: H.admin, rol: "administrador", activo: true, telefono: "", creadoEn: d(-400) },
      { id: 2, nombre: "Rosa Muñoz", email: "recepcion@sanmarcos.cl", claveHash: H.recep, rol: "recepcionista", activo: true, telefono: "", creadoEn: d(-400) },
      { id: 3, nombre: "Dr. Andrés Vega", email: "vet@sanmarcos.cl", claveHash: H.vet, rol: "veterinario", activo: true, telefono: "", creadoEn: d(-400) },
      { id: 4, nombre: "Camila Rojas", email: "camila@correo.cl", claveHash: H.dueno, rol: "dueno", activo: true, telefono: "+56 9 1111 2222", creadoEn: d(-80) },
      { id: 5, nombre: "Pedro Soto", email: "pedro@correo.cl", claveHash: H.dueno, rol: "dueno", activo: true, telefono: "+56 9 3333 4444", creadoEn: d(-45) },
    ],
    mascotas: [
      { id: 1, duenoId: 4, nombre: "Firulais", especie: "Perro", raza: "Mestizo", fechaNacimiento: "2020-03-10", pesoKg: 14, creadoEn: d(-70) },
      { id: 2, duenoId: 4, nombre: "Michi", especie: "Gato", raza: "Siamés", fechaNacimiento: "2021-06-21", pesoKg: 4, creadoEn: d(-40) },
      { id: 3, duenoId: 5, nombre: "Toby", especie: "Perro", raza: "Labrador", fechaNacimiento: "2019-11-02", pesoKg: 28, creadoEn: d(-35) },
      { id: 4, duenoId: 5, nombre: "Nube", especie: "Conejo", raza: "Enano", fechaNacimiento: "2023-01-15", pesoKg: 2, creadoEn: d(-5) },
    ],
    citas: [
      { id: 1, duenoId: 4, mascotaId: 1, servicioId: "SV001", fecha: d(1), hora: "09:00", motivo: "Control general anual", estado: "pendiente", creadaEn: d(-1) },
      { id: 2, duenoId: 5, mascotaId: 3, servicioId: "VA001", fecha: d(2), hora: "10:30", motivo: "Refuerzo antirrábico", estado: "confirmada", creadaEn: d(-2) },
      { id: 3, duenoId: 4, mascotaId: 2, servicioId: "DE004", fecha: d(-10), hora: "11:00", motivo: "Desparasitación", estado: "atendida", creadaEn: d(-14) },
      { id: 4, duenoId: 5, mascotaId: 4, servicioId: "SV004", fecha: d(-20), hora: "15:00", motivo: "Primera revisión", estado: "atendida", creadaEn: d(-25) },
    ],
    fichas: [
      { id: 1, mascotaId: 2, fecha: d(-10), servicioId: "DE004", veterinarioId: 3, diagnostico: "Parásitos intestinales leves", tratamiento: "Desparasitación interna; repetir en 3 meses", proximoControl: d(80) },
      { id: 2, mascotaId: 4, fecha: d(-20), servicioId: "SV004", veterinarioId: 3, diagnostico: "Sin hallazgos", tratamiento: "Dieta con heno y control de peso", proximoControl: d(160) },
    ],
    vacunas: [
      { id: 1, mascotaId: 3, servicioId: "VA001", fecha: d(-340), proximoRefuerzo: d(25) },
      { id: 2, mascotaId: 1, servicioId: "VA002", fecha: d(-100), proximoRefuerzo: d(265) },
    ],
  };
}
