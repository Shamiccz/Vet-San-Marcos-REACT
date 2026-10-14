// Reportes de la clínica (sin revisar archivadores).
export function atencionesPorPeriodo(citas, servicios, desde, hasta) {
  const atendidas = citas.filter((c) => c.estado === "atendida" && c.fecha >= desde && c.fecha <= hasta);
  const porCategoria = {};
  let ingresos = 0;
  atendidas.forEach((c) => {
    const s = servicios.find((x) => x.id === c.servicioId);
    if (!s) return;
    const fila = (porCategoria[s.categoria] ??= { categoria: s.categoria, cantidad: 0, ingresos: 0 });
    fila.cantidad += 1;
    fila.ingresos += s.precio;
    ingresos += s.precio;
  });
  return {
    total: atendidas.length,
    ingresos,
    porCategoria: Object.values(porCategoria).sort((a, b) => b.cantidad - a.cantidad),
  };
}

// Pacientes nuevos por mes ("2026-10" -> cantidad)
export function pacientesNuevosPorMes(mascotas) {
  const conteo = {};
  mascotas.forEach((m) => {
    const mes = m.creadoEn.slice(0, 7);
    conteo[mes] = (conteo[mes] ?? 0) + 1;
  });
  return Object.keys(conteo)
    .sort()
    .map((mes) => ({ mes, cantidad: conteo[mes] }));
}
