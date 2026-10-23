#!/usr/bin/env python3
"""Apply the agreed bilingual hero, projects and SEO copy to nelsonvis3/myportfolio.

Run from the root of your local Git repository:
    python /path/to/apply_portfolio_copy.py

The script checks every expected original before writing any file. It does not
commit, push, install dependencies, or modify project case studies.
"""
from __future__ import annotations

import sys
from pathlib import Path


REPLACEMENTS: dict[str, list[tuple[str, str]]] = {
    "src/content/es.ts": [
        (
            '''    title: "Nelson Sivisstum, desarrollador full stack",
    description: "Desarrollador full stack en Formosa, Argentina. Proyectos con React, Next.js, TypeScript y Django: Fracxion, Ragnar Suplementos y RoadLedger.",
    ogAlt: "Nelson Sivisstum, desarrollador full stack",''',
            '''    title: "Nelson Sivisstum | Desarrollador Full Stack Junior",
    description: "Nelson Sivisstum, desarrollador Full Stack Junior en Argentina. Aplicaciones web con frontend, backend, APIs, bases de datos y pruebas.",
    ogAlt: "Nelson Sivisstum, desarrollador Full Stack Junior",''',
        ),
        ('    role: "Desarrollador full stack",', '    role: "Desarrollador Full Stack Junior",'),
        (
            '''  hero: {
    eyebrow: "Nelson Sivisstum · Desarrollador full stack",
    title: ["Bienvenido a", "mi portfolio"],
    lines: ["Desarrollo aplicaciones web de punta a punta,", "y uso IA para entregarlas más rápido."],
    note: "Trabajo con React, Next.js y Django. Uso Claude Code y Codex todos los días, y reviso cada cambio antes de que entre.",
    primary: "Ver proyectos", secondary: "Escribime",
  },''',
            '''  hero: {
    eyebrow: "Nelson Sivisstum",
    title: ["Desarrollador", "Full Stack Junior"],
    lines: [
      "Desarrollo aplicaciones web de principio a fin: interfaces, APIs, lógica de negocio y bases de datos.",
      "Implemento autenticación, permisos y pruebas para verificar su funcionamiento.",
    ],
    note: "Formosa, Argentina · Disponible para trabajo remoto. Busco incorporarme a un equipo de desarrollo.",
    primary: "Ver proyectos", secondary: "Escribime",
  },''',
        ),
        (
            '''  work: {
    eyebrow: "Proyectos",
    title: "Tres proyectos, de punta a punta",
    lead: "Tres aplicaciones completas. Explorá sus funciones y las decisiones técnicas detrás de cada una.",
    open: "Ver el caso",
  },''',
            '''  work: {
    eyebrow: "Mi trabajo",
    title: "Proyectos destacados",
    lead: "En cada caso muestro lo que desarrollé, las decisiones técnicas que tomé y cómo lo probé.",
    open: "Ver el caso",
  },''',
        ),
    ],
    "src/content/en.ts": [
        (
            '''    title: "Nelson Sivisstum, full stack developer",
    description: "Full stack developer in Formosa, Argentina. Projects built with React, Next.js, TypeScript and Django: Fracxion, Ragnar Suplementos and RoadLedger.",
    ogAlt: "Nelson Sivisstum, full stack developer",''',
            '''    title: "Nelson Sivisstum | Junior Full Stack Developer",
    description: "Nelson Sivisstum, Junior Full Stack Developer based in Argentina. Explore my web applications, technical projects, development skills and CV.",
    ogAlt: "Nelson Sivisstum, Junior Full Stack Developer",''',
        ),
        ('    role: "Full stack developer",', '    role: "Junior Full Stack Developer",'),
        (
            '''  hero: {
    eyebrow: "Nelson Sivisstum · Full stack developer",
    title: ["Welcome to", "my portfolio"],
    lines: ["I build web applications end to end,", "and I use AI to ship them faster."],
    note: "I work with React, Next.js and Django. I use Claude Code and Codex every day, and I review every change before it goes in.",
    primary: "See my work", secondary: "Get in touch",
  },''',
            '''  hero: {
    eyebrow: "Nelson Sivisstum",
    title: ["Junior Full Stack", "Developer"],
    lines: [
      "I build web applications end to end, from user interfaces and APIs to business logic and databases.",
      "I implement authentication, access controls, and tests to verify their functionality.",
    ],
    note: "Based in Formosa, Argentina · Open to remote work. Seeking my first role on a development team.",
    primary: "View projects", secondary: "Get in touch",
  },''',
        ),
        (
            '''  work: {
    eyebrow: "Work",
    title: "Three projects, end to end",
    lead: "Three full-stack applications. Explore their features and the technical decisions behind each one.",
    open: "View case study",
  },''',
            '''  work: {
    eyebrow: "My work",
    title: "Selected Projects",
    lead: "Each case study shows what I built, the technical decisions I made, and how I tested it.",
    open: "View case study",
  },''',
        ),
    ],
    "src/render/home.ts": [
        (
            '''        <a class="btn btn-accent" href="#${c.ids.projects}">${esc(c.hero.primary)}</a>
        <a class="btn btn-glass" href="#${c.ids.contact}">${esc(c.hero.secondary)}</a>''',
            '''        <a class="btn btn-accent" href="#${c.ids.projects}">${esc(c.hero.primary)}</a>
        <a class="btn btn-glass" href="${socials.cv[c.lang]}" download>${esc(c.availability.cv)}</a>
        <a class="btn btn-glass" href="#${c.ids.contact}">${esc(c.hero.secondary)}</a>''',
        ),
    ],
    "src/styles.css": [
        (
            '.hero h1 { font-size: clamp(3rem, 7.4vw, 6.6rem); line-height: .98; letter-spacing: -.045em; margin-top: 20px; }',
            '.hero h1 { font-size: clamp(2.8rem, 5.7vw, 5.25rem); line-height: .98; letter-spacing: -.045em; margin-top: 20px; }',
        ),
    ],
}


def main() -> int:
    root = Path.cwd()
    updates: dict[Path, str] = {}
    changed: list[str] = []
    try:
        for relative, pairs in REPLACEMENTS.items():
            path = root / relative
            original = path.read_text(encoding="utf-8")
            revised = original
            for old, new in pairs:
                count = revised.count(old)
                if count == 1:
                    revised = revised.replace(old, new, 1)
                elif count == 0 and revised.count(new) == 1:
                    continue  # Already applied; safe to rerun.
                else:
                    raise ValueError(f"Unexpected content in {relative}: expected one matching block, found {count}. No files changed.")
            if revised != original:
                updates[path] = revised
                changed.append(relative)
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    if not updates:
        print("All approved copy changes are already applied.")
        return 0

    for path, revised in updates.items():
        path.write_text(revised, encoding="utf-8")
    print("Updated:")
    for relative in changed:
        print(f"  {relative}")
    print("\nNext: npm run build && git diff --check && git diff")
    print("This script does not commit or push changes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
