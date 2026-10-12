# Validación — galaxias y tres casos de estudio

Fecha: **11 de octubre de 2026**. Validación local del portfolio generado con TypeScript, en Chromium mediante Playwright. No acredita disponibilidad ni despliegue público de los proyectos descritos.

## Cambios comprobados

- Recorrido de cuatro galaxias con capítulos de habilidades, selección manual, pausa y Data Engineering.
- Ragnar y RoadLedger con seis capítulos cada uno, índice, arquitectura, proceso interactivo de cinco etapas, desafíos, decisiones y aprendizajes. LedgerCore conserva su caso.
- Datos de ambos proyectos contrastados con sus repositorios locales; ver [CONTENT_EVIDENCE.md](CONTENT_EVIDENCE.md).
- Poster y portada social actualizados. CV de una página A4 con la descripción actual de Ragnar, texto seleccionable y etiquetas PDF.

## Verificación funcional y visual

| Comprobación | Evidencia |
| --- | --- |
| Build y tipos | `npm run build` aprobado. Cuatro páginas completas en `dist/`. |
| Responsive | Cuatro rutas × seis anchos: **320, 390, 768, 1024, 1440 y 1920 px**. Sin desbordamiento horizontal, elementos fuera del viewport, imágenes rotas ni IDs duplicados. |
| Navegación y recursos | **41 URLs locales** verificadas, incluyendo anclas, capturas, fuentes y CV. Cero errores HTTP o JavaScript durante el recorrido. |
| Controles existentes | **35 comprobaciones**: diagramas de portada, teclado, menú, Escape, desplegables, tenant, visor y enlace de salto. |
| Galaxia y nuevos casos | **59 comprobaciones**: cuatro habilidades, avance automático de capítulo, pausa/reanudación, pausa al recibir foco, redraw al redimensionar, salida de pantalla, pérdida de contexto y cinco etapas en cada caso con teclado. |
| Sin efectos | Poster y selección manual con movimiento reducido, ahorro de datos o WebGL deshabilitado. Cambiar la preferencia durante la sesión retira/restaura el render. Sin JavaScript, todas las explicaciones de los procesos y la navegación siguen disponibles. |
| Accesibilidad automática | Axe-core con reglas WCAG A/AA, 2.1 A/AA y 2.2 AA: cuatro páginas a 390 y 1440 px; **cero infracciones detectadas**. |
| Contraste complementario | **88 pares** de texto/fondo que axe dejó pendientes; contraste calculado mínimo **4,80:1**. Elementos decorativos revisados visualmente. |
| Últimos ajustes | Revisión adicional a 320, 390 y 768 px del hero y ambos casos; separación de números/títulos y margen de la galaxia en tablet. |
| SEO | Canonical, Open Graph y sitemap correctos con dominio reservado de prueba; URL inválida rechazada. Build final sin `SITE_URL`: no inventa dominio ni sitemap. |
| Assets y CV | SHA-256 de las tres capturas de LedgerCore coincide con las fuentes originales. El CV en `dist/` coincide con `public/cv.pdf`; comprobación visual y extracción de texto. |
| Diff | `git diff --check` aprobado. |

Se corrigieron dos fallos detectados durante la revisión: el lienzo se borraba al redimensionar con la animación pausada, y el cambio dinámico de movimiento reducido requería comprobar la preferencia también antes de dibujar. Ambos se volvieron a comprobar en navegador.

## Rendimiento de laboratorio

Tres cargas con caché vacía por tamaño. Chrome DevTools Protocol: descarga **1,6 Mbps**, subida **750 Kbps**, latencia **150 ms**, CPU **4×**. WebGL utiliza el renderizador de software del entorno de prueba.

| Tamaño | LCP, rango | LCP, mediana | CLS máximo | Mayor tarea larga | Mayor evento observado |
| --- | --- | --- | --- | --- | --- |
| 390 px | 1.704–1.820 s | 1.756 s | 0.075772 | 328 ms | 32 ms |
| 1440 px | 1.764–1.852 s | 1.832 s | 0.000214 | 336 ms | 72 ms |

LCP y CLS cumplieron los objetivos de 2,5 s y 0,1 en estas cargas. Los eventos corresponden a clics en diagramas: **no son una medición formal de INP ni datos de usuarios reales**. Las tareas largas incluyen la inicialización gráfica bajo CPU limitada; estos resultados no garantizan comportamiento en otros dispositivos o alojamientos.

JavaScript sin comprimir: cliente **7.452 bytes**, módulo opcional de galaxias **12.647 bytes**. Poster WebP: **61.282 bytes**. El módulo solo se solicita en el inicio; no añade dependencias de ejecución. Render limitado a aproximadamente 30 fps, con densidad de píxeles acotada y sin llamadas de dibujo mientras permanece pausado o fuera de pantalla.

## Evidencias de esta iteración

- [Responsive y navegación](validation/galaxy-responsive.json)
- [Galaxia, preferencias y procesos de los casos](validation/galaxy-interactions.json)
- [Accesibilidad](validation/galaxy-accessibility.json) y [contraste complementario](validation/galaxy-manual-review.json)
- [Seis cargas de rendimiento](validation/galaxy-performance.json)
- [Build, SEO y hashes](validation/galaxy-build.json)
- [Última revisión de espaciado](validation/galaxy-final-visual.json)
- Capturas: [escritorio](screenshots/desktop.png), [móvil](screenshots/mobile.png), [Ragnar](screenshots/ragnar-suplementos.png), [RoadLedger](screenshots/roadledger.png), [CV](screenshots/cv.png).

Los informes sin prefijo `galaxy-` conservan las comprobaciones de la reconstrucción anterior del 10 de octubre. No deben interpretarse como medidas de la nueva animación.

## Límites y reproducción

No se probaron Safari, Firefox, dispositivos físicos ni lectores de pantalla reales. Axe y la comprobación de contraste no equivalen a una certificación WCAG. No se realizaron compras reales en Ragnar ni rutas con proveedores activos en RoadLedger; las pruebas de sus aplicaciones no se volvieron a ejecutar en esta tarea. Los límites específicos se detallan en los casos y en CONTENT_EVIDENCE.md.

Ejecutar `npm run dev` y visitar `/`, `/proyectos/ledgercore/`, `/proyectos/ragnar-suplementos/` y `/proyectos/roadledger/`. El servidor no tiene recarga automática: después de editar, compilar y recargar. Para repetir las pruebas automatizadas de este entorno se utilizaron `/tmp/galaxy-responsive.mjs`, `/tmp/galaxy-interactions.mjs`, `/tmp/galaxy-axe.mjs`, `/tmp/galaxy-final-browser.mjs`, `/tmp/galaxy-performance.mjs`, `/tmp/galaxy-final-visual.mjs` y `/tmp/portfolio-final-check.mjs`, con las instalaciones existentes de Playwright y axe de Facturador.
