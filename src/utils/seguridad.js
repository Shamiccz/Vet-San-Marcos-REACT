// Hash SHA-256 de la clave (Web Crypto). Es una simulación para el frontend:
// la autenticación real (JWT, bcrypt, etc.) se implementa en el backend Spring Boot.
export async function hashClave(clave) {
  const datos = new TextEncoder().encode(clave);
  const resumen = await crypto.subtle.digest("SHA-256", datos);
  return Array.from(new Uint8Array(resumen))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generarToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
