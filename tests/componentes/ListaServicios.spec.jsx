import ListaServicios from "../../src/components/ListaServicios.jsx";
import FiltroServicios from "../../src/components/FiltroServicios.jsx";
import { SERVICIOS } from "../../src/data/servicios.js";
import { categoriasDe } from "../../src/utils/catalogo.js";
import { escribir, limpiar, montar, texto } from "../helpers.jsx";

describe("ListaServicios", () => {
  afterEach(limpiar);

  it("renderiza una tarjeta por cada servicio del catálogo", () => {
    const { contenedor } = montar(<ListaServicios servicios={SERVICIOS} />);
    expect(contenedor.querySelectorAll("article").length).toBe(SERVICIOS.length);
  });

  it("muestra el mensaje de vacío solo cuando no hay servicios", () => {
    const vacio = montar(<ListaServicios servicios={[]} />);
    expect(texto(vacio.contenedor)).toContain("No hay servicios que coincidan");
    const lleno = montar(<ListaServicios servicios={SERVICIOS.slice(0, 2)} />);
    expect(texto(lleno.contenedor)).not.toContain("No hay servicios que coincidan");
  });
});

describe("FiltroServicios", () => {
  afterEach(limpiar);
  const filtros = { texto: "", categoria: "", especie: "" };

  it("ofrece 'Todas' más una opción por cada categoría", () => {
    const { contenedor } = montar(<FiltroServicios filtros={filtros} categorias={categoriasDe(SERVICIOS)} onCambio={() => {}} />);
    expect(contenedor.querySelectorAll("#f-categoria option").length).toBe(categoriasDe(SERVICIOS).length + 1);
  });

  it("notifica el filtro actualizado cuando el usuario escribe", () => {
    const onCambio = jasmine.createSpy("onCambio");
    const { contenedor } = montar(<FiltroServicios filtros={filtros} categorias={[]} onCambio={onCambio} />);
    escribir(contenedor.querySelector("#f-texto"), "vacuna");
    expect(onCambio).toHaveBeenCalledWith({ texto: "vacuna", categoria: "", especie: "" });
  });
});
