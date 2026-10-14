import { profile } from "../data/profile.js";
import { socials, siteUrl } from "../data/socials.js";
import { esc, ext, arrow } from "./shared.js";
import { introBootstrap, introMarkup } from "./intro.js";
const nav = [["proyectos", "Proyectos"], ["sobre-mi", "Sobre mí"], ["enfoque", "Cómo trabajo"], ["contacto", "Contacto"]];

export function layout(title: string, description: string, path: string, body: string): string {
  const canonical = siteUrl ? siteUrl + path : "";
  const schema = JSON.stringify({
    "@context": "https://schema.org", "@type": "Person", name: profile.name,
    jobTitle: profile.role, ...(siteUrl ? { url: siteUrl } : {}), sameAs: [socials.github, socials.linkedin]
  }).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="es"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${path === "/" ? introBootstrap() : ""}
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}"><meta property="og:url" content="${esc(canonical)}">` : ""}
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website"><meta property="og:locale" content="es_AR"><meta property="og:site_name" content="Nelson Sivisstum">
${siteUrl ? `<meta property="og:image" content="${esc(siteUrl)}/img/social-preview.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Nelson Sivisstum — Full Stack · React, Next.js y Django"><meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
<meta name="theme-color" content="#0A0D12"><link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/space-grotesk-latin.woff" as="font" type="font/woff" crossorigin>
<link rel="preload" href="/fonts/instrument-sans-latin.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${schema}</script>
</head><body>
${path === "/" ? introMarkup() : ""}
<a class="skip-link" href="#main">Saltar al contenido</a>
<header class="site-header"><div class="wrap"><nav class="main-nav" aria-label="Principal">
<a class="identity" href="/"><span class="monogram" aria-hidden="true">n<span>s</span></span><span>Nelson<br> Sivisstum</span></a>
<p class="nav-caption">Desarrollador Full Stack<br><span>Formosa, Argentina</span></p>
<button class="menu-toggle" id="menu" aria-expanded="false" aria-controls="nav-links">Menú <span aria-hidden="true">+</span></button>
<ul id="nav-links">${nav.map(([id, name]) => `<li><a href="/#${id}" data-section="${id}">${name}<span class="nav-dot" aria-hidden="true"></span></a></li>`).join("")}</ul>
</nav></div></header>
<main id="main" tabindex="-1">${body}</main>
<footer class="site-footer"><div class="wrap footer-line"><a href="/">© ${new Date().getFullYear()} Nelson Sivisstum</a><span lang="en">Design with intention. Engineer with precision.</span><a href="#main">Volver arriba ${arrow}</a></div></footer>
<dialog id="image-viewer" class="image-viewer" aria-labelledby="viewer-caption"><button type="button" class="viewer-close" aria-label="Cerrar captura">Cerrar ×</button><img id="viewer-image" alt=""><p id="viewer-caption"></p></dialog>
<script type="module" src="/client.js"></script></body></html>`;
}
