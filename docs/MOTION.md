# Movimiento del portfolio · 14 de octubre de 2026

## Entrada con Hyperframes

La portada incluye una composición HTML/SVG de líneas neuronales. Sus trazos se completan, aparecen el nombre y las áreas de trabajo, y una transición de cortina y fundido muestra el portfolio. La secuencia tiene 3,15 segundos de timeline y una salida de 650 ms. Es una presentación de marca: la línea inferior representa el avance de la animación, no una medición de descargas.

La integración usa los paquetes oficiales de [Hyperframes](https://github.com/heygen-com/hyperframes): `@hyperframes/player@0.8.155`, `@hyperframes/core@0.8.155` y `gsap@3.15.0`, fijados en `package-lock.json`. El [player oficial](https://github.com/heygen-com/hyperframes/blob/main/packages/player/README.md) reproduce una composición con timeline GSAP registrado en `window.__timelines`. Se consultó también su documentación mediante Context7.

El build copia únicamente los archivos de navegador necesarios a `dist/intro/vendor/`, junto con la licencia de Hyperframes y las referencias de terceros. No se instala la CLI de producción de videos ni se requieren FFmpeg, React o un backend para servir el portfolio. Durante la visita, composición, player, runtime, GSAP y fuentes se cargan desde el mismo sitio.

- La introducción se reproduce en el primer ingreso a la portada por pestaña. `sessionStorage` conserva únicamente el indicador de presentación completada.
- Para volver a verla en la vista previa: `http://127.0.0.1:4173/?intro=1`.
- Los enlaces con fragmento, los casos de estudio, movimiento reducido y ahorro de datos abren directamente el contenido.
- Se puede omitir con el botón o Escape. El foco permanece en la presentación y vuelve al contenido al terminar.
- Mientras se reproduce, el contenido de fondo utiliza `inert`, queda fuera del árbol de accesibilidad y no recibe interacción. El scroll se libera al salir.
- Cambiar el tamaño o esconder la pestaña termina la presentación. Un fallo de carga libera el contenido; un temporizador de 6,5 segundos también recupera el sitio si falla el módulo cliente.
- Sin JavaScript, el HTML del portfolio permanece disponible y el overlay no se muestra.

| Archivo | Responsabilidad |
| --- | --- |
| `public/intro/neural/index.html` | Composición editable, SVG, duración y timeline. |
| `src/render/intro.ts` | Markup, condiciones iniciales y recuperación si falla el cliente. |
| `src/visual/intro.ts` | Reproductor, omisión, foco, sesión y transición al contenido. |
| `src/build.ts` | Copia reproducible de dependencias y licencia al artefacto estático. |
| `src/styles.css` | Overlay y transición visual. |

## Recorrido Input → Result

El estudio de automatización conserva sus botones y paneles. La sección se muestra directamente en la página. Al entrar en pantalla, una línea avanza por Input → API → Intelligence → Action → Result. El foco visual cambia al llegar al siguiente nodo; el foco del teclado permanece bajo control del visitante.

Cada etapa espera 2,6 segundos antes de recorrer la conexión durante 1,4 segundos. Al llegar a Result, el recorrido se pausa automáticamente y conserva la línea completa. El botón Reiniciar recorrido permite volver a Input de forma explícita. El panel reserva la altura máxima de sus cinco contenidos para evitar saltos de la página.

- Pausar/Reanudar controla el recorrido.
- Elegir una etapa con clic o teclado detiene el avance automático y conserva la selección. Reanudar continúa desde allí.
- Se suspende al salir de pantalla, esconder la pestaña o enfocar sus botones/paneles con el teclado.
- Con movimiento reducido no hay recorrido automático; los controles manuales siguen funcionando.
- En móvil, la línea pasa a orientación vertical y se recalcula al cambiar el tamaño. Sus extremos se obtienen de los centros reales de los iconos.

El controlador está en `src/visual/process-motion.ts`. Reutiliza la selección accesible de `src/client.ts`; la animación no ejecuta APIs ni automatizaciones reales.

## Codex y Claude Code

El tratamiento es intencionalmente leve: un trazo de escaneo sobre el borde superior, esquinas técnicas y pequeños símbolos SVG decorativos. Las dos entradas alternan el escaneo; el texto permanece fijo. El efecto se pausa fuera de pantalla, en pestañas ocultas y con movimiento reducido. Se mantienen el tamaño de letra y la jerarquía de los proyectos.

## Validación

- Build TypeScript y generación estática correctos; `git diff --check` sin errores.
- 38 comprobaciones de movimiento y alternativas correctas en Brave/Chromium con Playwright. Se observó el ciclo completo 0 → 1 → 2 → 3 → 4 → 0, la variación del trazo durante los recorridos y la estabilidad de altura del panel.
- Verificados omisión, Escape, primera visita por pestaña, foco/inert, salida y regreso a pantalla, cierre del estudio, pausa/reanudación, selección manual, teclado, movimiento reducido inicial/dinámico, ahorro de datos y alternativa sin JavaScript.
- Verificados los fallos de composición y del módulo cliente: ambos dejan el portfolio accesible.
- Siete anchos entre 320 y 1920 px sin desbordamiento del estudio. Los extremos del SVG coinciden con los centros de los iconos en escritorio y móvil.
- Axe sobre el estudio abierto a 390/1440 px: cero infracciones detectadas en las reglas WCAG A/AA examinadas. Los fondos complejos requieren revisión manual de contraste; no es una certificación.
- Regresión adicional: cuatro páginas × 390/1440 px, imágenes y encabezados correctos; pestañas de Ragnar/RoadLedger operativas. Cero errores JavaScript inesperados en los recorridos.
- Revisión visual de la introducción en dos momentos de escritorio y en móvil, del trazo en movimiento en ambos formatos y de las entradas de herramientas. Se comprobó que las descargas de la introducción son locales.

Evidencia: [reporte completo](validation/motion-review.json), [trazo en escritorio](screenshots/motion-pipeline-travel-1440.png), [trazo móvil](screenshots/motion-pipeline-travel-390.png), [entrada móvil](screenshots/motion-intro-390.png) y [tratamiento de herramientas](screenshots/motion-tools-1440.png).

Las pruebas de negocio de Ragnar/Fracxion y la publicación en Vercel no forman parte de esta edición de movimiento. Los scripts temporales de revisión se eliminan al terminar; las fuentes de animación, los recursos necesarios y la evidencia se conservan.

## Corrección de presentación

A pedido del propietario, se retiró el desplegable que ocultaba Systems that work smarter y sus cinco etapas. La sección y las que siguen vuelven a formar parte del recorrido visible. Se retiró únicamente el enlace Descargar CV del hero, conservando sus enlaces a proyectos y contacto y su distribución existente. La descarga permanece en Sobre mí. Se conservan las animaciones solicitadas.

El recorrido ahora se detiene automáticamente en Result con el trazo completo; Reiniciar recorrido vuelve a Input solo por acción del visitante.

Validación de esta corrección: build correcto, 52 comprobaciones de visibilidad, selección y pausa en Result superadas en 320/390/768/1440 px, sin errores JavaScript. Evidencia: [visibility-restoration.json](validation/visibility-restoration.json). Se comprobó además que los cambios de código de esta corrección se limitan al hero y a la sección de automatización.
