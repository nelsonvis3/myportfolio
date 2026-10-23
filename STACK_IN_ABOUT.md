# Portfolio update — Technical Stack in About Me

Apply over the **latest Vite portfolio** after the Studies Dates and Technical Stack updates.

## What changed

- Removes **REST APIs** from the stack.
- Moves **Technical Stack** from **Journey & Studies** into **About Me**, immediately after the introduction / action links.
- Four compact categories: Frontend; Backend; Data & Infrastructure; Testing & Design.
- React, Next.js, TypeScript, JavaScript, Tailwind CSS, Vite, Python, Django, Node.js, PostgreSQL, MySQL, Docker, Linux, Playwright, Figma.
- All supported brand icons use the existing official Simple Icons paths. `Node.js` and `MySQL` add official Simple Icons paths (from `simple-icons/simple-icons`); Playwright, which Simple Icons currently excludes, uses a neutral testing symbol rather than an incorrectly labeled brand icon.
- Slightly larger labels, normal cursor, keyboard-accessible stack region, and one thin violet internal scrollbar **only within Technical Stack** when needed.
- Preserves the page's natural scrolling in other sections and on narrow screens.
- Both ES / EN, with no content changes to your project detail pages, dates, README, favicon or images.

## Install

```fish
cd ~/Documentos/Portfolio/portfolio-nelson
unzip -o ~/Descargas/portfolio-stack-about-categories.zip -d .
npm run typecheck
npm run build
npm run dev
```

**Modified files:** `src/App.tsx`, `src/styles/globals.css`, `src/components/BrandIcon.tsx`.

Note: The ZIP is an overlay, not a standalone project. Keep your original `src/render/logos.ts`, `public/`, `src/data.ts`, and `node_modules/`.
