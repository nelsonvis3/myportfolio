La edición de movimiento posterior agrega entrada Hyperframes, recorrido animado y tratamiento de herramientas. Sus pruebas están en [MOTION.md](MOTION.md) y [motion-review.json](validation/motion-review.json).

# Validación editorial · 14 de octubre de 2026

La edición actual incorpora la marca Fracxion, funciones y responsabilidades visibles, actualización de Ragnar, CV, metadatos y un estudio conceptual desplegable. Resultados y límites: [PORTFOLIO_REVIEW.md](PORTFOLIO_REVIEW.md). Evidencia: [editorial-review.json](validation/editorial-review.json).

Las secciones siguientes conservan la evidencia histórica de la visualización anterior y sus versiones.

# Validación — cerebro de líneas y proyectos con móvil

12 de octubre de 2026. Comprobación local en Brave/Chromium mediante Playwright, sin publicar ni verificar producción.

## Actualización: conexiones que acompañan el giro

Las cuatro etiquetas ahora orbitan con la orientación del cerebro, mantienen el texto derecho y conservan una distribución superior, media e inferior. Cada conexión se ancla a un punto de los pliegues y comparte la transformación del render WebGL. Un relevo continuo aumenta tamaño, color y luz de la habilidad de turno; las restantes permanecen más pequeñas y tenues. El pulso depende del mismo ángulo, de modo que pausa y giro inverso afectan al conjunto.

- `npm run build`: TypeScript y cuatro páginas generadas correctamente.
- `node scripts/check-brain-flow.mjs`: 11.544 combinaciones de tamaño, orientación e inclinación. Comprueba conexiones sobre la geometría, continuidad al completar una vuelta, relevo de protagonismo, límites y ausencia de cruces entre etiquetas. Son cálculos, no capturas de navegador.
- Brave/Playwright: los cuatro estados en 320, 390, 601, 768, 1024, 1440 y 1920 px. Sin desbordamiento de página, etiquetas fuera del visor ni solapamientos entre ellas en los 28 estados; botones de al menos 44 px de alto. Comprobados giro automático, desplazamiento de etiquetas y conexiones, pausa, arrastre, selección por teclado con foco y movimiento reducido dinámico. Cero errores JavaScript detectados.
- Se revisaron capturas de las orientaciones en escritorio y móvil. Las franjas verticales reservan espacio para que las etiquetas pasen de un lado al otro sin cruzarse. El visor tiene altura mínima para el ancho estrecho de la composición a 601 px.
- Comprobación adicional: el arrastre de ida y vuelta devuelve las conexiones a su posición inicial; sin WebGL permanecen el poster y la selección manual. Axe sobre el componente a 390/1440 px no detectó infracciones WCAG A/AA. Dejó el contraste sobre fondos degradados para revisión manual; este resultado no certifica accesibilidad completa.

Evidencia actual: [navegador](validation/brain-flow-browser.json), [geometría](validation/brain-flow-geometry.json), [accesibilidad y alternativas](validation/brain-flow-accessibility.json), [Frontend](screenshots/brain-flow-frontend.png), [Backend](screenshots/brain-flow-backend.png) y [Data Engineering en móvil](screenshots/brain-flow-mobile.png). Los scripts de navegador de esta actualización son temporales; la comprobación geométrica queda en `scripts/check-brain-flow.mjs`.

La revisión automática de permisos falló inicialmente por un límite de uso. Al reintentar la validación, autorizó la vista previa y el navegador; se completaron las comprobaciones indicadas arriba.

## Validación previa: cerebro de líneas y proyectos

La evidencia de las secciones siguientes corresponde a la versión anterior a las etiquetas distribuidas y sincronizadas. Sus métricas de rendimiento y pruebas completas de otras rutas no se volvieron a ejecutar para este ajuste.

La ilustración dibuja la silueta y los pliegues del cerebro con trazos azules y violetas. No muestra un material cortical opaco ni bandas horizontales. Su orientación controla las cuatro áreas de habilidades. Ragnar y RoadLedger incorporan capturas móviles reales en sus escenarios 3D, junto con LedgerCore.

