import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FiltroServicios from "../components/FiltroServicios.jsx";
import ListaServicios from "../components/ListaServicios.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { db } from "../data/db.js";
import { categoriasDe, filtrarServicios } from "../utils/catalogo.js";
import { ROLES } from "../utils/roles.js";

function Servicios() {
  const { usuario } = useAuth();
  const navegar = useNavigate();
  const [filtros, setFiltros] = useState({ texto: "", categoria: "", especie: "" });
  const servicios = useMemo(() => db.listar("servicios"), []);
  const visibles = filtrarServicios(servicios, filtros);
  // Solo los dueños pueden pedir cita desde el catálogo.
  const solicitar = usuario?.rol === ROLES.DUENO ? (s) => navegar(`/citas/nueva?servicio=${s.id}`) : undefined;

  return (
    <main className="container py-4">
      <h1 className="mb-1">Servicios</h1>
      <p className="text-muted">Consultas, vacunas, cirugías, exámenes y más. Precios en pesos chilenos.</p>
      <FiltroServicios filtros={filtros} categorias={categoriasDe(servicios)} onCambio={setFiltros} />
      <ListaServicios servicios={visibles} onSolicitar={solicitar} />
    </main>
  );
}

export default Servicios;
