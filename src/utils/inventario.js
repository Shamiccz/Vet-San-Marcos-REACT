export const UMBRAL_STOCK_CRITICO = 20;

export function esStockCritico(medicamento, umbral = UMBRAL_STOCK_CRITICO) {
  return medicamento.stock <= umbral;
}

export function medicamentosCriticos(lista, umbral = UMBRAL_STOCK_CRITICO) {
  return lista.filter((m) => esStockCritico(m, umbral)).sort((a, b) => a.stock - b.stock);
}

// "ME022" -> siguiente código disponible: "ME023"
export function siguienteCodigoMedicamento(lista) {
  const numeros = lista.map((m) => Number(String(m.id).replace(/\D/g, ""))).filter((n) => !Number.isNaN(n));
  return `ME${String((numeros.length ? Math.max(...numeros) : 0) + 1).padStart(3, "0")}`;
}
