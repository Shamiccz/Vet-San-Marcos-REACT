export function formatoCLP(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);
}

// "30 min", "1 h 30 min", "24 h"
export function formatoDuracion(minutos) {
  if (minutos < 60) return `${minutos} min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

// "2026-10-12" -> "12-10-2026"
export function formatoFecha(iso) {
  if (!iso) return "";
  const [a, m, d] = iso.split("-");
  return `${d}-${m}-${a}`;
}

export function hoyISO(fecha = new Date()) {
  const a = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${a}-${m}-${d}`;
}

export function sumarDias(iso, dias) {
  const f = new Date(`${iso}T12:00:00`);
  f.setDate(f.getDate() + dias);
  return hoyISO(f);
}

export function sumarMeses(iso, meses) {
  const f = new Date(`${iso}T12:00:00`);
  f.setMonth(f.getMonth() + meses);
  return hoyISO(f);
}
