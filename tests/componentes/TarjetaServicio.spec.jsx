import TarjetaServicio from "../../src/components/TarjetaServicio.jsx";
import { SERVICIOS } from "../../src/data/servicios.js";
import { buscarPorTexto, clic, limpiar, montar } from "../helpers.jsx";

describe("TarjetaServicio", () => {
  afterEach(limpiar);
  const consulta = SERVICIOS.find((s) => s.id === "SV001");

  // PT-03 · Props
  it("no muestra el botón de cita si no recibe onSolicitar", () => {
    const { contenedor } = montar(<TarjetaServicio servicio={consulta} />);
    expect(buscarPorTexto(contenedor, "button", "Solicitar cita")).toBeNull();
  });

  // PT-04 · Eventos (mock con spy)
  it("llama a onSolicitar con el servicio al hacer clic", () => {
    const onSolicitar = jasmine.createSpy("onSolicitar");
    const { contenedor } = montar(<TarjetaServicio servicio={consulta} onSolicitar={onSolicitar} />);
    clic(buscarPorTexto(contenedor, "button", "Solicitar cita"));
    expect(onSolicitar).toHaveBeenCalledTimes(1);
    expect(onSolicitar).toHaveBeenCalledWith(consulta);
  });
});
