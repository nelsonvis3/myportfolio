#!/usr/bin/env python3
"""Update Ragnar's ES/EN portfolio case study and live demo link.
Run from the root of the local myportfolio repository.
Safe to run before or after the earlier Docker/Nginx patch; can be run again.
Does not commit, push, or touch Ragnar's deployment.
"""
from pathlib import Path


def replace_one(text: str, old: str, new: str, *, label: str) -> str:
    # Idempotent: lets you run this after applying the previous script, too.
    if new in text:
        print(f"Already updated: {label}")
        return text
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected one match, found {count}. Files were NOT changed.")
    return text.replace(old, new, 1)


def update_section(path: Path, start: str, end: str, replacements: list[tuple[str, str, str]]) -> tuple[Path, str]:
    original = path.read_text(encoding="utf-8")
    if original.count(start) != 1 or original.count(end) != 1:
        raise RuntimeError(f"Could not uniquely find Ragnar section in {path}.")
    a = original.index(start)
    b = original.index(end, a)
    before, section, after = original[:a], original[a:b], original[b:]
    for old, new, label in replacements:
        section = replace_one(section, old, new, label=f"{path.name}: {label}")
    return path, before + section + after


es = Path("src/content/es.ts")
en = Path("src/content/en.ts")
for path in (es, en):
    if not path.is_file():
        raise SystemExit(f"Missing {path}. Run this script from your myportfolio repo root.")

es_replacements = [
    (
        'repo: "https://github.com/nelsonvis3/ragnarsuplementosfsa", demo: "", demoLabel: "",',
        'repo: "https://github.com/nelsonvis3/ragnarsuplementosfsa", demo: "https://ragnarsuplementos.tail7dbbb0.ts.net/", demoLabel: "Ver demo en vivo",',
        "Ragnar live demo URL and Spanish label",
    ),
    (
        'stack: ["Next.js", "React", "TypeScript", "Django", "PostgreSQL", "Zustand"],',
        'stack: ["Next.js", "React", "TypeScript", "Django", "PostgreSQL", "Zustand", "Docker", "Nginx"],',
        "Ragnar stack",
    ),
    (
        'role: "Desarrollé la tienda y la API, armé el panel de administración del catálogo y trabajé en los pedidos, las reservas de inventario y las integraciones de pagos y envíos.",',
        'role: "Desarrollé la tienda y la API, armé el panel de administración del catálogo y trabajé en los pedidos, el inventario y las integraciones. También monté una demostración del sistema en Ubuntu Server con Docker Compose y Nginx.",',
        "Ragnar role",
    ),
    (
        'text: "Next.js, React y TypeScript arman la tienda. Zustand guarda el carrito en el navegador. Django REST Framework expone catálogo, pedidos e inventario, y PostgreSQL los guarda en producción.",',
        'text: "Next.js y React presentan la tienda; Django REST Framework gestiona el catálogo, los pedidos y el inventario, con PostgreSQL y Redis. Desplegué esta arquitectura en una VM Ubuntu Server mediante Docker Compose: Nginx centraliza las rutas hacia el frontend y la API, y Tailscale Funnel habilita acceso HTTPS público para una demostración. Como el servidor está en mi PC, la demo solo está disponible mientras el equipo permanezca encendido.",',
        "Ragnar architecture intro",
    ),
    (
        '          { name: "PostgreSQL", detail: "Catálogo, pedidos y reservas." },\n',
        '          { name: "PostgreSQL", detail: "Catálogo, pedidos y reservas." },\n'
        '          { name: "Docker Compose + Nginx", detail: "Contenedores para web, API, base de datos, caché y worker; un proxy inverso para / y /api/." },\n'
        '          { name: "Ubuntu Server + Tailscale Funnel", detail: "VM local con acceso HTTPS público bajo demanda; no es un hosting permanente." },\n',
        "Ragnar architecture services",
    ),
    (
        '      challenges: [\n',
        '      challenges: [\n'
        '        { title: "Desplegar frontend y backend juntos", problem: "Quería probar la aplicación completa en un servidor Linux sin contratar todavía un VPS, manteniendo separados el frontend, la API y los datos.", solution: "Configuré Docker Compose en Ubuntu Server para orquestar Next.js, Django, PostgreSQL, Redis y un worker. Nginx concentra el acceso a la web y /api/; Tailscale Funnel publica una demo HTTPS desde mi VM local, disponible solo cuando mi PC está encendida.", source: "compose.yaml, deploy/Dockerfile.frontend, deploy/nginx/https.conf.template", sourceUrl: "https://github.com/nelsonvis3/ragnarsuplementosfsa/blob/main/compose.yaml" },\n',
        "Ragnar deployment challenge",
    ),
    (
        '      verification: "54 pruebas de backend ejecutadas en entorno local.",',
        '      verification: "54 pruebas de backend ejecutadas en entorno local. También verifiqué el despliegue de demostración con Next.js, Nginx y el endpoint /api/health/.",',
        "Ragnar verification",
    ),
]

