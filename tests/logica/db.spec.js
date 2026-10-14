import { almacenamientoMemoria, crearDB } from "../../src/data/db.js";

describe("db (base de datos simulada con CRUD)", () => {
  let almacen;
  let db;

  // Mock: almacenamiento en memoria en lugar de localStorage real.
  beforeEach(() => {
    almacen = almacenamientoMemoria();
    db = crearDB(almacen);
  });

  it("siembra el catálogo del Excel: 31 servicios y 22 medicamentos", () => {
    expect(db.listar("servicios").length).toBe(31);
    expect(db.listar("medicamentos").length).toBe(22);
  });

  it("crear asigna un id numérico correlativo", () => {
    const antes = db.listar("mascotas").length;
    const nueva = db.crear("mascotas", { nombre: "Rocky", duenoId: 4 });
    expect(nueva.id).toBe(Math.max(...db.listar("mascotas").map((m) => m.id)));
    expect(db.listar("mascotas").length).toBe(antes + 1);
  });

  it("no permite crear dos registros con el mismo id", () => {
    expect(() => db.crear("servicios", { id: "SV001", nombre: "Repetido" })).toThrowError(/Ya existe/);
  });

  it("obtener encuentra por id aunque llegue como texto (parámetro de URL)", () => {
    expect(db.obtener("mascotas", "1").nombre).toBe("Firulais");
    expect(db.obtener("mascotas", 999)).toBeNull();
  });

  it("actualizar cambia solo los campos indicados y conserva el id", () => {
    const m = db.actualizar("mascotas", 1, { pesoKg: 15, id: 999 });
    expect(m.pesoKg).toBe(15);
    expect(m.id).toBe(1);
    expect(m.nombre).toBe("Firulais");
    expect(db.actualizar("mascotas", 12345, { pesoKg: 1 })).toBeNull();
  });

  it("eliminar quita el registro y avisa si no existía", () => {
    expect(db.eliminar("mascotas", 1)).toBeTrue();
    expect(db.obtener("mascotas", 1)).toBeNull();
    expect(db.eliminar("mascotas", 1)).toBeFalse();
  });

  it("persiste en el almacenamiento: otra instancia ve los mismos datos", () => {
    db.crear("mascotas", { nombre: "Luna", duenoId: 5 });
    const otra = crearDB(almacen);
    expect(otra.buscar("mascotas", (m) => m.nombre === "Luna").length).toBe(1);
  });

  it("reiniciar vuelve a los datos de ejemplo", () => {
    db.eliminar("mascotas", 1);
    db.reiniciar();
    expect(db.obtener("mascotas", 1)).not.toBeNull();
  });

  it("tolera datos corruptos en el almacenamiento", () => {
    almacen.setItem("vsm:citas", "{no es json");
    expect(db.listar("citas")).toEqual([]);
  });
});
