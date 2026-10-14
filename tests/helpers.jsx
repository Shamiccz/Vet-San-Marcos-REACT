import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { esDiaHabil } from "../src/utils/citas.js";
import { hoyISO, sumarDias } from "../src/utils/formato.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const montados = [];

// Monta un componente en el DOM real del navegador (Karma) dentro de un MemoryRouter.
export function montar(ui, { ruta = "/" } = {}) {
  const contenedor = document.createElement("div");
  document.body.appendChild(contenedor);
  const raiz = createRoot(contenedor);
  act(() => raiz.render(<MemoryRouter initialEntries={[ruta]}>{ui}</MemoryRouter>));
  const desmontar = () => {
    act(() => raiz.unmount());
    contenedor.remove();
  };
  montados.push(desmontar);
  return { contenedor, desmontar };
}

// Limpia lo montado: úsalo en afterEach de cada spec.
export function limpiar() {
  while (montados.length) montados.pop()();
}

export const texto = (contenedor) => contenedor.textContent;

export function buscarPorTexto(contenedor, selector, contenido) {
  return Array.from(contenedor.querySelectorAll(selector)).find((e) => e.textContent.trim() === contenido) ?? null;
}

export function clic(elemento) {
  act(() => {
    elemento.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

// Simula que el usuario escribe o elige un valor (React escucha "input" y "change").
export function escribir(elemento, valor) {
  const proto =
    elemento instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype
    : elemento instanceof HTMLSelectElement ? HTMLSelectElement.prototype
    : HTMLInputElement.prototype;
  const asignar = Object.getOwnPropertyDescriptor(proto, "value").set;
  act(() => {
    asignar.call(elemento, valor);
    elemento.dispatchEvent(new Event(elemento instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }));
  });
}

export function enviarFormulario(formulario) {
  act(() => {
    formulario.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
}

// Para acciones asíncronas (por ejemplo, el hash de la clave con Web Crypto).
export async function accionAsincrona(accion, esperaMs = 80) {
  await act(async () => {
    accion();
    await new Promise((r) => setTimeout(r, esperaMs));
  });
}

export function proximoDiaHabil(desde = hoyISO()) {
  let f = sumarDias(desde, 1);
  while (!esDiaHabil(f)) f = sumarDias(f, 1);
  return f;
}
