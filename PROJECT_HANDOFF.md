# Traspaso del proyecto

## 2026-11-04 — Revisión de los tres CV

- Fuente: `docs/cv/content.json`; exportador: `tools/render-career-documents.mjs`. Documentación de regeneración en `docs/cv/README.md`.
- Título Full Stack Junior y perfil personal con foco en backend elegido por Nelson. Descripciones de Fracxion y Ragnar más breves, sin agregar capacidades ni resultados.
- Sin disponibilidad remota en los CV. La versión con foto conserva dos proyectos; no se agregó SPACE Tasks. Las versiones sin foto conservan sus tres proyectos.
- El exportador admite `--photo=/ruta/local/foto.png`, utiliza la foto original y espera su carga. Se preservó el ajuste previo de títulos negros y en negrita.
- Comprobaciones reales: `node --check`, tres PDF A4 de una página, perfil y viñetas completos, texto y enlaces extraíbles, límites de página, foto incluida y cartas sin cambios. `npm run build` completado; ocho páginas bilingües. Copias locales, `public/` y `dist/` coinciden.
- Rama `main`, base `770546c`; cambios locales, sin commit, push ni despliegue. El build no confirma disponibilidad de demos ni comportamiento de los backends.
- Próxima acción: mejorar el perfil de Computrabajo a partir de sus campos actuales.

## 2026-11-05 — Un solo proyecto y stack nuevo

- Se sacaron Fracxion y SPACE Tasks del portfolio, el CV y la carta (Nelson: los hizo casi todo con IA y no los puede explicar en una entrevista). Queda solo Ragnar Suplementos ("Proyecto destacado").
- Stack del portfolio y del CV: sin Next.js, Tailwind, Node.js ni Nginx; se agregaron Selenium (lo aprendió en CS50 Web) y Vite. Ragnar sigue diciendo Next.js y Nginx porque es lo que usa de verdad.
- Carta ES/EN reescrita sobre Ragnar y CS50. `vercel.json` redirige las URL viejas de los casos (y ledgercore) a `#projects`.
- Comprobado: 4 PDF A4 de una página, `public/` igual a lo exportado, `npm run build` con 4 páginas, capturas a 1366, 390 y 375. Respaldo de los PDF anteriores en `~/Imágenes/Curriculum/Respaldo-2026-11-05/`.
- Pendiente: el CV con foto sigue viejo (no está `Fuentes/foto-cv.png`); `docs/social/card.html` y las imágenes `fracxion-overview.png`/`space-tasks.webp` siguen en el repo. Sin commit ni push.

## 2026-11-05 (2) — Deploy roto, CV de Documentos y LinkedIn

- El deploy de `4301b7b` falló en Vercel (`invalid-route-source-pattern`): el patrón `/:id(a|b)/?` de `vercel.json` no es válido. Se reemplazó por rutas literales con y sin barra final. Falta commit y push.
- `~/Documentos/NelsonSivisstum-CV.pdf` (antes "Operario General"): título "Desarrollador Full Stack Junior", perfil del CV principal y CS50 con contenidos por área (frontend, backend, pruebas, redacción técnica). La experiencia y las habilidades de mantenimiento no se tocaron. Fuente nueva: `~/Imágenes/Curriculum/Fuentes/NelsonSivisstum-CV.html` + `foto-cv.png` (sacada del PDF). Original en `Respaldo-2026-11-05/NelsonSivisstum-CV-Operario.pdf`.
- CV con foto regenerado con la foto de `Fuentes/` (ya sin Fracxion).
- LinkedIn (EN): titular, Acerca de, aptitudes principales (sin Next.js, con Python), experiencia (sin Fracxion/RoadLedger, link arreglado, sin Next.js) y proyecto Ragnar (sin cantidad de tests, link arreglado, ago.–sep. 2026). Falta: borrar el proyecto Fracxion, sacar Fracxion de Destacado, sumar Selenium y Vite, perfil en español, servicios y portada.

## 2026-11-05 (3) — LinkedIn terminado y habilidades del CV de Documentos

- LinkedIn: proyecto Fracxion borrado, "Fracxion on GitHub" sacado de Destacado, aptitudes Selenium y Vite.js agregadas y Next.js borrada. Perfil en español: titular sin Next.js y "Acerca de" traducido (sin Fracxion). Revisado después de guardar.
- Sigue en LinkedIn: The Odin Project en Educación, certificado freeCodeCamp, aptitudes "Desarrollo de SaaS" e "Inteligencia artificial", servicios genéricos y portada con íconos viejos.
- `~/Documentos/NelsonSivisstum-CV.pdf`: las habilidades de mantenimiento se cambiaron por las técnicas del CV principal; queda Comunicación. Una página A4.

