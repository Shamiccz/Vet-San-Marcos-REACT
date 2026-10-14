import FormularioCita from "../../src/components/FormularioCita.jsx";
import { SERVICIOS } from "../../src/data/servicios.js";
import { hoyISO } from "../../src/utils/formato.js";
import { enviarFormulario, escribir, limpiar, montar, texto } from "../helpers.jsx";

describe("FormularioCita", () => {
  afterEach(limpiar);
  const mascotas = [
    { id: 1, nombre: "Firulais", especie: "Perro" },
    { id: 2, nombre: "Michi", especie: "Gato" },
  ];
  const armar = (onEnviar = () => {}) =>
    montar(<FormularioCita mascotas={mascotas} servicios={SERVICIOS} hoy={hoyISO()} onEnviar={onEnviar} />);

  // PT-05 · Estado
  it("actualiza su estado al escribir el motivo (componente controlado)", () => {
    const { contenedor } = armar();
    escribir(contenedor.querySelector("#c-motivo"), "Control anual");
    expect(contenedor.querySelector("#c-motivo").value).toBe("Control anual");
  });

  // PT-06 · Eventos y validación (mock con spy)
  it("no envía y muestra errores cuando el formulario está vacío", () => {
    const onEnviar = jasmine.createSpy("onEnviar");
    const { contenedor } = armar(onEnviar);
    enviarFormulario(contenedor.querySelector("form"));
    expect(onEnviar).not.toHaveBeenCalled();
    expect(texto(contenedor)).toContain("Completa el campo «Mascota»");
    expect(contenedor.querySelector("#c-fecha").classList.contains("is-invalid")).toBeTrue();
  });
});
