import BadgeEstado from "../../src/components/BadgeEstado.jsx";
import HistorialMascota from "../../src/components/HistorialMascota.jsx";
import TablaCitas from "../../src/components/TablaCitas.jsx";
import { SERVICIOS } from "../../src/data/servicios.js";
import { buscarPorTexto, clic, limpiar, montar, texto } from "../helpers.jsx";

describe("TablaCitas", () => {
  afterEach(limpiar);
  const filas = [
    { id: 1, fecha: "2026-10-14", hora: "09:00", mascota: "Firulais", dueno: "Camila", servicio: "Consulta general", motivo: "Control", estado: "pendiente" },
    { id: 2, fecha: "2026-10-15", hora: "10:30", mascota: "Toby", dueno: "Pedro", servicio: "Vacuna antirrábica canina", motivo: "Refuerzo", estado: "confirmada" },
  ];

  it("renderiza una fila por cita con la fecha en formato dd-mm-aaaa", () => {
    const { contenedor } = montar(<TablaCitas filas={filas} />);
    expect(contenedor.querySelectorAll("tbody tr").length).toBe(2);
    expect(texto(contenedor)).toContain("14-10-2026");
  });

  it("muestra la columna Dueño solo cuando se pide", () => {
    expect(texto(montar(<TablaCitas filas={filas} />).contenedor)).not.toContain("Dueño");
    expect(texto(montar(<TablaCitas filas={filas} mostrarDueno />).contenedor)).toContain("Camila");
  });

  it("muestra mensaje cuando no hay citas", () => {
    expect(texto(montar(<TablaCitas filas={[]} />).contenedor)).toContain("No hay citas para mostrar");
  });

  it("ejecuta la acción de la fila correcta", () => {
    const alCancelar = jasmine.createSpy("alCancelar");
    const acciones = (f) => <button type="button" onClick={() => alCancelar(f.id)}>Cancelar</button>;
    const { contenedor } = montar(<TablaCitas filas={filas} renderAcciones={acciones} />);
    clic(contenedor.querySelectorAll("tbody button")[1]);
    expect(alCancelar).toHaveBeenCalledWith(2);
  });
});

describe("BadgeEstado e HistorialMascota", () => {
  afterEach(limpiar);

  it("asigna un color distinto según el estado", () => {
    const ok = montar(<BadgeEstado estado="confirmada" />).contenedor.firstChild;
    const pend = montar(<BadgeEstado estado="pendiente" />).contenedor.firstChild;
    expect(ok.classList.contains("text-bg-success")).toBeTrue();
    expect(pend.classList.contains("text-bg-warning")).toBeTrue();
  });

  it("avisa solo las vacunas cuyo refuerzo está por vencer", () => {
    const vacunas = [
      { id: 1, servicioId: "VA001", fecha: "2025-11-01", proximoRefuerzo: "2026-10-25" },
      { id: 2, servicioId: "VA002", fecha: "2026-06-01", proximoRefuerzo: "2027-06-01" },
    ];
    const { contenedor } = montar(<HistorialMascota fichas={[]} vacunas={vacunas} servicios={SERVICIOS} hoy="2026-10-12" />);
    expect(contenedor.querySelectorAll(".badge").length).toBe(1);
    expect(texto(contenedor)).toContain("Refuerzo por vencer");
    expect(buscarPorTexto(contenedor, "h3", "Consultas")).not.toBeNull();
  });
});
