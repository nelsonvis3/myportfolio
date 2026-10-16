import type { Content } from "../content/types.js";
import { socials, siteUrl, homePath, other } from "../content/site.js";
import { esc, json } from "./shared.js";

interface Page {
  c: Content;
  title: string;
  description: string;
  path: string;          // ruta de esta página
  altPath: string;       // la misma página en el otro idioma
  body: string;
  home?: boolean;
  scripts?: string[];
}

// Antes del primer pintado: tema guardado o el del sistema.
const themeBoot = `<script>(function(){var t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t})()</script>`;

const themeIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/></svg>`;

export function layout({ c, title, description, path, altPath, body, home = false, scripts = [] }: Page): string {
  const alt = other(c.lang);
  const homeHref = homePath(c.lang);
  const anchor = (id: string) => (home ? `#${id}` : `${homeHref}#${id}`);
  const nav: [string, string][] = [
    [c.ids.projects, c.ui.nav.projects], [c.ids.ai, c.ui.nav.ai], [c.ids.about, c.ui.nav.about], [c.ids.contact, c.ui.nav.contact],
  ];
  const schema = json({
    "@context": "https://schema.org", "@type": "Person", name: "Nelson Sivisstum", jobTitle: c.ui.role,
    url: siteUrl, sameAs: [socials.github, socials.linkedin], address: { "@type": "PostalAddress", addressLocality: "Formosa", addressCountry: "AR" },
  });
  const og = `${siteUrl}/img/social-preview${c.lang === "en" ? "-en" : ""}.png`;
  return `<!doctype html>
<html lang="${c.lang}" data-theme="dark">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${themeBoot}
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${siteUrl}${path}">
<link rel="alternate" hreflang="${c.lang}" href="${siteUrl}${path}">
<link rel="alternate" hreflang="${alt}" href="${siteUrl}${altPath}">
<link rel="alternate" hreflang="x-default" href="${siteUrl}${c.lang === "es" ? path : altPath}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Nelson Sivisstum">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${siteUrl}${path}"><meta property="og:locale" content="${c.locale}">
<meta property="og:image" content="${og}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(c.meta.ogAlt)}"><meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)"><meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/anybody-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/martian-mono-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${schema}</script>
</head>
<body class="${home ? "home" : "page"}">
<a class="skip" href="#main">${esc(c.ui.skip)}</a>
<header class="header">
  <a class="wordmark" href="${homeHref}">Nelson Sivisstum</a>
  <nav class="nav" aria-label="${c.lang === "es" ? "Principal" : "Main"}">
    <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="nav-links">${esc(c.ui.menu)}</button>
    <ul id="nav-links">${nav.map(([id, label]) => `<li><a href="${anchor(id)}">${esc(label)}</a></li>`).join("")}</ul>
  </nav>
  <div class="header-tools">
    <a class="lang" href="${altPath}" hreflang="${alt}" lang="${alt}" aria-label="${esc(c.ui.switchLangLabel)}">${esc(c.ui.switchLang)}</a>
    <button type="button" class="theme-toggle" data-theme-toggle data-label-dark="${esc(c.ui.themeToDark)}" data-label-light="${esc(c.ui.themeToLight)}" aria-label="${esc(c.ui.themeToLight)}">${themeIcon}</button>
  </div>
</header>
<main id="main" tabindex="-1">${body}</main>
<footer class="footer">
  <span>© ${new Date().getFullYear()} Nelson Sivisstum</span>
  <a href="mailto:${socials.email}">${socials.email}</a>
</footer>
<script type="module" src="/client.js"></script>
${scripts.map(src => `<script type="module" src="${src}"></script>`).join("\n")}
</body>
</html>`;
}
