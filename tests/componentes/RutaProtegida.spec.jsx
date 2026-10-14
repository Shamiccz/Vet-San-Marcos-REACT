import { Route, Routes } from "react-router-dom";
import RutaProtegida from "../../src/components/RutaProtegida.jsx";
import { AuthContext } from "../../src/context/AuthContext.jsx";
import { limpiar, montar, texto } from "../helpers.jsx";

describe("RutaProtegida", () => {
  afterEach(limpiar);

  // PT-07 · Renderizado condicional (mock: el contexto se reemplaza por un valor falso)
  it("redirige a /login cuando no hay sesión", () => {
    const app = (
      <AuthContext.Provider value={{ usuario: null }}>
        <Routes>
          <Route path="/login" element={<p>pantalla login</p>} />
          <Route path="/admin" element={<RutaProtegida roles={["administrador"]}><p>panel admin</p></RutaProtegida>} />
        </Routes>
      </AuthContext.Provider>
    );
    const { contenedor } = montar(app, { ruta: "/admin" });
    expect(texto(contenedor)).toBe("pantalla login");
  });
});
