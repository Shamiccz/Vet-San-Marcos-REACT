import { almacenamientoMemoria, crearDB } from "../../src/data/db.js";
import { CAPACIDAD_POR_HORARIO, cupoDisponible, solicitarCita } from "../../src/utils/citas.js";
import { proximoDiaHabil } from "../helpers.jsx";

describe("Lógica de citas", () => {
  // PT-09 · Lógica de negocio (mock: almacenamiento en memoria)
  it("no permite superar la capacidad de 3 citas por horario", () => {
    const db = crearDB(almacenamientoMemoria());
    const fecha = proximoDiaHabil();
    for (let i = 0; i < CAPACIDAD_POR_HORARIO; i += 1)
      db.crear("citas", { duenoId: 5, mascotaId: 3, servicioId: "SV001", fecha, hora: "12:00", estado: "confirmada" });

    expect(cupoDisponible(db.listar("citas"), fecha, "12:00")).toBeFalse();
    const r = solicitarCita(db, { mascotaId: "1", servicioId: "SV001", fecha, hora: "12:00", motivo: "Control anual" }, 4);
    expect(r.ok).toBeFalse();
    expect(r.tipo).toBe("cupo");
  });
});
