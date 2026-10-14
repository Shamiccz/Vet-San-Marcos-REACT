import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { db as dbPorDefecto } from "../data/db.js";
import { generarToken, hashClave } from "../utils/seguridad.js";
import { sinErrores, validarRegistro } from "../utils/validaciones.js";
import { hoyISO } from "../utils/formato.js";

const CLAVE_SESION = "vsm:sesion";
const DURACION_SESION_MS = 8 * 60 * 60 * 1000;

export const AuthContext = createContext({ usuario: null });

export function leerSesion(db) {
  try {
    const sesion = JSON.parse(db.almacen.getItem(CLAVE_SESION));
    return sesion && sesion.expira > Date.now() ? sesion : null;
  } catch {
    return null;
  }
}

function crearSesion(db, u) {
  const sesion = {
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    rol: u.rol,
    token: generarToken(),
    expira: Date.now() + DURACION_SESION_MS,
  };
  db.almacen.setItem(CLAVE_SESION, JSON.stringify(sesion));
  return sesion;
}

export function AuthProvider({ db = dbPorDefecto, children }) {
  const [usuario, setUsuario] = useState(() => leerSesion(db));

  const iniciarSesion = useCallback(
    async (email, clave) => {
      const encontrado = db.buscar("usuarios", (u) => u.email.toLowerCase() === email.trim().toLowerCase())[0];
      const hash = await hashClave(clave);
      if (!encontrado || encontrado.claveHash !== hash) return { ok: false, error: "Correo o clave incorrectos." };
      if (!encontrado.activo) return { ok: false, error: "Tu cuenta está desactivada. Contacta a la clínica." };
      const sesion = crearSesion(db, encontrado);
      setUsuario(sesion);
      return { ok: true, usuario: sesion };
    },
    [db],
  );

  // El registro público solo crea cuentas de dueño de mascota.
  const registrar = useCallback(
    async (datos) => {
      const errores = validarRegistro(datos);
      if (db.buscar("usuarios", (u) => u.email.toLowerCase() === datos.email.trim().toLowerCase()).length)
        errores.email = "Ya existe una cuenta con ese correo.";
      if (!sinErrores(errores)) return { ok: false, errores };
      const nuevo = db.crear("usuarios", {
        nombre: datos.nombre.trim(),
        email: datos.email.trim(),
        telefono: (datos.telefono ?? "").trim(),
        claveHash: await hashClave(datos.clave),
        rol: "dueno",
        activo: true,
        creadoEn: hoyISO(),
      });
      const sesion = crearSesion(db, nuevo);
      setUsuario(sesion);
      return { ok: true, usuario: sesion };
    },
    [db],
  );

  const cerrarSesion = useCallback(() => {
    db.almacen.removeItem(CLAVE_SESION);
    setUsuario(null);
  }, [db]);

  const valor = useMemo(
    () => ({ usuario, iniciarSesion, registrar, cerrarSesion }),
    [usuario, iniciarSesion, registrar, cerrarSesion],
  );
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
