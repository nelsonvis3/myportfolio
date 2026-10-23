# Portfolio migration — Technical Editorial (Vite + React + TypeScript)

This patch is intended to be extracted **on top of your existing `nelsonvis3/myportfolio` checkout**.
It reuses your real assets (`public/img/`, `public/fonts/`, downloadable CV PDFs) and **your exact Simple Icons collection** at `src/render/logos.ts`.

## 1. Work on a new local branch, not main

```fish
cd ~/Documentos/Portfolio/portfolio-nelson
# Only run the next command if your working tree is clean:
git status --short
git switch main
git pull --ff-only
git switch -c refactor/vite-react-minimal-portfolio
```

If the branch already exists, switch to it instead. The GitHub connector could not create a remote branch (HTTP 403), so this local command is necessary.

## 2. Apply the migration ZIP

Put the downloaded ZIP somewhere convenient (e.g. `~/Descargas/portfolio-vite-projects-inline-v3.zip`), then extract its contents **into the root of the existing portfolio repository**, overwriting the matching new config files. For example:

```fish
unzip -o ~/Descargas/portfolio-vite-projects-inline-v3.zip -d .
```

Do **not** delete `public/` or `src/render/logos.ts`. The old `src/build.ts`, `src/content/`, `src/web/`, and template renderers will remain in your checkout but will not be used by the new Vite entrypoint. They can be cleaned up after validation.

## 3. Install and test

```fish
npm install
npm run typecheck
npm run dev
```

Open `http://127.0.0.1:5173`.

To verify the static bilingual production output:

```fish
npm run build
npm run preview
```

Open `http://127.0.0.1:4173`. This should generate 8 prerendered pages, including the six existing project URLs, `robots.txt` and `sitemap.xml`.

## 4. Test checklist

- Spanish `/` and English `/en/` load, including the language switch on mobile.
- The editorial sidebar displays About, Projects, Journey & studies, and Contact, without numbered labels.
- Section switching updates the URL hash and supports Back/Forward. No buttons or links have decorative arrow icons.
- The Projects view uses a screenshot inside the hovered or focused project row on desktop, and visible images within each project on mobile. Each project links to a full detail view with Development / Problem / Solution / Technologies / GitHub only.
- Reloading `/proyectos/fracxion/`, `/proyectos/ragnar-suplementos/`, `/proyectos/roadledger/` and `/en/projects/.../` loads the right project without a 404.
- Each project uses its real image and the original Simple Icons SVG paths.
- The Spanish and English CV download correctly.
- Keyboard navigation, focus, mobile layout and `prefers-reduced-motion` work.
- Inspect generated HTML for `canonical`, `hreflang`, social tags and server-rendered project text.

## 5. Deploy safely

Commit and push the changes yourself only after testing. Create a Vercel Preview deployment for your new branch and check it before merging into `main`. **Do not switch the current production deployment until the preview is verified.**

## What is intentionally removed from the presentation

- Horizontal pinned scrolling projects, custom star cursor/trail, parallax, 3D tilts, word-based scroll effects.
- Project demos, video links and separate technical-study subsections *in the displayed layout*.
- Old content has not been deleted, so the data and history remain available for later revisions.

## Known environmental validation limitation

This migration was authored and syntax-checked in an offline execution environment; installing npm packages and running a complete browser build was not possible here. Run the commands above before considering the migration production-ready.

## Midnight Violet revision (October 23, 2026)

This is the latest styling revision, designed to address feedback about generic visuals, top-heavy spacing and overly large text:

