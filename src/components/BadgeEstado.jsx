const COLORES = {
  pendiente: "warning",
  confirmada: "success",
  reprogramada: "info",
  cancelada: "secondary",
  atendida: "primary",
};

function BadgeEstado({ estado }) {
  const color = COLORES[estado] ?? "secondary";
  const texto = color === "warning" || color === "info" ? "text-dark" : "";
  return <span className={`badge text-bg-${color} ${texto}`}>{estado}</span>;
}

export default BadgeEstado;
