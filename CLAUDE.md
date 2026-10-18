# Portfolio de Nelson Sivisstum

Sitio estático en TypeScript (español e inglés), con scroll suave (Lenis + GSAP) en la home. Ver README.md para la estructura general.

## Trabajo

- Responder y escribir textos en español (rioplatense); el contenido en inglés va en `src/content/en.ts`.
- El commit y el push los hace Nelson. Dejar los cambios sin commitear y pasarle el comando al final.
- Compilar: `npm run build` (tsc + esbuild, genera `dist/`). Servir: `PORT=3311 node build/server.js`. No hay recarga automática.
- Si el build falla con "Cannot find module 'lenis'", falta `npm install`.
- Verificar en el navegador antes de dar algo por terminado, en escritorio (1280–1440) y en celular (390×844, también 375×667). Brave está en `/usr/bin/brave`; para WebGL headless usar `--use-angle=swiftshader --enable-unsafe-swiftshader`.

## Home (`src/render/home.ts`, `src/web/`)

- Paleta carbón cálido y ámbar, sin tema claro. Tokens en `:root` de `src/styles.css`.
- `client.ts`: menú, caso de estudio de la home (las tarjetas de proyectos y las pestañas cambian el caso en el lugar, con `#caso-<id>`), clips, puntero (destello + estela en canvas 2D) y brillo de tarjetas.
- `motion.ts` (se carga con `import()`): Lenis, reveals, texto que se enciende por palabra y la fila de proyectos fija con scroll horizontal (GSAP ScrollTrigger).
- Mientras se ven los casos, el encabezado se esconde (`html.in-cases`) y quedan arriba las pestañas.
- Imágenes opcionales: `public/img/hero.(webp|jpg|png)` (fondo del hero) y `public/img/nelson.*` (foto de Sobre mí). El build las detecta solo.
- Contacto: formulario con Web3Forms; la clave va en `contactForm.accessKey` de `src/content/site.ts` (vacía = solo botón de correo).
- Imágenes para compartir (Open Graph) y banner de LinkedIn: `docs/social/card.html`, se regeneran con `node docs/social/capture.mjs`.
- Fluidez: nada de `filter: blur` animado ni `backdrop-filter` en elementos chicos; las animaciones en bucle se pausan fuera de pantalla. Medir fps antes de sumar efectos.

## Casos de estudio y clips

- "Cómo se usa" toma los clips de `public/clips/<proyecto>-<n>-desktop.mp4` y, si existe, `-mobile.mp4`, cada uno con su póster `.webp`. El build los detecta solo.
- Calidad pedida: 60 fps reales, resolución nativa (1920×1080 o 1896×928 escritorio, 780×1688 celular), sin recortes ni textos agregados. Medir los cuadros distintos con `mpdecimate` antes de entregar.
- Nunca mostrar datos personales en clips o capturas (emails, teléfono): desenfocarlos.
- Las grabaciones originales de Nelson están en `~/Proyectos/videos-port/`. Ragnar está en `~/Documentos/ragnar-v2`, Fracxion en `~/Proyectos/facturador-saas-api`.
- Al grabar las apps no confirmar pedidos ni guardar datos: el stock local de Ragnar es real (la creatina tiene 1 unidad).
