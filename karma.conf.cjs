// Configuración de Karma + Jasmine para probar componentes React.
// - karma-webpack empaqueta las pruebas (tests/cargar-pruebas.js) con Babel (JSX).
// - babel-plugin-istanbul instrumenta el código de src/ para medir cobertura.
// - karma-coverage genera el reporte en /coverage (abrir coverage/index.html).
// Requiere Google Chrome instalado (o definir CHROME_BIN).
module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],
    files: [{ pattern: "tests/cargar-pruebas.cjs", watched: false }],
    preprocessors: { "tests/cargar-pruebas.cjs": ["webpack"] },
    webpack: {
      mode: "development",
      devtool: false,
      resolve: { extensions: [".js", ".jsx"] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { targets: { chrome: "100" } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
                plugins: [
                  ["istanbul", { include: ["src/**"], exclude: ["tests/**"] }],
                ],
              },
            },
          },
        ],
      },
    },
    reporters: ["progress", "coverage"],
    coverageReporter: {
      dir: "coverage",
      reporters: [{ type: "html" }, { type: "text-summary" }, { type: "lcovonly" }],
    },
    browsers: ["ChromeHeadlessSinSandbox"],
    customLaunchers: {
      ChromeHeadlessSinSandbox: { base: "ChromeHeadless", flags: ["--no-sandbox"] },
    },
    client: { jasmine: { random: true } },
    singleRun: false,
  });
};
