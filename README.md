# Nelson Sivisstum · Portfolio

[Ver portfolio](https://nelsonvis-portfolio.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/nelson-sivisstum-4777a32b4/) · [Contacto](mailto:nelsonsivisstum3@gmail.com)

Mi portfolio de desarrollo Full Stack. Reúne tres proyectos en los que trabajé con interfaces, APIs y reglas de negocio: Fracxion, Ragnar Suplementos y RoadLedger. Cada caso explica el problema, las decisiones de implementación y el estado del proyecto, acompañado de capturas de la aplicación.

[![Portada del portfolio de Nelson Sivisstum](public/img/social-preview.png)](https://nelsonvis-portfolio.vercel.app/)

## Proyectos

| Proyecto | Trabajo presentado | Caso de estudio | Código |
| --- | --- | --- | --- |
| **Fracxion** | Gestión comercial multiempresa: clientes, facturas internas, cobros, permisos y auditoría. | [Leer caso](https://nelsonvis-portfolio.vercel.app/proyectos/ledgercore/) | [Repositorio](https://github.com/nelsonvis3/fracxion-facturador) |
| **Ragnar Suplementos** | E-commerce: catálogo, variantes, combos, carrito, reservas de stock y administración. | [Leer caso](https://nelsonvis-portfolio.vercel.app/proyectos/ragnar-suplementos/) | [Repositorio](https://github.com/nelsonvis3/ragnarsuplementosfsa) |
| **RoadLedger** | Prototipo de planificación de viajes: rutas, paradas, descansos y registros diarios. | [Leer caso](https://nelsonvis-portfolio.vercel.app/proyectos/roadledger/) | [Repositorio](https://github.com/nelsonvis3/ELD-trip-planner) |

Los repositorios enlazados contienen las aplicaciones. Este repositorio contiene el portfolio que las presenta.

## Cómo está construido

El sitio se genera con **TypeScript, HTML y CSS**. Durante el build, `src/build.ts` combina los datos y las plantillas para producir cuatro páginas HTML completas. El navegador agrega las interacciones sobre ese contenido: navegación, diagramas, visor de capturas y animaciones.

React, Next.js y Django forman parte de los proyectos presentados. El portfolio usa su propio generador estático y se publica en Vercel.

Hay tres decisiones que atraviesan la implementación:

- **Separar contenido y presentación.** Los textos y enlaces viven en `src/data/`; las plantillas, en `src/render/`. Actualizar un caso no requiere recorrer toda la página.
- **Mantener el contenido accesible sin las animaciones.** La portada usa WebGL y conserva una imagen alternativa cuando hay movimiento reducido, ahorro de datos o falta de soporte. El contenido principal también está disponible sin JavaScript.
- **Servir los recursos desde el propio sitio.** Fuentes, imágenes y dependencias de la introducción se copian al directorio publicado. Hyperframes y GSAP se utilizan en la entrada animada; WebGL dibuja la visualización de la portada.

Los diagramas permiten navegación por teclado y el visor de imágenes devuelve el foco al cerrarse. Las comprobaciones y sus límites están documentados en [VALIDATION.md](docs/VALIDATION.md).

## Ejecutar en local

Requisitos: **Node.js 20 o superior** y npm.

```bash
git clone https://github.com/nelsonvis3/myportfolio.git
cd myportfolio
npm ci
npm run dev
```

Abrir [http://127.0.0.1:3000](http://127.0.0.1:3000).

`npm run dev` compila el sitio y arranca el servidor de previsualización. No incluye recarga automática: después de editar, ejecutar `npm run build` en otra terminal y recargar el navegador. Si cambia el código del servidor, reiniciarlo.

| Comando | Uso |
| --- | --- |
| `npm run build` | Comprobar TypeScript y regenerar `dist/`. |
| `npm start` | Servir el último build en `127.0.0.1:3000`. |
| `PORT=4173 npm start` | Previsualizar en otro puerto. |
| `node scripts/check-brain-flow.mjs` | Comprobar la proyección y los límites de las etiquetas de la portada, después del build. |

El sitio no necesita claves de API ni una base de datos para ejecutarse.

## Estructura

```text
src/
  data/          Textos, proyectos, habilidades y enlaces
  render/        Plantillas de la portada y los casos de estudio
  visual/        WebGL, movimiento e interacciones visuales
  client.ts      Navegación, pestañas y visor de capturas
  build.ts       Generación de HTML, assets y metadatos
  server.ts      Servidor local de previsualización
  *.css          Estilos generales y de cada sección
public/          Imágenes, fuentes, modelos y CV descargables
docs/            Decisiones, validaciones y fuentes editables
scripts/         Comprobaciones y generación de geometría
dist/            Sitio generado, listo para hosting estático
```

Para cambiar la presentación y los enlaces, empezar por `src/data/profile.ts` y `src/data/socials.ts`. Los casos se editan en `projects.ts`, `ledgercore.ts` y `case-studies.ts`, dentro de `src/data/`.

Fracxion conserva el identificador `ledgercore` en su ruta y algunos archivos para mantener los enlaces existentes.

Los CV están disponibles en [español](public/cv.pdf) e [inglés](public/cv-en.pdf). Sus fuentes HTML e instrucciones de exportación están en [docs/cv/](docs/cv/README.md).

## Publicación

La configuración de hosting utiliza:

| Opción | Valor |
| --- | --- |
| Tipo de proyecto | Other / Static |
| Comando de build | `npm run build` |
| Directorio de salida | `dist` |

El hosting debe servir los `index.html` de los subdirectorios. Los assets usan rutas absolutas desde `/`, por lo que el sitio debe publicarse en la raíz del dominio.

El dominio se define en `src/data/socials.ts`. Para compilar con otro dominio:

```bash
SITE_URL=https://portfolio.example.com npm run build
```

Esta variable actualiza las URLs canónicas, Open Graph y sitemap. El build reemplaza `dist/`; los cambios deben hacerse en `src/` o `public/`. `dist/` está versionado en este repositorio y `build/`, el JavaScript intermedio, se ignora en Git.

## Documentación

- [Contenido y fuentes técnicas de los proyectos](docs/CONTENT_EVIDENCE.md).
- [Comprobaciones de interfaz y accesibilidad](docs/VALIDATION.md).
- [Introducción, animaciones y movimiento reducido](docs/MOTION.md).
- [Dirección visual y referencias](docs/design/REFERENCES.md).

La sección de IA distingue el uso actual de asistentes de desarrollo del diseño de un futuro asistente de soporte. Ese flujo todavía no ejecuta un modelo ni envía respuestas.

Las licencias y atribuciones de las fuentes y la geometría se conservan en `public/fonts/` y `public/models/`. La visualización de la portada es una interpretación gráfica de una malla cortical, no una representación de actividad cerebral.
