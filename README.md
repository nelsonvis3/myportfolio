# Portfolio de Nelson Sivisstum

Mi portfolio de desarrollador full stack, en español y en inglés.

[Ver el sitio](https://nelsonvis-portfolio.vercel.app/) · [English](https://nelsonvis-portfolio.vercel.app/en/) · [LinkedIn](https://www.linkedin.com/in/nelson-sivisstum-4777a32b4/)

![Portada del portfolio](public/img/social-preview.png)

> English summary: my developer portfolio. A static site generated with TypeScript, in warm charcoal and amber, with smooth scrolling (Lenis + GSAP), a pinned horizontal project row, in-page case studies and short screen recordings of each project. Spanish and English versions.

## Qué hay en el sitio

- Un hero en tarjeta con mi presentación, y una intro sobre cómo trabajo.
- Mis tres proyectos en tarjetas que corren de lado al bajar. Un click cambia el caso de estudio de la home al de ese proyecto, sin salir de la página: resumen, funciones, clips de cómo se usa (escritorio y celular), desafíos, arquitectura y estado.
- Cada proyecto tiene además su página con el caso completo.
- Sobre mí, el stack (y AI Studio), disponibilidad y contacto.
- Sin JavaScript o con movimiento reducido, el sitio se ve completo y quieto.

## Cómo está hecho

| Parte | Herramientas |
| --- | --- |
| Generador | TypeScript propio: `src/build.ts` arma ocho páginas HTML (cuatro por idioma) |
| Movimiento | Lenis (scroll suave) y GSAP ScrollTrigger, cargados después del primer pintado |
| Logos del stack | Simple Icons (CC0), en `src/render/logos.ts` |
| Clips | Grabaciones de cada proyecto, editadas con FFmpeg (`public/clips/`) |
| Tipografía | Mona Sans (titulares) e Inter (texto), las dos OFL |
| Publicación | Vercel |

Algunas decisiones:

- **El contenido vive en datos.** Los textos de cada idioma están en `src/content/es.ts` y `src/content/en.ts`, con el mismo tipo. Cambiar un texto no requiere tocar las plantillas.
- **El movimiento es una mejora.** Todo el contenido está en el HTML. Las animaciones solo afectan lo que todavía no está en pantalla, y con movimiento reducido no se cargan.
- **Fluidez primero.** Solo se animan `transform` y `opacity`; las animaciones en bucle se pausan fuera de pantalla y la estela del puntero no dibuja con el mouse quieto.

## Ejecutar en local

Requisitos: Node.js 20 o superior.

```bash
git clone https://github.com/nelsonvis3/myportfolio.git
cd myportfolio
npm ci
npm run dev        # compila y sirve en http://127.0.0.1:3000
```

No hay recarga automática: después de editar, corré `npm run build` y recargá el navegador.

## Estructura

```text
src/
  content/       Textos en español e inglés, datos del sitio y rutas
  render/        Plantillas (layout, home, caso), íconos y logos
  web/           JS del navegador: client.ts (todas las páginas) y motion.ts (scroll y animaciones)
  build.ts       Genera dist/ y empaqueta el JS con esbuild
  styles.css     Sistema visual (carbón y ámbar)
public/          Imágenes, videos, fuentes y CV
```

Imágenes opcionales: `public/img/hero.webp` (fondo del hero) y `public/img/nelson.webp` (foto de Sobre mí). Si están, el build las usa.

Los clips de "Cómo se usa" están en `public/clips/`: `<proyecto>-<n>-desktop.mp4` y, si existe, `<proyecto>-<n>-mobile.mp4`, cada uno con su póster `.webp`. El build los detecta solos. Los CV que se descargan son `public/cv.pdf` y `public/cv-en.pdf` ([docs/cv/README.md](docs/cv/README.md)).

## Publicación

Vercel corre `npm run build` y publica `dist/`. `dist/` no está en el repositorio.

Para compilar con otro dominio:

```bash
SITE_URL=https://mi-dominio.com npm run build
```

## Licencia

El código del sitio tiene licencia MIT ([LICENSE](LICENSE)). Los textos, el CV y las capturas de mis proyectos no forman parte de esa licencia.

### Licencias de terceros

- Logos de Simple Icons (CC0) en `src/render/logos.ts`.
- Fuentes Mona Sans e Inter (SIL Open Font License) en `public/fonts/`.
