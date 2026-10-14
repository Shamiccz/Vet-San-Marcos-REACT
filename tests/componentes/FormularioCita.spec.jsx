import FormularioCita from "../../src/components/FormularioCita.jsx";
import { SERVICIOS } from "../../src/data/servicios.js";
import { hoyISO } from "../../src/utils/formato.js";
import { enviarFormulario, escribir, limpiar, montar, proximoDiaHabil, texto } from "../helpers.jsx";

describe("FormularioCita", () => {
  afterEach(limpiar);
  const mascotas = [
    { id: 1, nombre: "Firulais", especie: "Perro" },
    { id: 2, nombre: "Michi", especie: "Gato" },
  ];
  const armar = (onEnviar = () => {}) => montar(<FormularioCita mascotas={mascotas} servicios={SERVICIOS} hoy={hoyISO()} onEnviar={onEnviar} />);

  it("actualiza su estado al escribir el motivo (componente controlado)", () => {
    const { contenedor } = armar();
    escribir(contenedor.querySelector("#c-motivo"), "Control anual");
    expect(contenedor.querySelector("#c-motivo").value).toBe("Control anual");
  });

  it("no envía y muestra errores cuando el formulario está vacío", () => {
    const onEnviar = jasmine.createSpy("onEnviar");
    const { contenedor } = armar(onEnviar);
    enviarFormulario(contenedor.querySelector("form"));
    expect(onEnviar).not.toHaveBeenCalled();
    expect(texto(contenedor)).toContain("Completa el campo «Mascota»");
    expect(contenedor.querySelector("#c-fecha").classList.contains("is-invalid")).toBeTrue();
  });

  it("solo ofrece servicios compatibles con la especie de la mascota elegida", () => {
    const { contenedor } = armar();
    escribir(contenedor.querySelector("#c-mascota"), "2"); // Michi, gato
    const opciones = Array.from(contenedor.querySelectorAll("#c-servicio option")).map((o) => o.textContent);
    expect(opciones).toContain("Vacuna triple felina");
    expect(opciones).not.toContain("Vacuna antirrábica canina");
  });

  it("envía los datos completos cuando todo es válido", () => {
    const onEnviar = jasmine.createSpy("onEnviar");
    const { contenedor } = armar(onEnviar);
    const fecha = proximoDiaHabil();
    escribir(contenedor.querySelector("#c-mascota"), "1");
    escribir(contenedor.querySelector("#c-servicio"), "SV001");
    escribir(contenedor.querySelector("#c-fecha"), fecha);
    escribir(contenedor.querySelector("#c-hora"), "10:00");
    escribir(contenedor.querySelector("#c-motivo"), "Control anual");
    enviarFormulario(contenedor.querySelector("form"));
    expect(onEnviar).toHaveBeenCalledWith({ mascotaId: "1", servicioId: "SV001", fecha, hora: "10:00", motivo: "Control anual" });
  });
});