en_replacements = [
    (
        '      videoLabel: "",',
        '      demoLabel: "View live demo",\n      videoLabel: "",',
        "Ragnar English demo button label",
    ),
    (
        'role: "I built the store and the API, built the catalog admin panel and worked on orders, inventory reservations and the payment and shipping integrations.",',
        'role: "I built the storefront, API and catalog admin panel, and worked on orders, inventory and integrations. I also deployed a working demonstration on Ubuntu Server using Docker Compose and Nginx.",',
        "Ragnar role",
    ),
    (
        'text: "Next.js, React and TypeScript build the store. Zustand keeps the cart in the browser. Django REST Framework exposes the catalog, orders and inventory, and PostgreSQL stores them in production.",',
        'text: "Next.js and React power the storefront; Django REST Framework handles catalog, orders and inventory, backed by PostgreSQL and Redis. I deployed the stack on an Ubuntu Server VM with Docker Compose. Nginx routes traffic to the frontend and API, while Tailscale Funnel provides HTTPS access for a public demo. Because it runs on my PC, the demo is available only while the host is powered on.",',
        "Ragnar architecture intro",
    ),
    (
        '          { name: "PostgreSQL", detail: "Catalog, orders and reservations." },\n',
        '          { name: "PostgreSQL", detail: "Catalog, orders and reservations." },\n'
        '          { name: "Docker Compose + Nginx", detail: "Separate web, API, database, cache and worker containers behind one reverse proxy for / and /api/." },\n'
        '          { name: "Ubuntu Server + Tailscale Funnel", detail: "A local VM with on-demand public HTTPS access, not permanent cloud hosting." },\n',
        "Ragnar architecture services",
    ),
    (
        '      challenges: [\n',
        '      challenges: [\n'
        '        { title: "Deploying frontend and backend together", problem: "I wanted to test the complete application on a Linux server without renting a VPS yet, while keeping the frontend, API and data services separate.", solution: "I used Docker Compose on Ubuntu Server to run Next.js, Django, PostgreSQL, Redis and a worker. Nginx provides a single entry point for the site and /api/, and Tailscale Funnel exposes an HTTPS demo from my local VM while my PC is on.", source: "compose.yaml, deploy/Dockerfile.frontend, deploy/nginx/https.conf.template", sourceUrl: "https://github.com/nelsonvis3/ragnarsuplementosfsa/blob/main/compose.yaml" },\n',
        "Ragnar deployment challenge",
    ),
    (
        '      verification: "54 backend tests run locally.",',
        '      verification: "54 backend tests run locally. I also verified the demo deployment with Next.js, Nginx and the /api/health/ endpoint.",',
        "Ragnar verification",
    ),
]

# Compute both in memory first. If a match fails, neither file is written.
changes = [
    update_section(es, '      id: "ragnar-suplementos",', '      id: "roadledger",', es_replacements),
    update_section(en, '      ...base["ragnar-suplementos"],', '      ...base["roadledger"],', en_replacements),
]
for path, updated in changes:
    path.write_text(updated, encoding="utf-8")
    print(f"Updated {path}")
print("Done. Review: git diff -- src/content/es.ts src/content/en.ts")
