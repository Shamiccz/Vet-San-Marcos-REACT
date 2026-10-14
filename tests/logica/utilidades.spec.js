import { validarClave } from "../../src/utils/validaciones.js";

describe("Validaciones", () => {
  // PT-10 · Validación de la política de claves
  it("exige claves de 8 o más caracteres con letras y números", () => {
    expect(validarClave("Abc12345")).toBe("");
    expect(validarClave("corta1")).toContain("8 caracteres");
    expect(validarClave("sololetras")).toContain("letras y números");
  });
});