- **Palette:** navy `#0B1224` (both main and sidebar), `#F2F5FF` (primary text), `#B9C8DD` (secondary text), `#AA9BFF` (interactive accent), `#EF839A` (small highlight). This is a new scheme, not the earlier charcoal/amber/olive palette.
- **Layout:** aligned left and right columns, content begins at ~52px from the top on wide screens (previously up to 118px, plus an extra introduction gap). The About section no longer has a forced minimum height or a large top offset; spacing flows naturally, with shorter bottom gaps.
- **Typography:** much smaller name, navigation, About headline, Projects, Journey, and Contact headings. Content uses compact, comfortable line-height and max-width.
- **Projects:** full-width typographic index with screenshots revealed inside each project on hover/focus, and brief development summaries visible in the index. Deep-link case-study routes still show Development / Problem / Solution / Technologies / GitHub only. No arrows and no numeric prefixes.
- **Journey:** dates, education, and the technology stack have closer, consistent spacing; technology names use small bordered tags with Simple Icons.
- **Writing:** reviewed and shortened Spanish/English profile descriptions, education timeline, and section intros. User qualifications are not inflated.
- **Reference:** studied Brittany Chiang's content-first dark navy portfolio: sticky identity and navigation on the left, clear engineering evidence on the right. This is an original adaptation, not a pixel copy.

Alternative color palettes considered: **Ocean Crimson** (`#091426`, `#12243A`, `#EDF3FD`, `#ACBFD8`, `#F27A8D`, `#819EFF`) and **Indigo Slate** (`#10162D`, `#1B2443`, `#F5F5FD`, `#B5BEDA`, `#C5A7FA`, `#EF9AAC`). Midnight Violet is the default. You can switch palettes by editing the CSS custom properties under `:root` in `src/styles/globals.css`.

### Validation

CSS parsed without syntax errors; TS/TSX passed TypeScript syntax diagnostics. The execution environment is offline and prevented launching a browser test, so **a real Vite build, asset loading and visual testing are still required locally**. The ZIP remains an overlay for the original checkout, not a standalone checkout.

Your current production branch and deployment have not been changed.

## Editorial refinement (October 23, 2026)

- Unified navy `#0B1224` background across both columns; sidebar divider removed.
- Removed the availability marker and bottom copyright/technology footer entirely.
- Changed About to a small role heading and three personal, grounded paragraphs in ES and EN.
- Removed the redundant location/focus strip from About, keeping the CV and Projects links.
- Language toggle is left-aligned above the enlarged GitHub/LinkedIn/email icons in the sidebar footer area.
- Header sizes reduced by 2px where appropriate; smaller About role heading.
- Mouse-controlled, very faint purple radial glow using requestAnimationFrame. Disabled on coarse pointers and for reduced-motion users.
- Journey stack is part of the scrollable content flow with generous lower padding; no sticky footer can overlap it.
- The ZIP is an overlay: preserve original `public/` assets and `src/render/logos.ts`.

### Verification performed for this revision

- Parsed the updated CSS with `tinycss2` (no parse errors).
- Parsed all edited TS/TSX source files with TypeScript compiler 5.8 syntax diagnostics (no parse errors).
- Confirmed that no footer, availability marker, or sidebar dividing border remain in the React layout.
- Full dependency installation, Vite production build and visual browser regression checks could not be completed in this container. Test locally before committing.


## Full-width Projects revision (October 23, 2026)

- Removed the separate right-hand project screenshot panel entirely.
- Project index now fills the available right-side content area (no maximum 820px width imposed on Projects).
- On desktop mouse hover or keyboard focus, the screenshot appears **inside the hovered project's row**, positioned to the right of its title and description. No arrows or numbered labels.
- Images retain their original aspect ratio using `width: auto`, `height: auto`, `max-width: 100%`, and `object-fit: contain`; no `object-fit: cover` cropping.
- Rows that are not active use the full width for text instead of reserving an empty image column.
- Touch/mobile shows screenshots directly inside their project rows, as hover isn't available.
- CSS and TypeScript syntax verified. A Chromium layout check using test images passed at viewport widths 1650, 1280, 850, 390 and 320px, with no horizontal page overflow. The check used synthetic placeholders rather than the original project images; test the actual image loading locally after applying the ZIP. Full npm/Vite build not verified in this offline environment.
