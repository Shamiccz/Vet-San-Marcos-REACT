import Navegacion, { enlacesPorRol } from "../../src/components/Navegacion.jsx";
import { buscarPorTexto, clic, limpiar, montar, texto } from "../helpers.jsx";

describe("Navegacion", () => {
  afterEach(limpiar);

  it("muestra Ingresar y Crear cuenta cuando no hay sesión", () => {
    const { contenedor } = montar(<Navegacion usuario={null} onSalir={() => {}} />);
    expect(texto(contenedor)).toContain("Ingresar");
    expect(texto(contenedor)).toContain("Crear cuenta");
  });

  it("el dueño ve sus citas y mascotas, pero no la administración", () => {
    const { contenedor } = montar(<Navegacion usuario={{ nombre: "Camila", rol: "dueno" }} onSalir={() => {}} />);
    expect(texto(contenedor)).toContain("Mis citas");
    expect(texto(contenedor)).not.toContain("Usuarios");
  });

  it("el administrador ve usuarios, medicamentos y reportes", () => {
    const { contenedor } = montar(<Navegacion usuario={{ nombre: "Admin", rol: "administrador" }} onSalir={() => {}} />);
    ["Usuarios", "Medicamentos", "Reportes"].forEach((t) => expect(texto(contenedor)).toContain(t));
  });

  it("cierra la sesión al presionar el botón (evento)", () => {
    const onSalir = jasmine.createSpy("onSalir");
    const { contenedor } = montar(<Navegacion usuario={{ nombre: "Rosa", rol: "recepcionista" }} onSalir={onSalir} />);
    clic(buscarPorTexto(contenedor, "button", "Cerrar sesión"));
    expect(onSalir).toHaveBeenCalledTimes(1);
  });

  it("enlacesPorRol no entrega rutas de administración a la recepcionista", () => {
    const rutas = enlacesPorRol("recepcionista").map((e) => e.a);
    expect(rutas).toContain("/gestion/citas");
    expect(rutas.some((r) => r.startsWith("/admin"))).toBeFalse();
  });
});
