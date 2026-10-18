import type { Content } from "../content/types.js";
import { socials, siteUrl, homePath, other } from "../content/site.js";
import { esc, ext, json } from "./shared.js";
import { icon, logo } from "./icons.js";

interface Page {
  c: Content;
  title: string;
  description: string;
  path: string;          // ruta de esta página
  altPath: string;       // la misma página en el otro idioma
  body: string;
  home?: boolean;
}

export function layout({ c, title, description, path, altPath, body, home = false }: Page): string {
  const alt = other(c.lang);
  const homeHref = homePath(c.lang);
  const anchor = (id: string) => (home ? `#${id}` : `${homeHref}#${id}`);
  const nav: [string, string][] = [
    [c.ids.projects, c.ui.nav.projects], [c.ids.about, c.ui.nav.about], [c.ids.stack, c.ui.nav.stack], [c.ids.contact, c.ui.nav.contact],
  ];
  const links = nav.map(([id, label]) => `<li><a href="${anchor(id)}">${esc(label)}</a></li>`).join("");
  const schema = json({
    "@context": "https://schema.org", "@type": "Person", name: "Nelson Sivisstum", jobTitle: c.ui.role,
    url: siteUrl, sameAs: [socials.github, socials.linkedin], address: { "@type": "PostalAddress", addressLocality: "Formosa", addressCountry: "AR" },
  });
  const og = `${siteUrl}/img/social-preview${c.lang === "en" ? "-en" : ""}.png`;
  return `<!doctype html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
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
<meta name="theme-color" content="#171513">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/mona-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${schema}</script>
</head>
<body class="${home ? "home" : "page"}">
<a class="skip" href="#main">${esc(c.ui.skip)}</a>
<header class="header">
  <div class="nav-pill">
    <a class="wordmark" href="${homeHref}">Nelson Sivisstum</a>
    <nav class="nav" aria-label="${c.lang === "es" ? "Principal" : "Main"}"><ul id="nav-links">${links}</ul></nav>
    <div class="header-tools">
      <a class="lang" href="${altPath}" hreflang="${alt}" lang="${alt}" aria-label="${esc(c.ui.switchLangLabel)}">${esc(c.ui.switchLang)}</a>
      <a class="circle" href="mailto:${socials.email}" aria-label="${esc(c.ui.email)}">${icon("mail")}</a>
      <button type="button" class="circle menu-toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="${esc(c.ui.menu)}" data-label-open="${esc(c.ui.menu)}" data-label-close="${esc(c.ui.close)}"><span></span><span></span></button>
    </div>
  </div>
  <nav class="nav-menu" id="nav-menu" aria-label="${c.lang === "es" ? "Menú" : "Menu"}" hidden><ul>${links}</ul></nav>
</header>
<main id="main" tabindex="-1">${body}</main>
<footer class="footer">
  <div class="wrap footer-row">
    <a class="wordmark" href="${homeHref}">Nelson Sivisstum</a>
    <ul class="footer-nav">${links}</ul>
    <div class="footer-social">
      <a class="circle" ${ext(socials.github)} aria-label="GitHub">${logo("github")}</a>
      <a class="circle" ${ext(socials.linkedin)} aria-label="LinkedIn">${icon("linkedin")}</a>
    </div>
  </div>
  <p class="footer-line">© ${new Date().getFullYear()} Nelson Sivisstum · ${esc(c.footer.line)} <a href="#main" data-to-top>${esc(c.ui.backToTop)} ↑</a></p>
</footer>
<script type="module" src="/client.js"></script>
</body>
</html>`;
}
