import { useState } from "react";
import CampoFormulario from "../../components/CampoFormulario.jsx";
import { db } from "../../data/db.js";
import { formatoCLP } from "../../utils/formato.js";
import { esStockCritico, siguienteCodigoMedicamento } from "../../utils/inventario.js";
import { sinErrores, validarRequerido } from "../../utils/validaciones.js";

const VACIO = { nombre: "", categoria: "", principioActivo: "", presentacion: "", stock: "", precio: "" };

// Inventario de medicamentos y vacunas con alerta de stock crítico.
function Medicamentos() {
  const [lista, setLista] = useState(() => db.listar("medicamentos"));
  const [soloCriticos, setSoloCriticos] = useState(false);
  const [editando, setEditando] = useState(null); // null | "nuevo" | medicamento
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});

  const refrescar = () => setLista(db.listar("medicamentos"));
  const abrir = (m) => { setEditando(m); setValores(m === "nuevo" ? VACIO : { ...m, stock: String(m.stock), precio: String(m.precio) }); setErrores({}); };
  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });
  const entero = (v) => /^\d+$/.test(String(v));

  function guardar(e) {
    e.preventDefault();
    const errs = {
      nombre: validarRequerido(valores.nombre, "Nombre"),
      categoria: validarRequerido(valores.categoria, "Categoría"),
      stock: entero(valores.stock) ? "" : "El stock debe ser un número entero, 0 o mayor.",
      precio: entero(valores.precio) && Number(valores.precio) > 0 ? "" : "El precio debe ser un entero mayor a 0.",
    };
    setErrores(errs);
    if (!sinErrores(errs)) return;
    const datos = { ...valores, nombre: valores.nombre.trim(), stock: Number(valores.stock), precio: Number(valores.precio) };
    if (editando === "nuevo") db.crear("medicamentos", { ...datos, id: siguienteCodigoMedicamento(lista), especies: datos.especies ?? ["Perro", "Gato"] });
    else db.actualizar("medicamentos", editando.id, datos);
    refrescar();
    setEditando(null);
  }

  function eliminar(m) {
    if (!window.confirm(`¿Eliminar ${m.nombre} del inventario?`)) return;
    db.eliminar("medicamentos", m.id);
    refrescar();
  }

  const visibles = soloCriticos ? lista.filter((m) => esStockCritico(m)) : lista;

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Medicamentos y vacunas</h1>
        {!editando && <button type="button" className="btn btn-primary" onClick={() => abrir("nuevo")}>Agregar medicamento</button>}
      </div>

      {editando && (
        <form className="card card-body mb-4" onSubmit={guardar} noValidate>
          <h2 className="h5">{editando === "nuevo" ? "Nuevo medicamento" : `Editar ${editando.nombre}`}</h2>
          <div className="row">
            <div className="col-12 col-md-6"><CampoFormulario id="d-nombre" name="nombre" etiqueta="Nombre comercial" value={valores.nombre} onChange={cambiar} error={errores.nombre} /></div>
            <div className="col-12 col-md-6"><CampoFormulario id="d-cat" name="categoria" etiqueta="Categoría" value={valores.categoria} onChange={cambiar} error={errores.categoria} /></div>
            <div className="col-12 col-md-6"><CampoFormulario id="d-pa" name="principioActivo" etiqueta="Principio activo" value={valores.principioActivo} onChange={cambiar} /></div>
            <div className="col-12 col-md-6"><CampoFormulario id="d-pres" name="presentacion" etiqueta="Presentación" value={valores.presentacion} onChange={cambiar} /></div>
            <div className="col-6"><CampoFormulario id="d-stock" name="stock" tipo="number" min="0" etiqueta="Stock actual" value={valores.stock} onChange={cambiar} error={errores.stock} /></div>
            <div className="col-6"><CampoFormulario id="d-precio" name="precio" tipo="number" min="1" etiqueta="Precio unitario (CLP)" value={valores.precio} onChange={cambiar} error={errores.precio} /></div>
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">Guardar medicamento</button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => setEditando(null)}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="form-check mb-3">
        <input id="solo-criticos" type="checkbox" className="form-check-input" checked={soloCriticos} onChange={(e) => setSoloCriticos(e.target.checked)} />
        <label htmlFor="solo-criticos" className="form-check-label">Mostrar solo stock crítico (20 unidades o menos)</label>
      </div>

      {visibles.length === 0 ? (
        <p role="status" className="alert alert-light border">No hay medicamentos para mostrar.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Stock</th><th>Precio</th><th>Acciones</th></tr></thead>
            <tbody>
              {visibles.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.nombre}<div className="small text-muted">{m.principioActivo}</div></td>
                  <td>{m.categoria}</td>
                  <td>
                    {m.stock} {esStockCritico(m) && <span className="badge text-bg-danger ms-1">Stock crítico</span>}
                  </td>
                  <td>{formatoCLP(m.precio)}</td>
                  <td className="d-flex gap-1">
                    <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => abrir(m)}>Editar</button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => eliminar(m)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Medicamentos;
