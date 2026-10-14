# Revisión del portfolio · 14 de octubre de 2026

## Criterio de selección Full Stack

El objetivo es que una persona que evalúa una candidatura entienda el stack, las funciones de cada proyecto y el trabajo realizado antes de entrar en los detalles de arquitectura. El perfil conserva el objetivo de primera oportunidad profesional. La revisión utiliza criterio de selección senior; no atribuye al candidato experiencia laboral, antigüedad ni un cargo senior.

## Problemas encontrados y correcciones

| Hallazgo en la versión publicada y local | Cambio aplicado |
| --- | --- |
| El título destacaba AI-Assisted Engineering, pero no el stack principal. | Presentación centrada en React, Next.js, TypeScript y Django; datos y pruebas como parte del trabajo Full Stack. |
| El mismo proyecto aparecía como LedgerCore en el portfolio y Fracxion en GitHub y las capturas. | Marca visible Fracxion en portada, caso, navegación y CV. La ruta histórica `/proyectos/ledgercore/` conserva su funcionamiento. |
| Las descripciones resumían arquitectura, pero dejaban funciones de usuario poco visibles. | Tres funciones concretas y el aporte personal de cada proyecto en la portada; listas detalladas en los casos. |
| Ragnar decía que el registro iniciaba sesión sin confirmar el correo. | Corregido según README y código locales: cuenta pendiente, enlace de confirmación, login y recuperación de contraseña. |
| El caso de Ragnar omitía su panel web de catálogo. | Agregados imágenes, sabores, precios, publicación, permisos y control de stock ante ediciones concurrentes. |
| El recorrido de Fracxion resultaba más técnico que operativo. | Nueva sección cliente → catálogo → borrador → emisión → cobro → consulta/reversión, con un ejemplo de importes. |
| CV y repositorios requerían más navegación. | CV en la presentación inicial, antes del cerebro en móvil, y código de cada proyecto accesible desde su resumen. CV actualizado y reexportado en A4. |
| La imagen social conservaba el nombre LedgerCore y faltaban URLs públicas en los metadatos del build local. | Imagen social con Fracxion y stack principal; canonical, Open Graph y sitemap sobre el dominio proporcionado por el propietario, reemplazable con SITE_URL. |
| Data Engineering y AI Engineering podían sugerir especialidades más amplias que lo demostrado. | Etiquetas ajustadas a Bases de datos y Desarrollo con IA, con tecnologías y usos concretos. |
| El estudio conceptual de automatización ocupaba un bloque completo en el recorrido principal. | Presentación desplegable opcional; mantiene el diagrama y sus controles. |

Se conserva la dirección visual existente: tipografía, cerebro interactivo, presentaciones de dispositivos y protagonismo de los tres proyectos. El cambio editorial destaca tareas concretas y explica decisiones mediante ejemplos: pedidos repetidos, stock compartido, cobros parciales y datos de distintas empresas.

## Fuentes propias

