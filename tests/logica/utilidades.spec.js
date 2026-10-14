import { SERVICIOS } from "../../src/data/servicios.js";
import { MEDICAMENTOS } from "../../src/data/medicamentos.js";
import { CLINICA, urlIndicaciones } from "../../src/data/clinica.js";
import { categoriasDe, filtrarServicios } from "../../src/utils/catalogo.js";
import { formatoDuracion, formatoFecha, sumarDias } from "../../src/utils/formato.js";
import { esStockCritico, medicamentosCriticos, siguienteCodigoMedicamento } from "../../src/utils/inventario.js";
import { atencionesPorPeriodo, pacientesNuevosPorMes } from "../../src/utils/reportes.js";
import { hashClave } from "../../src/utils/seguridad.js";
import { sinErrores, validarClave, validarEmail, validarRegistro, validarTelefono } from "../../src/utils/validaciones.js";

describe("Validaciones", () => {
  it("valida el formato del correo", () => {
    expect(validarEmail("camila@correo.cl")).toBe("");
    expect(validarEmail("camila@")).toContain("correo válido");
    expect(validarEmail("")).toContain("obligatorio");
  });

  it("exige claves de 8+ caracteres con letras y números", () => {
    expect(validarClave("Abc12345")).toBe("");
    expect(validarClave("corta1")).toContain("8 caracteres");
    expect(validarClave("sololetras")).toContain("letras y números");
  });

  it("el teléfono es opcional pero debe ser válido si se informa", () => {
    expect(validarTelefono("")).toBe("");
    expect(validarTelefono("+56 9 1234 5678")).toBe("");
    expect(validarTelefono("abc")).toContain("dígitos");
  });

  it("validarRegistro detecta claves que no coinciden", () => {
    const e = validarRegistro({ nombre: "Ana", email: "ana@correo.cl", telefono: "", clave: "Abc12345", confirmacion: "otra" });
    expect(e.confirmacion).toContain("no coinciden");
    expect(sinErrores(e)).toBeFalse();
  });

  it("hashClave entrega el SHA-256 conocido de una clave", async () => {
    expect(await hashClave("Admin123")).toBe("3b612c75a7b5048a435fb6ec81e52ff92d6d795a8b5a9c17070f6a63c97a53b2");
  });
});

describe("Catálogo e inventario", () => {
  it("filtra por texto, categoría y especie combinados", () => {
    const r = filtrarServicios(SERVICIOS, { texto: "vacuna", categoria: "Vacunación", especie: "Gato" });
    expect(r.length).toBe(3); // antirrábica felina, bivalente y triple felina
    expect(r.every((s) => s.especies.includes("Gato"))).toBeTrue();
  });

  it("sin filtros devuelve todo y hay 6 categorías", () => {
    expect(filtrarServicios(SERVICIOS).length).toBe(31);
    expect(categoriasDe(SERVICIOS).length).toBe(6);
  });

  it("detecta el stock crítico (20 unidades o menos) ordenado de menor a mayor", () => {
    const criticos = medicamentosCriticos(MEDICAMENTOS);
    expect(criticos.map((m) => m.nombre)).toEqual(["Vetmedin 2.5mg", "Apoquel 16mg", "Malaseb shampoo"]);
    expect(esStockCritico({ stock: 21 })).toBeFalse();
  });

  it("genera el siguiente código de medicamento", () => {
    expect(siguienteCodigoMedicamento(MEDICAMENTOS)).toBe("ME023");
    expect(siguienteCodigoMedicamento([])).toBe("ME001");
  });
});

describe("Reportes, formato y ubicación", () => {
  it("cuenta solo citas atendidas dentro del período y suma ingresos", () => {
    const citas = [
      { servicioId: "SV001", fecha: "2026-10-01", estado: "atendida" },
      { servicioId: "VA001", fecha: "2026-10-02", estado: "atendida" },
      { servicioId: "SV001", fecha: "2026-10-03", estado: "cancelada" },
      { servicioId: "SV001", fecha: "2026-08-01", estado: "atendida" },
    ];
    const r = atencionesPorPeriodo(citas, SERVICIOS, "2026-10-01", "2026-10-31");
    expect(r.total).toBe(2);
    expect(r.ingresos).toBe(15000 + 12000);
  });

  it("agrupa los pacientes nuevos por mes en orden cronológico", () => {
    const r = pacientesNuevosPorMes([{ creadoEn: "2026-09-10" }, { creadoEn: "2026-08-01" }, { creadoEn: "2026-09-30" }]);
    expect(r).toEqual([{ mes: "2026-08", cantidad: 1 }, { mes: "2026-09", cantidad: 2 }]);
  });

  it("formatea duraciones y fechas", () => {
    expect(formatoDuracion(30)).toBe("30 min");
    expect(formatoDuracion(90)).toBe("1 h 30 min");
    expect(formatoDuracion(1440)).toBe("24 h");
    expect(formatoFecha("2026-10-12")).toBe("12-10-2026");
    expect(sumarDias("2026-10-31", 1)).toBe("2026-11-01");
  });

  it("arma la URL de indicaciones con y sin ubicación de origen", () => {
    expect(urlIndicaciones(null)).toContain(`destination=${CLINICA.lat},${CLINICA.lng}`);
    expect(urlIndicaciones({ lat: -33.4, lng: -70.6 })).toContain("origin=-33.4,-70.6");
  });
});
