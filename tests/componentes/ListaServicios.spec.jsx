import ListaServicios from "../../src/components/ListaServicios.jsx";
import { SERVICIOS } from "../../src/data/servicios.js";
import { limpiar, montar, texto } from "../helpers.jsx";

describe("ListaServicios", () => {
  afterEach(limpiar);

  // PT-01 · Renderizado correcto
  it("renderiza una tarjeta por cada servicio del catálogo", () => {
    const { contenedor } = montar(<ListaServicios servicios={SERVICIOS} />);
    expect(contenedor.querySelectorAll("article").length).toBe(SERVICIOS.length);
  });

  // PT-02 · Renderizado condicional
  it("muestra el mensaje de vacío solo cuando no hay servicios", () => {
    const vacio = montar(<ListaServicios servicios={[]} />);
    expect(texto(vacio.contenedor)).toContain("No hay servicios que coincidan");
    const lleno = montar(<ListaServicios servicios={SERVICIOS.slice(0, 2)} />);
    expect(texto(lleno.contenedor)).not.toContain("No hay servicios que coincidan");
  });
});
