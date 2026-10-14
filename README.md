# Nelson Sivisstum — Portfolio

Portfolio de desarrollo Full Stack con React, Next.js y Django. Presenta funciones, responsabilidades y decisiones técnicas de Fracxion, Ragnar Suplementos y RoadLedger. Dirección visual OBSIDIAN: negro carbón, acentos turquesa, tipografía de gran escala, un cerebro de líneas luminosas y tres casos de estudio completos. Contenido en español con títulos de sección en inglés.

La aplicación actual es un **sitio estático generado con TypeScript**. `src/build.ts` produce cuatro páginas HTML completas en `dist/`; un script pequeño agrega las interacciones del navegador. No requiere React, Next.js, base de datos ni servicios externos para funcionar. La entrada utiliza el player de Hyperframes y GSAP, servidos localmente desde el artefacto estático.

## Ejecutar localmente

Requisitos: Node.js 20 o superior y npm.

```sh
npm ci
npm run dev
```

Abrir `http://127.0.0.1:3000`. `dev` compila y arranca el servidor; **no tiene recarga automática**. Después de editar, ejecutar `npm run build` en otra terminal y recargar el navegador. Si cambia `src/server.ts`, reiniciar el servidor.

```sh
npm run build
npm start
```

El build valida TypeScript y regenera `dist/`. Este directorio ya estaba versionado y se mantiene actualizado. `build/` contiene JavaScript intermedio y se ignora en Git.

Para elegir puerto o interfaz:

```sh
PORT=4173 npm start
HOST=0.0.0.0 PORT=3000 npm start
```

Por defecto el servidor escucha solo en `127.0.0.1`. Es una utilidad de previsualización; para publicar, utilizar hosting estático.

## Editar contenido

| Archivo | Contenido |
| --- | --- |
| `src/data/profile.ts` | Nombre, rol, presentación y descripción SEO. |
| `src/data/ledgercore.ts` | Proyecto destacado y desafíos de ingeniería. |
| `src/data/projects.ts` | Orden y resúmenes de los tres proyectos. |
| `src/data/case-studies.ts` | Los seis capítulos, arquitectura y procesos de Ragnar y RoadLedger. |
| `src/data/constellation.ts` | Las cuatro áreas y habilidades del cerebro interactivo. |
| `src/data/workflow.ts` | Codex, Claude Code, cinco etapas de desarrollo y cinco nodos del concepto de automatización. |
| `src/data/skills.ts` | Siete categorías de habilidades, con las áreas en exploración identificadas. |
| `src/data/timeline.ts` | Trayectoria. |
| `src/data/education.ts` | Formación declarada. |
| `src/data/now.ts` | Foco actual. |
| `src/data/socials.ts` | Contacto, redes, CV y dominio opcional. |
| `src/build.ts` | Generación de las cuatro rutas, assets y metadatos de publicación. |
| `src/render/` | Plantillas modulares: layout, portada, IA/automatización, perfil y casos de estudio. |
| `src/styles.css`, `src/brain.css`, `src/showcase.css` y `src/cases.css` | Identidad visual, portada, casos, responsive, impresión y movimiento reducido. |
| `src/client.ts` | Navegación, diagramas con pestañas, esquema de tenants, visor y mejoras progresivas. |
| `src/visual/brain.ts` | Contornos corticales WebGL, giro por mouse/touch/teclado, selección por orientación y pausa. |
| `src/visual/brain-flow.ts` | Proyección de conexiones sobre los pliegues, órbitas de etiquetas y transición de protagonismo según el giro. |
| `src/render/showcase.ts` y `src/visual/projects.ts` | Presentaciones 3D de los tres proyectos y perspectiva al mover el mouse. |
| `public/` | Capturas reales, fuentes con licencia, favicon y PDF actualizado del CV. |
| `docs/cv/nelson-sivisstum.html` | Fuente editable del CV de una página A4. |

Fracxion es el proyecto local `facturador-saas-api`. El identificador interno `ledgercore` se conserva en los nombres de archivos, imágenes y la ruta `/proyectos/ledgercore/` para mantener los enlaces existentes; el nombre visible coincide con la aplicación y su repositorio. La evidencia técnica y los límites de lo afirmado están en [docs/CONTENT_EVIDENCE.md](docs/CONTENT_EVIDENCE.md).