## 2026-11-05 (4) — Limpieza final de LinkedIn

- Borrados: The Odin Project (Educación) y la aptitud "Desarrollo de SaaS". Servicios: solo Desarrollo web y Desarrollo de base de datos; Node.js fuera de la descripción del servicio. La portada se deja como está (decisión de Nelson).
- Al tipear textos largos en LinkedIn se pierden letras: cargar el valor por JS con el setter nativo del textarea y verificarlo.

## 2026-11-14 — Skills del portfolio alineadas con el CV

- Referencia: `~/Imágenes/Curriculum/CV_Nelson_Sivisstum.pdf` y `Nelson_Sivisstum_Fullstack_Junior.pdf` (14/11). `docs/cv/content.json` quedó desactualizado respecto de esos PDF y no se tocó.
- `src/App.tsx` (`skillGroups`): grupos en orden Backend → Frontend → Pruebas y herramientas. Se sacaron Selenium y Vite; se agregaron Nginx y unittest; "CI/CD" pasó a "GitHub Actions" (misma clave e ícono). unittest usa el ícono de Python.
- Comprobado: `npm run build` (tsc + vite + prerender) sin errores. El HTML prerenderizado de inicio ES y EN lista las skills del CV, sin Selenium ni Vite. Capturas en Brave headless a 1366, 390 y 375: sin cortes; en celular "Pruebas y herramientas" queda dentro del área con scroll, como antes con "Frontend".
- Pendiente, no tocado: el texto del Ragnar en `src/data.ts` dice Mercado Pago y el PDF dice checkout por WhatsApp y transferencia; el título de la barra lateral dice "Backend Junior" y el PDF dice "Full Stack Junior"; `public/cv.pdf` no es igual al PDF de hoy.
- Cambios sin commit ni push.

## 2026-11-14 (2) — Descargas de CV actualizadas

- `public/cv.pdf` = CV en español de `~/Imágenes/Curriculum/Fuentes/build-cv.py` sin foto (`es 0`), sin disponibilidad. La versión con foto no se publica, como indica `docs/cv/README.md`.
- `public/cv-en.pdf` = `~/Imágenes/Curriculum/CV_Nelson_Sivisstum.pdf` (EN, sin foto, sin disponibilidad).
- Comprobado: `npm run build` sin errores; `dist/` y `vite preview` sirven los dos PDF idénticos a `public/`; una página A4 y sin "Disponibilidad"/"Availability" en el texto.
- Pendiente de decisión: `docs/cv/content.json` y `tools/render-career-documents.mjs` siguen con el contenido anterior (Node.js, Vite, Mercado Pago, "Backend Junior"). Si se vuelve a correr el exportador, pisa `~/Imágenes/Curriculum/` y `public/` con esa versión vieja. Sincronizar `content.json` con el CV del 14/11, o dejar de usar el exportador.
- Cambios sin commit ni push.

## 2026-11-22 — Whodesk, CV y perfil del portfolio

- Se agregó Whodesk primero en Proyectos, en ES y EN, con la imagen `public/img/whodesk.png`, repositorio, demo, arquitectura, funciones, desafíos, decisiones y resultados de evaluación. El sitio ahora genera `/proyectos/whodesk/` y `/en/projects/whodesk/`.
- Se alineó el rol visible con “Fullstack Junior”; el stack del inicio coincide con los CV actuales: HTML y CSS en Frontend, pytest en Pruebas y herramientas, y sin Nginx en ese grupo. Nginx se conserva en la ficha de Ragnar, donde describe el proyecto.
- `public/cv.pdf` se actualizó desde `~/Imágenes/Curriculum/Nelson_Sivisstum_Fullstack_Junior.pdf`; esta versión española incluye foto. `public/cv-en.pdf` se actualizó desde `~/Imágenes/Curriculum/CV_Nelson_Sivisstum.pdf`.
- El 95 % Hit@1 y las otras métricas se incorporaron desde la corrida local que Nelson compartió: 30 preguntas, 22 respondibles y 8 sin respuesta. No se ejecutó `eval_rag` desde este checkout.
- Verificado: `npm run build` compiló y prerenderizó seis páginas bilingües; los PDFs en `dist/` coinciden por SHA-256 con `public/`; `git diff --check` pasó. La captura de navegador quedó sin realizar porque Chromium falta y Brave headless no pudo crear su perfil dentro del entorno.
- El vault de Obsidian indicado en las instrucciones no estaba disponible en la ruta proporcionada. Sin commit, push ni deploy. `docs/cv/content.json` sigue desactualizado; no usar el exportador hasta sincronizar esa fuente.
