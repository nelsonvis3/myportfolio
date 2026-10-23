# Technical Stack — scoped scroll update

This patch is based on the prior Studies Dates update.

- Adds **Figma**, **REST APIs / APIs REST**, and **Linux** to the Journey & Studies technical stack.
- Uses existing Simple Icons for Figma and Linux; REST APIs get a simple neutral code glyph.
- Increases tag typography, spacing, and icon size.
- Mouse cursor remains a normal arrow over these noninteractive tags.
- Adds a narrow purple **scrollbar only inside the Technical Stack list**. No other section receives an inner scrollbar.
- Preserves readable normal page scrolling on smaller windows and mobile.

## Fish shell

```fish
cd ~/Documentos/Portfolio/portfolio-nelson
unzip -o ~/Descargas/portfolio-tech-stack-update.zip -d .
npm run typecheck
npm run build
```

This patch changes only `src/App.tsx` and `src/styles/globals.css`. It assumes your existing Vite portfolio retains `src/render/logos.ts` with the Simple Icons entries for `figma` and `linux`.
