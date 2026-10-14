import { almacenamientoMemoria, crearDB } from "../../src/data/db.js";

describe("db (base de datos simulada con CRUD)", () => {
  // PT-08 · Lógica de datos (mock: almacenamiento en memoria en lugar de localStorage)
  it("persiste en el almacenamiento: otra instancia ve los mismos datos", () => {
    const almacen = almacenamientoMemoria();
    const db = crearDB(almacen);
    db.crear("mascotas", { nombre: "Luna", duenoId: 5 });
    const otra = crearDB(almacen);
    expect(otra.buscar("mascotas", (m) => m.nombre === "Luna").length).toBe(1);
  });
});
