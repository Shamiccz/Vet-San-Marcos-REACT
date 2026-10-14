import { useState } from "react";
import { almacenamientoMemoria, crearDB } from "../../src/data/db.js";
import { AuthProvider, useAuth } from "../../src/context/AuthContext.jsx";
import { accionAsincrona, limpiar, montar } from "../helpers.jsx";

// Componente de apoyo para probar el contexto desde la interfaz.
function Panel({ email, clave }) {
  const { usuario, iniciarSesion, cerrarSesion } = useAuth();
  const [mensaje, setMensaje] = useState("");
  const entrar = async () => {
    const r = await iniciarSesion(email, clave);
    setMensaje(r.ok ? "ok" : r.error);
  };
  return (
    <div>
      <span id="quien">{usuario ? `${usuario.nombre} (${usuario.rol})` : "nadie"}</span>
      <span id="mensaje">{mensaje}</span>
      <button id="entrar" onClick={entrar}>entrar</button>
      <button id="salir" onClick={cerrarSesion}>salir</button>
    </div>
  );
}

describe("AuthProvider", () => {
  afterEach(limpiar);
  let almacen;
  const armar = (email, clave) => {
    almacen = almacenamientoMemoria();
    return montar(<AuthProvider db={crearDB(almacen)}><Panel email={email} clave={clave} /></AuthProvider>).contenedor;
  };

  it("inicia sesión con credenciales correctas y guarda el token", async () => {
    const c = armar("admin@sanmarcos.cl", "Admin123");
    await accionAsincrona(() => c.querySelector("#entrar").click());
    expect(c.querySelector("#quien").textContent).toBe("Administrador Clínica (administrador)");
    expect(JSON.parse(almacen.getItem("vsm:sesion")).token.length).toBeGreaterThan(10);
  });

  it("rechaza una clave incorrecta sin abrir sesión", async () => {
    const c = armar("admin@sanmarcos.cl", "Equivocada1");
    await accionAsincrona(() => c.querySelector("#entrar").click());
    expect(c.querySelector("#mensaje").textContent).toBe("Correo o clave incorrectos.");
    expect(c.querySelector("#quien").textContent).toBe("nadie");
  });

  it("cerrar sesión elimina la sesión guardada", async () => {
    const c = armar("camila@correo.cl", "Dueno123");
    await accionAsincrona(() => c.querySelector("#entrar").click());
    await accionAsincrona(() => c.querySelector("#salir").click(), 0);
    expect(c.querySelector("#quien").textContent).toBe("nadie");
    expect(almacen.getItem("vsm:sesion")).toBeNull();
  });
});
