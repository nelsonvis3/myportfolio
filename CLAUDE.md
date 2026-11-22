# Portfolio de Nelson Sivisstum

Portfolio bilingüe (ES/EN) en [nelsonsivisstum.vercel.app](https://nelsonsivisstum.vercel.app/). Repo público `nelsonvis3/myportfolio`: lo ven reclutadores, así que no dejar notas de trabajo, patches ni capturas con datos personales en el repo.

## Stack y estructura

React 19 + TypeScript + Vite, con GSAP para la transición entre vistas. `scripts/prerender.mjs` genera HTML estático de las 8 páginas (inicio y 3 casos, en ES y EN), el sitemap y los metadatos SEO. Después React hidrata.

- `src/data.ts`: todo el contenido en los dos idiomas (textos, proyectos, estudios, links). Casi cualquier cambio de texto va acá.
- `src/App.tsx`: vistas (Sobre mí, Proyectos, detalle de proyecto, Formación, Contacto) y el stack técnico (`skillGroups`).
- `src/components/BrandIcon.tsx` + `src/render/logos.ts`: íconos de Simple Icons. `logos.ts` es lo único que queda de `src/render/`.
- `src/styles/globals.css`: estilos.
- Las secciones son rutas con hash (`#projects`, `#journey`, `#contact`). El id `journey` se mantiene aunque la sección ahora se llame "Formación", para no romper links compartidos.

```fish
npm run dev     # 127.0.0.1:5173
npm run build   # tsc + vite build + prerender en dist/
npm run preview # 127.0.0.1:4173
```

## Deploy (Vercel)

Vercel despliega solo al pushear a `main`. `vercel.json` necesita `"framework": "vite"`: el proyecto en Vercel estaba configurado como servidor Node, y al borrar el viejo `src/server.ts` el build fallaba con "No entrypoint found" aunque compilara bien en local. Después de un push, verificar que el deploy salga en verde (`gh api repos/nelsonvis3/myportfolio/commits/<sha>/status`).

## CV y cartas de presentación

- La fuente es `docs/cv/content.json`. `node tools/render-career-documents.mjs` exporta con Brave headless 2 CV y 2 cartas (ES y EN, una página A4 cada uno) a `~/Imágenes/Curriculum/`, y copia los CV a `public/cv.pdf` y `public/cv-en.pdf`.
- `--cv-only` exporta solo los CV. Para generar solo las cartas sin tocar los CV, usar `CAREER_OUTPUT_DIR` apuntando a una carpeta temporal y copiar solo las cartas.
- Las cartas son genéricas a propósito: sirven para cualquier empresa sin editarlas. No volver a agregar versiones cortas ni con huecos para completar.
- El CV que se descarga del sitio tiene que ser siempre el mismo que el de `~/Imágenes/Curriculum/`.
- **30/10/2026:** los CV pasaron a "Backend Junior" y se volvieron a generar desde `docs/cv/content.json` (ES y EN con el mismo diseño). Vuelve a ser la fuente: editar ahí y correr `CAREER_OUTPUT_DIR=<carpeta temporal> node tools/render-career-documents.mjs --cv-only`, y copiar los PDF a `~/Imágenes/Curriculum/`. Los CV hechos a mano con ReportLab quedaron en `~/Imágenes/Curriculum/Respaldo-2026-10-30/`. Sin `CAREER_OUTPUT_DIR` la herramienta escribe en `~/Imágenes/Curriculum/`.

## Decisiones de contenido (no revertir sin preguntar)

- **04/11/2026:** CV y portfolio con el mismo stack (SQLite, Nginx y Tailwind en los dos; sin "GitHub" suelto). Sin cantidades de tests en CV, cartas ni portfolio. El deploy de Fracxion (Netlify, Render, Neon) va en su viñeta y en "Estado", no como grupo de habilidades. Copia anterior de los PDF en `~/Imágenes/Curriculum/Respaldo-2026-11-04/`.

- **Demos:** en general no se enlazan, porque el hosting gratis cae o duerme. Excepciones que pidió Nelson: SPACE Tasks (GitHub Pages) y Fracxion (`fracxion.netlify.app`, 04/11/2026), con aviso en "Estado" de que la primera carga tarda ~1 min.
- **Sin videos por ahora:** `public/clips/` se borró. Nelson va a grabar videos nuevos.
- **Proyectos:** Fracxion y Ragnar tienen caso de estudio breve: Desarrollo, Problema, Solución, Detalles técnicos (4 viñetas) y Estado (una línea). Tono profesional, directo y sin exagerar. Cada afirmación se verificó en el código de su repo. No poner cantidad de pruebas, igual que en el CV.
- **SPACE Tasks** reemplazó a RoadLedger (24/10/2026), con el mismo formato de caso de estudio. Repo `nelsonvis3/space-tasks`; la imagen sale de `docs/screenshots/overview.png` de ese repo. RoadLedger sigue en el CV hasta que Nelson decida.
- **Stack (25/10/2026):** por área: Lenguajes, Frontend, Backend, Bases de datos (con SQLite), Infraestructura y Herramientas y testing. Nelson sacó Redis y Figma; MySQL queda aunque no esté en ningún proyecto.
- **Formación:** sin The Odin Project (Nelson lo sacó el 25/10/2026).
- **Formación:** solo estudios y certificaciones, bachiller incluido. Se sacó la línea de tiempo "Recorrido" porque era genérica y remarcaba el poco tiempo de experiencia.
- **Texto de la barra lateral:** "Desarrollo aplicaciones web completas, desde la interfaz hasta la base de datos." Simple: ni lista de stack ni marketing.

- **05/11/2026:** solo Ragnar en portfolio, CV y carta (Fracxion y SPACE Tasks fuera: Nelson no los puede explicar). Stack sin Next.js, Tailwind, Node.js ni Nginx, con Selenium y Vite; Ragnar mantiene Next.js y Nginx en su descripción. Esto reemplaza lo del 04/11 sobre Nginx/Tailwind y las excepciones de demos.
- **14/11/2026:** las skills del portfolio siguen al CV del 14/11 (`~/Imágenes/Curriculum/CV_Nelson_Sivisstum.pdf`): Frontend con Next.js sin Vite; Pruebas y herramientas con Git, Linux, Docker Compose, Nginx, GitHub Actions, unittest y Playwright, sin Selenium. Esto reemplaza la línea del 05/11 sobre el stack (Next.js y Nginx vuelven; Selenium y Vite salen).

## Links vigentes

- Sitio: `nelsonsivisstum.vercel.app`. `nelsonvis-portfolio.vercel.app` ya no existe: si aparece en algún lado, es un link roto.
- LinkedIn: `https://www.linkedin.com/in/nelsonsivisstum1/`. La URL vieja `nelson-sivisstum-4777a32b4` ya no se usa. "Acerca de" actualizado el 04/11/2026 (EN y ES), corto y sin SPACE Tasks; Nelson rechazó versiones largas o con tono "de película".
- GitHub: `nelsonvis3`. Formosa Empleos es privado y está archivado: no enlazarlo.
- El README del perfil de GitHub está en `~/Documentos/Portfolio/nelsonvis3`. Nelson a veces lo edita desde la web, así que hacer `git pull` antes de tocarlo.

## Verificación

- Capturas headless con `/usr/bin/brave --headless=new --screenshot` contra `npm run preview`.
- En las capturas, las vistas a las que se entra por hash se ven atenuadas porque la animación de GSAP queda a mitad de camino. No es un bug.
