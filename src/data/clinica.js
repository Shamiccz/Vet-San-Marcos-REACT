// Datos de contacto y ubicación. La dirección es referencial: reemplázala por la real.
export const CLINICA = {
  nombre: "Veterinaria San Marcos",
  direccion: "Av. Libertador Bernardo O'Higgins 1234, Rancagua",
  telefono: "+56 72 255 0000",
  email: "contacto@veterinariasanmarcos.cl",
  horario: "Lunes a viernes, 09:00 a 18:00",
  lat: -34.1703,
  lng: -70.7407,
};

export function urlIndicaciones(origen) {
  const base = `https://www.google.com/maps/dir/?api=1&destination=${CLINICA.lat},${CLINICA.lng}`;
  return origen ? `${base}&origin=${origen.lat},${origen.lng}` : base;
}
