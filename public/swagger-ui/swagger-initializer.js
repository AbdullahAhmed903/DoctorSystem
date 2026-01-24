window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">

  // Swagger UI setup
  window.ui = SwaggerUIBundle({
    url: "/swagger.json", // رابط Swagger spec الخاص بمشروعك
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout",
    validatorUrl: null // لتعطيل validator خارجي لو في مشاكل HTTPS
  });

  //</editor-fold>
};
