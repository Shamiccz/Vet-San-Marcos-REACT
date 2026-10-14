export function categoriasDe(servicios) {
  return [...new Set(servicios.map((s) => s.categoria))];
}

// filtros: { texto, categoria, especie } (vacío = sin filtrar)
export function filtrarServicios(servicios, { texto = "", categoria = "", especie = "" } = {}) {
  const t = texto.trim().toLowerCase();
  return servicios.filter(
    (s) =>
      (!t || s.nombre.toLowerCase().includes(t)) &&
      (!categoria || s.categoria === categoria) &&
      (!especie || s.especies.includes(especie)),
  );
}
