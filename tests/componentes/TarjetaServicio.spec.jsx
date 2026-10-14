import TarjetaServicio from "../../src/components/TarjetaServicio.jsx";
import { SERVICIOS } from "../../src/data/servicios.js";
import { buscarPorTexto, clic, limpiar, montar, texto } from "../helpers.jsx";

describe("TarjetaServicio", () => {
  afterEach(limpiar);
  const consulta = SERVICIOS.find((s) => s.id === "SV001");
  const antirrabica = SERVICIOS.find((s) => s.id === "VA001");

  it("renderiza nombre, duración y precio formateado en pesos", () => {
    const { contenedor } = montar(<TarjetaServicio servicio={consulta} />);
    expect(texto(contenedor)).toContain("Consulta general");
    expect(texto(contenedor)).toContain("30 min");
    expect(texto(contenedor)).toMatch(/15\.000/);
  });

  it("muestra la insignia 'Obligatoria por ley' solo cuando corresponde", () => {
    const con = montar(<TarjetaServicio servicio={antirrabica} />);
    expect(texto(con.contenedor)).toContain("Obligatoria por ley");
    const sin = montar(<TarjetaServicio servicio={consulta} />);
    expect(texto(sin.contenedor)).not.toContain("Obligatoria por ley");
  });

  it("no muestra el botón de cita si no recibe onSolicitar", () => {
    const { contenedor } = montar(<TarjetaServicio servicio={consulta} />);
    expect(buscarPorTexto(contenedor, "button", "Solicitar cita")).toBeNull();
  });

  it("llama a onSolicitar con el servicio al hacer clic (mock con spy)", () => {
    const onSolicitar = jasmine.createSpy("onSolicitar");
    const { contenedor } = montar(<TarjetaServicio servicio={consulta} onSolicitar={onSolicitar} />);
    clic(buscarPorTexto(contenedor, "button", "Solicitar cita"));
    expect(onSolicitar).toHaveBeenCalledTimes(1);
    expect(onSolicitar).toHaveBeenCalledWith(consulta);
  });
});