- [Perfil público de GitHub](https://github.com/nelsonvis3/nelsonvis3/tree/main): lectura del README mediante la API pública de GitHub.
- [Portfolio publicado](https://nelsonvis-portfolio.vercel.app/): HTML y apertura real en Brave/Chromium; la versión consultada mostraba LedgerCore.
- [README público de Ragnar](https://github.com/nelsonvis3/ragnarsuplementosfsa): contrastado con `/home/nelson/Documentos/ragnar-v2/README.md`, `backend/store/views.py`, `catalog_admin.py` y `permissions.py`. El README público consultado todavía no documentaba todas las funciones de la copia local.
- [README público de Fracxion](https://github.com/nelsonvis3/fracxion-facturador): contrastado con `/home/nelson/Proyectos/facturador-saas-api/README.md` y los permisos del backend. El ejemplo ARS 100 + 21 % y cobro de ARS 40 proviene de su recorrido documentado.

La documentación de cada aplicación respalda sus funciones y las pruebas históricas descritas. Esta actualización valida el portfolio; no vuelve a ejecutar las suites de negocio de Ragnar o Fracxion ni sus integraciones externas. No se agregaron presupuestos, emisión fiscal ARCA, suscripciones cobradas, usuarios comerciales o métricas no documentadas.

## Referencias editoriales consultadas

- [Irenio de Aragão](https://aragaoi.dev/): presentación directa de especialidad, experiencia y tecnologías. Se tomó como referencia la facilidad para identificar el perfil.
- [Proyectos de Jorge Morais](https://jorgemopanc.com/projects/): descripción de productos y responsabilidades técnicas. Se tomó el orden función → implementación, sin trasladar sus credenciales ni métricas.
- [PRODUCT.md del portfolio de Johans Neira](https://github.com/johansneirap/portfolio-v3/blob/main/PRODUCT.md): repositorio orientado explícitamente a reclutadores y clientes, con acceso claro a contacto y CV.
- [Portfolio de Chelsea Tolnai](https://github.com/ChelseaTolnai/Portfolio): repositorio de una desarrolladora que declara experiencia senior; referencia para organizar experiencia, proyectos, stack y contacto.

Los textos se redactaron para los proyectos de Nelson. No se copiaron párrafos ni logros de otras personas.

## Validación de esta edición

- `npm run build`: TypeScript y cuatro páginas generadas; canonical, Open Graph y sitemap con el dominio público proporcionado.
- `git diff --check`: sin errores de formato.
- `node scripts/check-brain-flow.mjs`: 11.544 combinaciones geométricas correctas.
- Brave/Chromium con Playwright: cuatro páginas × siete anchos (320, 390, 601, 768, 1024, 1440 y 1920 px), sin desbordamiento horizontal, imágenes rotas ni IDs duplicados; un H1 por página.
- 21 comprobaciones funcionales: menú/Escape, estudio desplegable y pestañas, CV, tres repositorios, selección por teclado, contexto de empresa, ampliación de capturas, procesos de Ragnar/RoadLedger, alternativa sin JavaScript y WebGL.
- WebGL: cuatro áreas × cuatro anchos, sin etiquetas fuera del visor ni cruces; carga y pausa comprobadas.
- Axe: cuatro páginas × 390/1440 px, cero infracciones detectadas en WCAG 2/2.1 A-AA y 2.2 AA. El motor deja contraste sobre fondos complejos para revisión manual; no es una certificación de accesibilidad.
- 15 URLs locales comprobadas con respuesta 200. Sin errores JavaScript ni respuestas HTTP de error en el recorrido.
- CV: A4 de una página, texto seleccionable, enlace a Fracxion y marca consistente; revisión visual de la página renderizada.
- Revisión visual de portada de escritorio/móvil, resúmenes de proyecto, cabeceras de Fracxion/Ragnar e imagen social 1200 × 630. La vista móvil muestra proyectos, CV y contacto antes del cerebro.
- Integridad: todos los recursos de `public/` coinciden byte a byte con `dist/`; el CSS final coincide con sus cuatro fuentes. El PDF de descarga coincide con el original actualizado.

Evidencia: [reporte de navegador](validation/editorial-review.json), [portada móvil](screenshots/editorial-home-390.png), [resumen en escritorio](screenshots/editorial-project-summary-1440.png), [resumen móvil](screenshots/editorial-project-summary-390.png) y [CV renderizado](screenshots/cv.png).

Las suites de negocio de los dos proyectos, integraciones externas, despliegue nuevo y edición de LinkedIn quedan fuera de estas comprobaciones. Los cambios se aplicaron únicamente en el checkout local del portfolio y su salida estática.

## Limpieza

Limpieza completada después de las pruebas: eliminados `.next/`, `next-env.d.ts` y `app/` vacía, restos de una implementación anterior en Next.js. También se eliminaron los ocho archivos temporales propios de esta revisión en `/tmp`, incluido el script de navegador. No se encontraron otros archivos `.log`, `.tmp`, `.bak` o `.tsbuildinfo` del proyecto fuera de dependencias. Se conservan `dist/` (entrega estática versionada), `build/` (necesario para `npm start`), dependencias de desarrollo y evidencia útil. Los recursos originales PNG conservados en `public/` están identificados como fuentes de sus derivados WebP; no se consideran caché.