| Comprobación | Evidencia |
| --- | --- |
| Build | `npm run build`: TypeScript y cuatro páginas generadas. |
| Responsive | Cuatro rutas × 320, 390, 768, 1024, 1440 y 1920 px: sin desbordamiento horizontal, imágenes rotas ni IDs duplicados. |
| Interacciones | 40 comprobaciones: cuatro áreas, selección, flechas/Home/End, arrastre, giro automático, pausa, resize, salida de pantalla y errores WebGL. |
| Alternativas | Movimiento reducido inicial y dinámico, ahorro de datos, falta de WebGL, fallo de descarga y pérdida de contexto. Poster y selección manual disponibles; con movimiento reducido o ahorro de datos no se solicita la geometría. Sin JS queda el contenido estático y el índice técnico. |
| Touch | Arrastre horizontal: 2° → 98°, con cambio a Backend. Gesto vertical: scroll de 16 a 133 px. Selección de Data Engineering y menú/Escape comprobados. |
| Proyectos | Los tres escenarios incluyen capturas móviles distintas, cargadas correctamente. Los tres casos conservan sus seis capítulos. Se corrigió una intersección visual entre teléfonos y pantallas usando capas independientes. |
| Recursos | 18 URLs locales de páginas, enlaces y recursos verificados. Cero errores inesperados HTTP o JavaScript en el recorrido. La carga de ambas geometrías y el render WebGL también se comprobaron. |
| Accesibilidad automática | Axe, WCAG 2/2.1 A-AA y 2.2 AA, más orden de encabezados: cuatro rutas × 390/1440 px, cero infracciones detectadas. |
| Revisión visual final | Cuatro orientaciones del cerebro, portada de escritorio/móvil y los tres escenarios. Etiqueta de habilidad colocada debajo del dibujo para dejar sus pliegues visibles. |

Axe deja revisiones manuales de contraste sobre degradados, pseudoelementos y capturas, además de un enlace representado por una flecha con nombre «Ir a proyectos». Los números de fondo y marcos son decorativos. El resultado automático no equivale a una certificación de accesibilidad ni a una prueba con lector de pantalla.

## Rendimiento de laboratorio

Dos cargas frías durante esta iteración, una a 390 px y otra a 1440 px. CPU 4×, descarga 1,6 Mbps, subida 750 Kbps y latencia 150 ms. El entorno utiliza WebGL por software.

| Ancho | LCP | CLS | Mayor tarea larga | Mayor evento de clic observado |
| --- | --- | --- | --- | --- |
| 390 px | 2.060 s | 0.07533 | 230 ms | 152 ms |
| 1440 px | 1.928 s | 0.00015 | 214 ms | 176 ms |

El poster aparece antes de descargar la geometría opcional (289.320 bytes entre ambos archivos). El dibujo interactivo estuvo disponible aproximadamente a los 5,1–5,3 s bajo esta limitación de red y CPU. Se redujo la malla, se prepararon los pliegues fuera del navegador y se eliminaron los cálculos de material por píxel. Los tiempos de clic no son INP formal ni datos de usuarios reales; dos cargas tampoco establecen un percentil. La última simplificación visual de trazos interiores se revisó después de esta medición.

El render está limitado a unos 30 fps, se detiene al pausar o salir de pantalla, y tiene respaldo estático. No hay dependencias de ejecución nuevas. El script Python/NumPy es solo una herramienta opcional para regenerar assets.

## Evidencia

- [Navegador y responsive](validation/brain-browser.json)
- [Interacción táctil](validation/brain-touch.json)
- [Accesibilidad automática y revisiones pendientes](validation/brain-accessibility.json)
- [Medición de rendimiento](validation/brain-performance.json)
- [Build y archivos finales](validation/brain-build.json)
- [Portada con render activo](screenshots/brain-live-desktop.png), [móvil](screenshots/brain-touch.png)
- [Ragnar en escritorio](screenshots/brain-ragnar-1440.png) y [móvil](screenshots/brain-ragnar-390.png)
- [RoadLedger en escritorio](screenshots/brain-road-1440.png) y [móvil](screenshots/brain-road-390.png)

Los informes `galaxy-*` y `planet-*` son históricos. [La validación de galaxias](VALIDATION-GALAXY.md) conserva los controles y métricas de aquella versión; no describe la animación actual. La procedencia de capturas, malla y contenido técnico está en [CONTENT_EVIDENCE.md](CONTENT_EVIDENCE.md).

## Límites y reproducción

No se probaron Safari, Firefox, teléfonos físicos ni lectores de pantalla. No se ejecutaron compras ni rutas reales en las aplicaciones mostradas. El CV y los casos conservan su evidencia técnica anterior; no se reejecutaron las suites de esos repositorios.

Para revisar: `npm run dev`, abrir `http://127.0.0.1:3000`, girar el cerebro con mouse/touch, probar pausa y selectores, y abrir los tres casos. El servidor no tiene recarga automática: compilar y recargar después de editar. La automatización de esta sesión usó scripts temporales `/tmp/brain-check.mjs`, `/tmp/brain-touch.mjs`, `/tmp/brain-axe.mjs` y `/tmp/brain-performance-probe.mjs`, con Playwright y axe ya instalados en el entorno; esas rutas no son dependencias del portfolio.
