import { Route, Routes } from "react-router-dom";
import RutaProtegida from "../../src/components/RutaProtegida.jsx";
import { AuthContext } from "../../src/context/AuthContext.jsx";
import { limpiar, montar, texto } from "../helpers.jsx";

describe("RutaProtegida", () => {
  afterEach(limpiar);

  // El contexto se reemplaza por un valor falso (mock) para controlar el usuario.
  const app = (usuario) => (
    <AuthContext.Provider value={{ usuario }}>
      <Routes>
        <Route path="/login" element={<p>pantalla login</p>} />
        <Route path="/mis-citas" element={<p>pantalla mis citas</p>} />
        <Route path="/admin" element={<RutaProtegida roles={["administrador"]}><p>panel admin</p></RutaProtegida>} />
      </Routes>
    </AuthContext.Provider>
  );

  it("redirige a /login cuando no hay sesión", () => {
    const { contenedor } = montar(app(null), { ruta: "/admin" });
    expect(texto(contenedor)).toBe("pantalla login");
  });

  it("redirige al inicio del rol cuando el rol no tiene permiso", () => {
    const { contenedor } = montar(app({ rol: "dueno" }), { ruta: "/admin" });
    expect(texto(contenedor)).toBe("pantalla mis citas");
  });

  it("muestra el contenido cuando el rol es el permitido", () => {
    const { contenedor } = montar(app({ rol: "administrador" }), { ruta: "/admin" });
    expect(texto(contenedor)).toBe("panel admin");
  });
});
