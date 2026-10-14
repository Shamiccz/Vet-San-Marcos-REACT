import { SERVICIOS } from "./servicios.js";
import { MEDICAMENTOS } from "./medicamentos.js";
import { crearSemillas } from "./semillas.js";

const PREFIJO = "vsm:";

// Almacenamiento en memoria con la misma interfaz que localStorage.
// Se usa como respaldo y como "mock" en las pruebas unitarias.
export function almacenamientoMemoria() {
  const datos = new Map();
  return {
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => {
      datos.set(k, String(v));
    },
    removeItem: (k) => {
      datos.delete(k);
    },
  };
}

function almacenamientoNavegador() {
  try {
    const ls = window.localStorage;
    ls.setItem(`${PREFIJO}prueba`, "1");
    ls.removeItem(`${PREFIJO}prueba`);
    return ls;
  } catch {
    return almacenamientoMemoria();
  }
}

const COLECCIONES = ["usuarios", "mascotas", "servicios", "medicamentos", "citas", "fichas", "vacunas"];

const semillasPorDefecto = () => ({
  servicios: SERVICIOS,
  medicamentos: MEDICAMENTOS,
  ...crearSemillas(),
});

const clonar = (x) => JSON.parse(JSON.stringify(x));
const mismoId = (a, b) => String(a) === String(b);

function siguienteId(lista) {
  const numericos = lista.map((x) => x.id).filter((id) => typeof id === "number");
  return (numericos.length ? Math.max(...numericos) : 0) + 1;
}

// "Base de datos" simulada con CRUD sobre colecciones guardadas en localStorage.
export function crearDB(almacen = almacenamientoNavegador(), semillas = semillasPorDefecto) {
  const guardar = (col, lista) => almacen.setItem(PREFIJO + col, JSON.stringify(lista));

  function listar(col) {
    const bruto = almacen.getItem(PREFIJO + col);
    if (bruto === null) {
      const inicial = clonar(semillas()[col] ?? []);
      guardar(col, inicial);
      return inicial;
    }
    try {
      return JSON.parse(bruto);
    } catch {
      return [];
    }
  }

  return {
    almacen,
    listar,
    obtener: (col, id) => listar(col).find((x) => mismoId(x.id, id)) ?? null,
    buscar: (col, predicado) => listar(col).filter(predicado),
    crear(col, datos) {
      const lista = listar(col);
      const id = datos.id ?? siguienteId(lista);
      if (lista.some((x) => mismoId(x.id, id))) throw new Error(`Ya existe el registro ${id} en ${col}.`);
      const nuevo = { ...datos, id };
      guardar(col, [...lista, nuevo]);
      return nuevo;
    },
    actualizar(col, id, cambios) {
      const lista = listar(col);
      const i = lista.findIndex((x) => mismoId(x.id, id));
      if (i === -1) return null;
      const actualizado = { ...lista[i], ...cambios, id: lista[i].id };
      lista[i] = actualizado;
      guardar(col, lista);
      return actualizado;
    },
    eliminar(col, id) {
      const lista = listar(col);
      const resto = lista.filter((x) => !mismoId(x.id, id));
      if (resto.length === lista.length) return false;
      guardar(col, resto);
      return true;
    },
    reiniciar() {
      COLECCIONES.forEach((c) => almacen.removeItem(PREFIJO + c));
    },
  };
}

// Instancia compartida por toda la aplicación.
export const db = crearDB();
