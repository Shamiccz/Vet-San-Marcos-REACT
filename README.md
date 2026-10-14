# Veterinaria San Marcos (frontend React)

Evaluación Parcial 2 · DSY1104 Desarrollo FullStack II. Frontend en **React 18 + Vite + Bootstrap 5**, con datos simulados en JavaScript (CRUD sobre `localStorage`) y pruebas unitarias con **Jasmine + Karma**.

## Cómo ejecutarlo

```bash
npm install
npm run dev        # aplicación en http://localhost:5173
npm test           # pruebas Jasmine/Karma (requiere Google Chrome) + reporte de cobertura
npm run build      # versión de producción
```

El reporte de cobertura queda en `coverage/index.html` (úsalo para el documento de cobertura de testing). Si Chrome no está en la ruta habitual, define `CHROME_BIN`.

El logo está en `public/logo.svg` (también es el favicon). Se muestra en la barra de navegación, el login y el registro.

## Cuentas de demostración

| Rol | Correo | Clave |
|---|---|---|
| Administrador | admin@sanmarcos.cl | Admin123 |
| Recepcionista | recepcion@sanmarcos.cl | Recep123 |
| Médico veterinario | vet@sanmarcos.cl | Vet12345 |
| Dueño | camila@correo.cl | Dueno123 |

Para volver a los datos de ejemplo, borra el `localStorage` del sitio.

## Pantallas

- **Públicas:** inicio de sesión y registro (regla de seguridad del caso: todo lo demás exige sesión).
- **Todos los usuarios:** catálogo de servicios con filtros, detalle, mapa Leaflet con "cómo llegar".
- **Dueño:** mis mascotas (CRUD, historial clínico y vacunas con aviso de refuerzo), mis citas, solicitud de cita, cita registrada / error.
- **Personal:** gestión de citas (confirmar, proponer otro horario, cancelar, marcar atendida), pacientes y ficha clínica (consultas y vacunas lo registra el veterinario o el administrador).
- **Administrador:** panel, usuarios y roles, medicamentos con stock crítico, reportes de atenciones y pacientes nuevos por mes.

## Mapa del código

```
src/data/        servicios.js y medicamentos.js (desde el Excel), semillas.js, db.js (CRUD), clinica.js
src/utils/       citas, validaciones, reportes, inventario, catalogo, roles, formato, seguridad
src/context/     AuthContext.jsx (sesión con token y expiración)
src/components/  piezas reutilizables con una sola responsabilidad
src/pages/       pantallas (gestion/ y admin/ por rol)
tests/           specs Jasmine; helpers.jsx monta componentes y simula eventos
```

## Qué evalúa cada parte (rúbrica)

- **React, props y estado:** `TarjetaServicio` (props y callbacks), `FiltroServicios` (componente controlado), `FormularioCita` y `FormularioMascota` (estado local y validación).
- **Bootstrap responsivo:** grilla `col-12 col-md-6 col-xl-4`, `Navbar expand="lg"` con menú hamburguesa, tablas `table-responsive`.
- **Archivo de datos con CRUD:** `src/data/db.js` (`listar`, `obtener`, `crear`, `actualizar`, `eliminar`).
- **Pruebas:** renderizado (correcto y condicional), props, estado, eventos y lógica de negocio.
- **Mocks:** `jasmine.createSpy` para callbacks, `almacenamientoMemoria()` en lugar de `localStorage`, y `AuthContext.Provider` con un usuario falso.

## Decisiones y supuestos

- Atención de lunes a viernes, bloques de 30 min de 09:00 a 17:30, hasta 3 citas por bloque (3 veterinarios).
- Stock crítico: 20 unidades o menos.
- La seguridad de este frontend es simulada (hash SHA-256 y sesión en `localStorage`). La autenticación real corresponde al backend.
- Se agregó el rol **veterinario** a los tres obligatorios.
