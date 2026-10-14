import FormularioMascota from "../../src/components/FormularioMascota.jsx";
import { enviarFormulario, escribir, limpiar, montar, texto } from "../helpers.jsx";

describe("FormularioMascota", () => {
  afterEach(limpiar);
  const hoy = "2026-10-12";

  function llenar(contenedor, peso) {
    escribir(contenedor.querySelector("#m-nombre"), " Rocky ");
    escribir(contenedor.querySelector("#m-especie"), "Perro");
    escribir(contenedor.querySelector("#m-nac"), "2022-05-01");
    escribir(contenedor.querySelector("#m-peso"), peso);
  }

  it("rechaza un peso fuera de rango y no guarda", () => {
    const onGuardar = jasmine.createSpy("onGuardar");
    const { contenedor } = montar(<FormularioMascota hoy={hoy} onGuardar={onGuardar} />);
    llenar(contenedor, "500");
    enviarFormulario(contenedor.querySelector("form"));
    expect(onGuardar).not.toHaveBeenCalled();
    expect(texto(contenedor)).toContain("Ingresa un peso entre");
  });

  it("guarda con el nombre limpio y el peso como número", () => {
    const onGuardar = jasmine.createSpy("onGuardar");
    const { contenedor } = montar(<FormularioMascota hoy={hoy} onGuardar={onGuardar} />);
    llenar(contenedor, "12.5");
    enviarFormulario(contenedor.querySelector("form"));
    const datos = onGuardar.calls.mostRecent().args[0];
    expect(datos.nombre).toBe("Rocky");
    expect(datos.pesoKg).toBe(12.5);
  });

  it("muestra el botón Cancelar solo si recibe onCancelar", () => {
    const sin = montar(<FormularioMascota hoy={hoy} onGuardar={() => {}} />);
    expect(texto(sin.contenedor)).not.toContain("Cancelar");
    const con = montar(<FormularioMascota hoy={hoy} onGuardar={() => {}} onCancelar={() => {}} />);
    expect(texto(con.contenedor)).toContain("Cancelar");
  });
});
