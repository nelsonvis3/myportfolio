# CV de Nelson Sivisstum

La fuente editable es `docs/cv/content.json`. Los PDF comparten diseño y se exportan como una página A4 con texto seleccionable y enlaces.

| Versión | Archivo local en `~/Imágenes/Curriculum/` | Copia descargable del portfolio |
| --- | --- | --- |
| Español | `CV_Nelson_Sivisstum_ES.pdf` | `public/cv.pdf` |
| Inglés | `CV_Nelson_Sivisstum_EN.pdf` | `public/cv-en.pdf` |
| Español con foto | `NelsonSivisstum-CV-ES-con-foto.pdf` | No se publica |

## Regenerar

```bash
node tools/render-career-documents.mjs --cv-only
```

Para exportar también el CV con foto, usar la fotografía original guardada localmente:

```bash
node tools/render-career-documents.mjs --cv-only --photo="$HOME/Imágenes/Curriculum/Fuentes/foto-cv.png"
```

`CAREER_OUTPUT_DIR` permite elegir una carpeta de salida; los dos CV descargables se sincronizan en `public/` después de verificar que todas las exportaciones tengan una página. El generador espera a que las fuentes y la foto se hayan cargado. Para comprobar las descargas incluidas en el build, ejecutar `npm run build`.

## Contenido acordado el 04/11/2026

- Título: Desarrollador Full Stack Junior / Junior Full Stack Developer.
- Perfil en español elegido por Nelson: “Desarrollador full stack junior con foco en backend. Me interesa la seguridad de los datos y encontrar soluciones simples a problemas complejos. Me gusta trabajar en la lógica que el usuario no ve, pero de la que depende que una aplicación funcione correctamente.” El inglés mantiene el mismo sentido.
- Omitir disponibilidad remota en los CV.
- Desde el 05/11/2026 los CV solo llevan Ragnar Suplementos (Fracxion y SPACE Tasks se sacaron).
- Mantener datos de contacto, formación, idiomas, stack y fechas. Sin cantidades de tests; se conserva el porcentaje de cobertura ya existente.
- Las cartas de presentación no se modificaron en esta revisión.

## Comprobaciones locales

Tres exportaciones de una página A4, PDF etiquetado, perfil y viñetas completos, enlaces incorporados, fotografía original y texto dentro de los límites de página. Copias de español e inglés idénticas en Curriculum, `public/` y `dist/`. Build completado con ocho páginas bilingües.

Respaldo y reporte de esta revisión guardados fuera del repositorio, en `~/Imágenes/Curriculum/`.
