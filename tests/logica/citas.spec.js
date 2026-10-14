import { almacenamientoMemoria, crearDB } from "../../src/data/db.js";
import {
  CAPACIDAD_POR_HORARIO, HORAS_DISPONIBLES, calcularProximoRefuerzo, cupoDisponible, esDiaHabil,
  reagendarCita, solicitarCita, validarCita, vacunaPorVencer,
} from "../../src/utils/citas.js";
import { hoyISO } from "../../src/utils/formato.js";
import { proximoDiaHabil } from "../helpers.jsx";

describe("Lógica de citas", () => {
  let db;
  const hoy = hoyISO();
  const fecha = proximoDiaHabil();
  const datos = (cambios = {}) => ({ mascotaId: "1", servicioId: "SV001", fecha, hora: "10:00", motivo: "Control anual", ...cambios });

  beforeEach(() => {
    db = crearDB(almacenamientoMemoria());
  });

  it("define bloques de 30 minutos entre 09:00 y 17:30", () => {
    expect(HORAS_DISPONIBLES[0]).toBe("09:00");
    expect(HORAS_DISPONIBLES[HORAS_DISPONIBLES.length - 1]).toBe("17:30");
  });

  it("solo acepta días hábiles (lunes a viernes)", () => {
    expect(esDiaHabil("2026-10-12")).toBeTrue(); // lunes
    expect(esDiaHabil("2026-10-17")).toBeFalse(); // sábado
  });

  it("validarCita detecta fecha pasada, horario inválido y motivo corto", () => {
    const e = validarCita(datos({ fecha: "2020-01-06", hora: "03:00", motivo: "hi" }), hoy);
    expect(e.fecha).toContain("anterior a hoy");
    expect(e.hora).toContain("lista");
    expect(e.motivo).toContain("5 caracteres");
  });

  it("solicitarCita crea la cita en estado pendiente", () => {
    const r = solicitarCita(db, datos(), 4);
    expect(r.ok).toBeTrue();
    expect(r.cita.estado).toBe("pendiente");
    expect(db.obtener("citas", r.cita.id).motivo).toBe("Control anual");
  });

  it("rechaza pedir cita para la mascota de otro dueño (privacidad)", () => {
    const r = solicitarCita(db, datos({ mascotaId: "3" }), 4);
    expect(r.ok).toBeFalse();
    expect(r.tipo).toBe("permiso");
  });

  it("rechaza un servicio que no corresponde a la especie", () => {
    const r = solicitarCita(db, datos({ servicioId: "VA001" }), 4); // antirrábica canina para un perro: válido
    expect(r.ok).toBeTrue();
    const gato = solicitarCita(db, datos({ mascotaId: "2", servicioId: "VA001", hora: "11:00" }), 4);
    expect(gato.tipo).toBe("especie");
  });

  it("la segunda opinión exige ficha previa de la mascota", () => {
    expect(solicitarCita(db, datos({ servicioId: "SV005" }), 4).tipo).toBe("ficha"); // Firulais no tiene ficha
    expect(solicitarCita(db, datos({ mascotaId: "2", servicioId: "SV005", hora: "11:00" }), 4).ok).toBeTrue(); // Michi sí
  });

  it("no permite superar la capacidad de 3 citas por horario", () => {
    for (let i = 0; i < CAPACIDAD_POR_HORARIO; i += 1)
      db.crear("citas", { duenoId: 5, mascotaId: 3, servicioId: "SV001", fecha, hora: "12:00", estado: "confirmada" });
    expect(cupoDisponible(db.listar("citas"), fecha, "12:00")).toBeFalse();
    const r = solicitarCita(db, datos({ hora: "12:00" }), 4);
    expect(r.tipo).toBe("cupo");
  });

  it("las citas canceladas liberan el cupo", () => {
    const citas = Array.from({ length: 3 }, (_, i) => ({ id: i + 1, fecha, hora: "12:00", estado: "cancelada" }));
    expect(cupoDisponible(citas, fecha, "12:00")).toBeTrue();
  });

  it("reagendarCita deja la cita como reprogramada con el nuevo horario", () => {
    const r = reagendarCita(db, 1, fecha, "16:00", hoy);
    expect(r.ok).toBeTrue();
    expect(db.obtener("citas", 1)).toEqual(jasmine.objectContaining({ hora: "16:00", estado: "reprogramada" }));
  });

  it("calcula el refuerzo anual y avisa 30 días antes del vencimiento", () => {
    expect(calcularProximoRefuerzo("2026-01-15")).toBe("2027-01-15");
    expect(vacunaPorVencer("2026-10-25", "2026-10-12")).toBeTrue();
    expect(vacunaPorVencer("2027-06-01", "2026-10-12")).toBeFalse();
  });
});
