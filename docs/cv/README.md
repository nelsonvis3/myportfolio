# CV de Nelson Sivisstum

El usuario autorizó esta actualización junto con la reconstrucción del portfolio. Se sustituyó Formosa Empleos por LedgerCore / Fracxion y se incorporó el trabajo con Codex y Claude Code. Se mantuvieron contacto, formación e idiomas; los cursos muestran su estado declarado, sin fechas de certificación no verificadas.

- Fuente: [nelson-sivisstum.html](nelson-sivisstum.html).
- PDF publicado por el portfolio: [public/cv.pdf](../../public/cv.pdf).
- [Vista previa de la página A4](../screenshots/cv.png).

Para editar, modificar el HTML y abrirlo en Chromium/Chrome desde el disco. Las fuentes son locales y las rutas apuntan a `public/fonts/`. Imprimir a PDF en A4, escala 100 %, sin encabezado ni pie del navegador; la hoja define sus propios márgenes de 14 × 16 mm. Guardar el resultado en `public/cv.pdf` y ejecutar `npm run build` para actualizar la descarga en `dist/`.

El PDF entregado se exportó con Chromium mediante Playwright, con `preferCSSPageSize`, `printBackground` y `tagged` activados. Se comprobó que tiene una página, conserva texto seleccionable y no contiene Formosa Empleos. Se revisó su composición renderizada. El etiquetado no equivale a una certificación PDF/UA.

La dirección pública del portfolio y los enlaces de contacto provienen del CV anterior. No implican que esta nueva versión esté desplegada en ese dominio.
