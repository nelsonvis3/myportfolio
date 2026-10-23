# Nelson Sivisstum — Full Stack Developer

A bilingual portfolio featuring full-stack projects, technical problem-solving, and my path as a self-taught developer based in Formosa, Argentina.

**[Portfolio](https://nelsonsivisstum.vercel.app/)** · **[English](https://nelsonsivisstum.vercel.app/en/)** · **[GitHub](https://github.com/nelsonvis3)** · **[LinkedIn](https://www.linkedin.com/in/nelson-sivisstum-4777a32b4/)**

## About the portfolio

Built with **Vite, React, and TypeScript**, this portfolio puts projects and their technical decisions first. Its editorial, dark-navy design uses a persistent desktop navigation, restrained animation, and a responsive layout instead of a traditional long-scrolling landing page.

The site is available in **English and Spanish** and includes:

- **About:** a personal introduction, technical focus, and CV downloads.
- **Projects:** Fracxion, Ragnar Suplementos, and RoadLedger, each with an image revealed on hover/focus on desktop (visible directly on touch devices).
- **Project details:** concise *Development → Problem → Solution → Technologies → GitHub* descriptions.
- **Journey & studies:** development experience, ongoing education, and a technology stack using **Simple Icons**.
- **Contact:** links to email, GitHub, and LinkedIn.

Project pages have their own URLs so they can be shared directly, while navigation between sections happens within the React interface.

## Featured projects

| Project | Description | Source |
| --- | --- | --- |
| **Fracxion** | Multi-company business management: customers, internal invoices, payments, inventory, and access control. | [GitHub](https://github.com/nelsonvis3/fracxion-facturador) |
| **Ragnar Suplementos** | E-commerce experience with catalog management, checkout, orders, and inventory for a real client. | [GitHub](https://github.com/nelsonvis3/ragnarsuplementosfsa) |
| **RoadLedger** | An educational truck-trip planning prototype combining routes, timelines, and printable daily logs. | [GitHub](https://github.com/nelsonvis3/ELD-trip-planner) |

## Technology

| Area | Tools |
| --- | --- |
| UI | React 19, TypeScript, CSS |
| Development & build | Vite |
| Animation | GSAP, CSS transitions |
| Brand and technology logos | [Simple Icons](https://simpleicons.org/) SVG paths |
| Hosting | Vercel (static output in `dist/`) |

The color palette is **Midnight Violet**: navy `#0B1224`, near-white `#F2F5FF`, violet `#AA9BFF`, and restrained rose `#EF839A`. The favicon follows the same palette.

The UI respects `prefers-reduced-motion`. The subtle purple cursor spotlight is limited to devices with a fine pointer and hover support.

## Run locally

**Requirements:** Node.js **20.19+** and npm.

```bash
git clone https://github.com/nelsonvis3/myportfolio.git
cd myportfolio
npm install
npm run dev
```

Open **http://127.0.0.1:5173**. Vite provides hot module replacement during development.

For type checking and a production preview:

```bash
npm run typecheck
npm run build
npm run preview
```

Open **http://127.0.0.1:4173** for the local production preview.

> Note: These commands apply to the **Vite + React migration**, not the previous custom TypeScript site generator. If `main` has not been updated yet, checkout the migration branch first.

## Pages and navigation

The production build pre-renders **8 HTML entry points** to support link sharing and search engines:

- `/` and `/en/` — Spanish and English homepages.
- `/proyectos/fracxion/`, `/proyectos/ragnar-suplementos/`, `/proyectos/roadledger/`.
- `/en/projects/fracxion/`, `/en/projects/ragnar-suplementos/`, `/en/projects/roadledger/`.

On the homepage, the About, Projects, Journey, and Contact sections use URL hashes and browser history. The pre-rendering script also outputs `sitemap.xml` and `robots.txt` and adds canonical, `hreflang`, and social metadata to generated pages.

## Project structure

```text
public/
  favicon.svg          Navy/violet N favicon
  favicon.ico          Fallback for browsers
  apple-touch-icon.png Home-screen icon
  img/                 Project screenshots and social previews
  fonts/               Mona Sans and Inter
  cv.pdf               Spanish CV
  cv-en.pdf            English CV
src/
  App.tsx              Navigation and page components
  main.tsx             React entry point
  data.ts              Bilingual copy, project data, and routes
  components/
    BrandIcon.tsx      Simple Icons and UI icons
  render/
    logos.ts           Original Simple Icons SVG paths
  styles/
    globals.css        Midnight Violet design system
scripts/
  prerender.mjs        Static ES/EN page generation
index.html
vite.config.ts
vercel.json
```

**Important:** `src/render/logos.ts` comes from the original repository. The new frontend reuses its paths; do not delete this file when migrating. Images, fonts, and CV files are reused from the existing `public/` directory.

## Deploy to Vercel

The existing Vercel project and domain can be kept. The production configuration uses:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Production branch:** `main` (once the migration is tested and merged)

Build a preview deployment from the migration branch and verify the project images, bilingual routes, favicon, downloads, and mobile layout before merging.

To override the canonical site origin during build:

```bash
SITE_URL=https://your-domain.example npm run build
```

## License and credits

The repository's source code is released under the [MIT License](LICENSE). Portfolio copy, CVs, and project screenshots are not covered by that license.

Technology brand marks are sourced from [Simple Icons](https://simpleicons.org/) (CC0). **Mona Sans** and **Inter** are included under the SIL Open Font License; the corresponding license files live in `public/fonts/`.

---

### En español

Portfolio bilingüe de **Nelson Sivisstum**, desarrollador full stack junior de Formosa, Argentina. Presenta proyectos propios y para clientes, con explicaciones breves del desarrollo, el problema y la solución técnica. Está construido con **Vite, React y TypeScript**, utiliza **Simple Icons**, animaciones discretas y un diseño adaptable a escritorio y móvil.

**[Ver portfolio](https://nelsonsivisstum.vercel.app/)** · **[Ver proyectos](https://nelsonsivisstum.vercel.app/#projects)**
