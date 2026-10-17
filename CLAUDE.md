# Portfolio de Nelson Sivisstum

Sitio estático en TypeScript (español e inglés) con una escena three.js en la home. Ver README.md para la estructura general.

## Trabajo

- Responder y escribir textos en español (rioplatense); el contenido en inglés va en `src/content/en.ts`.
- El commit y el push los hace Nelson. Dejar los cambios sin commitear y pasarle el comando al final.
- Compilar: `npm run build` (tsc + esbuild, genera `dist/`). Servir: `PORT=3311 node build/server.js`. No hay recarga automática.
- Si el build falla con "Cannot find module 'lenis'", falta `npm install`.
- Verificar en el navegador antes de dar algo por terminado, en escritorio (1280–1440) y en celular (390×844, también 375×667). Brave está en `/usr/bin/brave`; para WebGL headless usar `--use-angle=swiftshader --enable-unsafe-swiftshader`.

## Home 3D (`src/three/`)

- `scene.ts`: escena, scroll (GSAP ScrollTrigger + Lenis) y layout. El canvas mide 100lvh: medir con `canvas.clientHeight`, no `innerHeight`.
- `carousel.ts`: cada proyecto es la captura de escritorio (`images[0]`) más la de celular (`phoneShot`); no usa video. El giro es un resorte sobre `rotTarget + scrollRotation()`.
- El encabezado se esconde durante el recorrido (`body.nav-auto`) y `client.ts` lo muestra con `.nav-peek`.
- El diálogo de detalle necesita `data-lenis-prevent` para poder scrollear.

## Casos de estudio y clips

- "Cómo se usa" toma los clips de `public/clips/<proyecto>-<n>-desktop.mp4` y, si existe, `-mobile.mp4`, cada uno con su póster `.webp`. El build los detecta solo.
- Calidad pedida: 60 fps reales, resolución nativa (1920×1080 o 1896×928 escritorio, 780×1688 celular), sin recortes ni textos agregados. Medir los cuadros distintos con `mpdecimate` antes de entregar.
- Nunca mostrar datos personales en clips o capturas (emails, teléfono): desenfocarlos.
- Las grabaciones originales de Nelson están en `~/Proyectos/videos-port/`. Ragnar está en `~/Documentos/ragnar-v2`, Fracxion en `~/Proyectos/facturador-saas-api`.
- Al grabar las apps no confirmar pedidos ni guardar datos: el stock local de Ragnar es real (la creatina tiene 1 unidad).
