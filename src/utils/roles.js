export const ROLES = {
  ADMIN: "administrador",
  RECEPCION: "recepcionista",
  VETERINARIO: "veterinario",
  DUENO: "dueno",
};

export const ETIQUETA_ROL = {
  administrador: "Administrador",
  recepcionista: "Recepcionista",
  veterinario: "Médico veterinario",
  dueno: "Dueño de mascota",
};

export const PERSONAL_CLINICA = [ROLES.ADMIN, ROLES.RECEPCION, ROLES.VETERINARIO];

export function esPersonalClinica(rol) {
  return PERSONAL_CLINICA.includes(rol);
}

// Pantalla a la que llega cada rol después de iniciar sesión.
export function rutaInicio(rol) {
  if (rol === ROLES.ADMIN) return "/admin";
  if (esPersonalClinica(rol)) return "/gestion/citas";
  return "/mis-citas";
}
