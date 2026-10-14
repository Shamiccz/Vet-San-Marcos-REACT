// Validaciones de formularios.
// Convención: cada validador devuelve un texto con el mensaje de error, o "" (texto vacío)
// cuando el valor es válido. Así los formularios pueden guardar el resultado directamente
// en su estado de errores y mostrarlo junto al campo.
 
/**
 * Comprueba que un campo no esté vacío.
 * Convierte el valor a texto (null y undefined cuentan como vacío), le quita los espacios
 * de los extremos con trim() y, si no queda nada, devuelve un mensaje con el nombre del campo.
 * Un valor solo con espacios también se considera vacío.
 * @param valor    Lo que escribió el usuario.
 * @param etiqueta Nombre del campo para el mensaje (por ejemplo "Nombre").
 */
export function validarRequerido(valor, etiqueta = "Este campo") {
  return String(valor ?? "").trim() === "" ? `Completa el campo «${etiqueta}».` : "";
}
 
/**
 * Valida el correo electrónico.
 * Primero revisa que no esté vacío. Luego aplica una expresión regular que exige tres partes:
 * texto sin espacios ni "@", una "@", y un dominio con un punto y al menos 2 letras al final
 * (por ejemplo nombre@correo.cl). Es una validación de formato: no comprueba que el correo exista.
 */
export function validarEmail(valor) {
  if (!valor || !valor.trim()) return "El correo es obligatorio.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())
    ? ""
    : "Ingresa un correo válido, por ejemplo nombre@correo.cl.";
}
 
/**
 * Valida la clave según la política del sistema. Revisa en este orden y se detiene
 * en la primera falla: que exista, que tenga al menos 8 caracteres y que mezcle
 * al menos una letra (A-Z, a-z) y un número.
 */
export function validarClave(valor) {
  if (!valor) return "La clave es obligatoria.";
  if (valor.length < 8) return "La clave debe tener al menos 8 caracteres.";
  if (!/[A-Za-z]/.test(valor) || !/\d/.test(valor))
    return "La clave debe incluir letras y números.";
  return "";
}
 
/**
 * Valida el teléfono, que es un campo opcional: si viene vacío, es válido.
 * Si se informa, debe empezar con un "+" opcional y un dígito, seguido de 7 a 13
 * dígitos o espacios (en total, entre 8 y 14 caracteres numéricos). Ejemplo: "+56 9 1234 5678".
 */
export function validarTelefono(valor) {
  if (!valor || !valor.trim()) return "";
  return /^\+?\d[\d\s]{7,13}$/.test(valor.trim())
    ? ""
    : "El teléfono debe tener entre 8 y 14 dígitos.";
}
 
/**
 * Indica si un objeto de errores está limpio.
 * Recibe el resultado de validarRegistro, validarMascota o validarCita (un objeto con un
 * mensaje por campo) y devuelve true solo si todos los mensajes están vacíos.
 * Los formularios la usan para decidir si pueden enviar los datos.
 */
export function sinErrores(errores) {
  return Object.values(errores).every((e) => !e);
}
 
/**
 * Valida el formulario de registro de una cuenta nueva.
 * Reúne en un solo objeto el error de cada campo: nombre obligatorio, correo con formato
 * válido, teléfono opcional pero correcto, clave que cumpla la política y confirmación
 * idéntica a la clave. Que el correo no esté repetido se comprueba aparte, en AuthContext,
 * porque necesita consultar los usuarios existentes.
 */
export function validarRegistro(datos) {
  return {
    nombre: validarRequerido(datos.nombre, "Nombre"),
    email: validarEmail(datos.email),
    telefono: validarTelefono(datos.telefono),
    clave: validarClave(datos.clave),
    confirmacion: datos.clave !== datos.confirmacion ? "Las claves no coinciden." : "",
  };
}
 
/**
 * Valida el formulario de una mascota (alta o edición).
 * - nombre y especie: obligatorios.
 * - fechaNacimiento: obligatoria y no puede ser posterior a hoy. Se comparan como texto
 *   porque el formato AAAA-MM-DD ordena igual que las fechas.
 * - pesoKg: debe ser un número mayor que 0 y de hasta 120 kg. Si el campo está vacío o
 *   tiene texto, Number() da 0 o NaN y la comparación falla, así que también se rechaza.
 * @param datos Valores del formulario.
 * @param hoy   Fecha actual en formato AAAA-MM-DD (se recibe como parámetro para poder probar la función).
 */
export function validarMascota(datos, hoy) {
  const peso = Number(datos.pesoKg);
  return {
    nombre: validarRequerido(datos.nombre, "Nombre"),
    especie: validarRequerido(datos.especie, "Especie"),
    fechaNacimiento: !datos.fechaNacimiento
      ? "La fecha de nacimiento es obligatoria."
      : datos.fechaNacimiento > hoy
        ? "La fecha de nacimiento no puede ser futura."
        : "",
    pesoKg: !(peso > 0 && peso <= 120) ? "Ingresa un peso entre 0,1 y 120 kg." : "",
  };
}