El código de Fracxion enlaza a [fracxion-facturador](https://github.com/nelsonvis3/fracxion-facturador). No se enlaza una demo pública de este sistema. Cada proyecto ofrece acceso a su caso y a su repositorio desde la portada.

## CV descargable

[public/cv.pdf](public/cv.pdf) se actualizó con Fracxion, Ragnar y RoadLedger, el stack principal y el objetivo de primera oportunidad profesional. La fuente editable está en [docs/cv/nelson-sivisstum.html](docs/cv/nelson-sivisstum.html); las instrucciones de edición y exportación, en [docs/cv/README.md](docs/cv/README.md).

## Publicar

1. Revisar el dominio de `src/data/socials.ts`; para otro hosting, definir `SITE_URL`.
2. Ejecutar `npm ci` y `npm run build`.
3. Publicar el contenido de `dist/` como sitio estático, con soporte de `index.html` en subdirectorios.

Ejemplo de configuración: comando de build `npm run build`, directorio de salida `dist`, framework **Other / Static**. No configurar este repositorio como una aplicación Next.js.

`SITE_URL` permite reemplazar el dominio público por una URL absoluta HTTP(S), sin una ruta base. Se usa para canonical, Open Graph y sitemap. Por defecto se utiliza `https://nelsonvis-portfolio.vercel.app`, proporcionado por el propietario y consultado durante esta revisión. Si cambia el dominio, actualizar `src/data/socials.ts` o definir `SITE_URL` al compilar. Las rutas de assets parten de `/`, por lo que se requiere servir el sitio desde la raíz de su dominio.

La publicación debe hacerse sobre el hosting elegido por el propietario. Esta reconstrucción no publica ni verifica una nueva versión en producción.

## Interacciones y accesibilidad

- Menú móvil con estado expandido y cierre con Escape o selección de enlace.
- Cinco etapas de desarrollo: Plan → Build → Review → Test → Ship. Plan incluye el diseño.
- Estudio de automatización opcional en un bloque desplegable, con cinco nodos: Input → API → Intelligence → Action → Result. No ejecutan servicios reales.
- Los diagramas de portada y los procesos de Ragnar/RoadLedger funcionan con teclado: flechas, Home y End. Automatización, checkout y planificación pasan a orientación vertical en móvil.
- Los tres proyectos tienen Overview, arquitectura, desafíos, decisiones y resultados, con índice y navegación al siguiente caso.
- Ejemplo interactivo de contexto por empresa con estado anunciado. Es un diagrama, no una conexión al SaaS.
- Capturas ampliables mediante un diálogo nativo con restauración de foco. Sin JavaScript, se abren los archivos originales.
- Contenido disponible sin JavaScript, foco visible, enlace para saltar al contenido y respeto por `prefers-reduced-motion`.
- Space Grotesk e Instrument Sans se sirven localmente con sus licencias OFL; no se consulta Google Fonts en tiempo de ejecución.
- La portada muestra un cerebro formado solo por líneas luminosas azules y violetas que siguen los pliegues de dos hemisferios. Gira una vuelta en aproximadamente **80 segundos de animación activa**; puede pausarse y girarse con arrastre horizontal de mouse o touch. El gesto vertical permite seguir desplazándose por la página.
- La orientación revela Frontend, Backend, Bases de datos o Desarrollo con IA. Los selectores y las flechas izquierda/derecha ofrecen la misma navegación con teclado; Home/End seleccionan los extremos. El foco pausa el giro para facilitar la lectura. Después de arrastrar, si el giro estaba activo, retoma lentamente tras dos segundos.
- Las etiquetas se distribuyen arriba, al medio y abajo. Sus conexiones nacen de puntos reales de los trazos y usan la misma transformación que el cerebro. Las etiquetas acompañan el giro con texto siempre derecho; la habilidad de turno crece y se ilumina mientras las demás retroceden visualmente. El pulso también depende del ángulo: se congela al pausar y retrocede al girar en sentido contrario. Las posiciones reservan espacio para evitar cruces entre etiquetas.
- El controlador se carga después de la página y solo en el inicio. WebGL dibuja la silueta y las curvas de los pliegues mediante trazos; una pasada invisible de profundidad separa los pliegues sin pintar una superficie sólida. Limita el render a unos 30 fps y detiene el trabajo al pausar, salir de pantalla o esconder la pestaña. Con movimiento reducido, ahorro de datos o falta de WebGL permanece el poster; la selección de habilidades sigue funcionando. Sin JavaScript permanece el índice técnico completo.
- Selected Projects presenta las capturas reales sobre pantallas con perspectiva, profundidad, sombras y acentos propios. La inclinación responde al mouse; no agrega movimiento continuo ni captura gestos táctiles. Los tres escenarios incluyen capturas reales de escritorio y móvil y enlazan a sus casos completos.
- La geometría local (`public/models/cortex.bin` y `folds.bin`, unos 283 KiB en total) deriva de fsaverage5 distribuido por Nilearn. Su procedencia y licencia se conservan en `public/models/`. Se descarga solo cuando están permitidos los efectos; el poster no necesita la malla. Las líneas y pulsos son una interpretación artística, no datos de actividad cerebral. `scripts/build-brain-folds.py` permite regenerar las curvas desde la malla fuente; no forma parte del build normal.
- Capturas con dimensiones explícitas, carga diferida y versiones WebP de Ragnar/RoadLedger; originales PNG conservados.

Después de compilar, `node scripts/check-brain-flow.mjs` comprueba la proyección, el relevo entre habilidades y los límites de las etiquetas durante varias vueltas e inclinaciones. Es una comprobación matemática; la revisión en navegador se documenta por separado en `docs/VALIDATION.md`.

## Brief y dirección artística

Los dos prompts originales se conservan en [docs/briefs/](docs/briefs/README.md), con el artístico en primer lugar. La investigación está en [REFERENCES.md](docs/design/REFERENCES.md); el concepto en [CONCEPT.md](docs/design/CONCEPT.md), y los wireframes previos en [wireframes.svg](docs/design/wireframes.svg).

Las pruebas realizadas y sus límites están en [docs/VALIDATION.md](docs/VALIDATION.md).

## Revisión editorial del 14 de octubre de 2026

Diagnóstico, fuentes, referencias y alcance: [docs/PORTFOLIO_REVIEW.md](docs/PORTFOLIO_REVIEW.md). Las comprobaciones de esta versión se documentan allí, separadas de la validación histórica.

La imagen para compartir está en `public/img/social-preview.png`; su fuente editable es `docs/social-preview.html`. Se renderiza a 1200 × 630 con las fuentes locales y el poster del cerebro.

## Entrada y movimiento

Introducción neuronal con Hyperframes, recorrido automático Input → Result y escaneo sutil de las entradas de Codex/Claude Code. Comportamiento, archivos, accesibilidad, repetición y evidencia: [docs/MOTION.md](docs/MOTION.md). El build prepara las dependencias locales de la animación; conservar `dist/intro/vendor/` al publicar.
