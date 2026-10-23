# Portfolio — About Me + Git/GitHub

This is a **minimal targeted patch**, not an old snapshot of the portfolio. It edits only `src/data.ts`, `src/App.tsx`, and `src/render/logos.ts` in your **current** repository. Run it with Python from the project root (Fish is supported):

```fish
cd ~/Documentos/Portfolio/portfolio-nelson
python3 ~/Descargas/portfolio-about-git-update/apply_portfolio_changes.py .
git diff -- src/data.ts src/App.tsx src/render/logos.ts
npm run build
```

**Changes:** restores the approved bilingual About Me text without naming individual projects; keeps the original first Spanish paragraph; keeps the sidebar subtitle; adds a `DevOps & tools` category containing Git, GitHub, Docker, Linux, and Nginx; keeps Node.js under Backend; displays official Simple Icons for Git, GitHub, Redis, and Nginx; keeps the existing CSS and sidebar unchanged.

The script accepts source files from the currently verified `main` branch as well as the prior stack patch when Git/GitHub are already present. It refuses to write if it sees unrecognized About Me text or an unexpected component structure. Run it only on a trusted repository and review `git diff` before committing.

```fish
git add src/data.ts src/App.tsx src/render/logos.ts
git commit -m "feat: improve About Me and add Git tools to stack"
git push
```

GitHub did not allow editing through the connected account (HTTP 403), so this ZIP does not automatically publish the changes.
