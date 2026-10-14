import { Link } from "react-router-dom";

function NoEncontrada() {
  return (
    <main className="container py-5">
      <h1>Página no encontrada</h1>
      <p>La dirección que ingresaste no corresponde a ninguna pantalla.</p>
      <Link to="/">Ir al inicio</Link>
    </main>
  );
}

export default NoEncontrada;
