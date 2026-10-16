# CV de Nelson Sivisstum

Versiones de una página A4 con texto seleccionable y enlaces de contacto.

| Idioma | Fuente editable | PDF |
| --- | --- | --- |
| Español | [nelson-sivisstum.html](nelson-sivisstum.html) | [cv.pdf](../../public/cv.pdf) |
| Inglés | [nelson-sivisstum-en.html](nelson-sivisstum-en.html) | [cv-en.pdf](../../public/cv-en.pdf) |

## Actualizar

1. Editar el HTML del idioma correspondiente.
2. Abrirlo en un navegador Chromium e imprimir a PDF: A4, escala 100 %, sin encabezados ni pies del navegador. La hoja define márgenes de 13 × 15 mm.
3. Guardar el PDF en `public/cv.pdf` o `public/cv-en.pdf`.
4. Ejecutar `npm run build` para actualizar las descargas de `dist/`.

Para regenerar los dos PDF sin abrir el navegador, Playwright sirve con `page.pdf({ preferCSSPageSize: true, printBackground: true })` sobre cada HTML. Los dos tienen que seguir entrando en una página.
