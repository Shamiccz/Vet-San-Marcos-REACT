// Punto de entrada de Karma: carga automáticamente todos los archivos *.spec.js(x) de /tests.
const contexto = require.context("./", true, /\.spec\.jsx?$/);
   contexto.keys().forEach(contexto);
