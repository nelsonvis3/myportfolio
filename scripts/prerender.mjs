/** Produce crawlable HTML for ES/EN and all 6 existing case-study URLs.
 * Visual transitions continue to work client-side after React hydration. */
import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";

const origin = (process.env.SITE_URL || "https://nelsonsivisstum.vercel.app").replace(/\/$/, "");
if (!/^https?:\/\//.test(origin)) throw new Error("SITE_URL must be a valid absolute URL");
const paths = ["/", "/en/", ...["fracxion", "ragnar-suplementos", "roadledger"].flatMap(id => [`/proyectos/${id}/`, `/en/projects/${id}/`])];
const template = await readFile(resolve("dist/index.html"), "utf8");
if (!template.includes('<div id="root"></div>')) throw new Error("Root HTML placeholder not found");
const vite = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
try {
  const { App } = await vite.ssrLoadModule("/src/App.tsx");
  const { readRoute, getProjects, caseUrl } = await vite.ssrLoadModule("/src/data.ts");
  const esc = s => String(s).replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  const replaceMeta = (html, regex, replacement) => html.replace(regex, () => replacement);
  const url = pathname => `${origin}${pathname}`;
  let sitemap = [];
  for (const pathname of paths) {
    const route = readRoute(pathname);
    const project = route.projectId ? getProjects(route.lang).find(p => p.id === route.projectId) : null;
    const title = project ? `${project.name} | Nelson Sivisstum` : route.lang === "es" ? "Nelson Sivisstum | Desarrollador Full Stack Junior" : "Nelson Sivisstum | Junior Full Stack Developer";
    const description = project ? project.development : route.lang === "es" ? "Portfolio de Nelson Sivisstum: desarrollador Full Stack Junior. Proyectos con React, Next.js, TypeScript, Python y Django." : "Portfolio of Nelson Sivisstum, Junior Full Stack Developer. Projects using React, Next.js, TypeScript, Python and Django.";
    const counterpart = project ? caseUrl(route.lang === "es" ? "en" : "es",project.id) : route.lang === "es" ? "/en/" : "/";
    const esUrl = route.lang === "es" ? pathname : counterpart;
    const enUrl = route.lang === "en" ? pathname : counterpart;
    const rendered = renderToString(createElement(App,{initial:route}));
    let html = template.replace('<div id="root"></div>',`<div id="root">${rendered}</div>`).replace('<html lang="es">',`<html lang="${route.lang}">`);
    html = replaceMeta(html, /<title>[^<]*<\/title>/,`<title>${esc(title)}</title>`);
    html = replaceMeta(html, /<meta name="description"[^>]*>/,`<meta name="description" content="${esc(description)}" />`);
    const head = [
      `<link rel="canonical" href="${url(pathname)}" />`,
      `<link rel="alternate" hreflang="es" href="${url(esUrl)}" />`,
      `<link rel="alternate" hreflang="en" href="${url(enUrl)}" />`,
      `<link rel="alternate" hreflang="x-default" href="${url(esUrl)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:title" content="${esc(title)}" />`,
      `<meta property="og:description" content="${esc(description)}" />`,
      `<meta property="og:url" content="${url(pathname)}" />`,
      `<meta property="og:image" content="${url(route.lang === "es" ? "/img/social-preview.png" : "/img/social-preview-en.png")}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"Person",name:"Nelson Sivisstum",jobTitle:route.lang === "es" ? "Desarrollador Full Stack Junior" : "Junior Full Stack Developer",url:origin,sameAs:["https://github.com/nelsonvis3","https://www.linkedin.com/in/nelsonsivisstum1/"]})}</script>`
    ].join("\n");
    html = html.replace("</head>",`${head}\n</head>`);
    // Retain visible, indexable project URLs even when no client JavaScript runs.
    const target = resolve("dist", pathname.replace(/^\//,""), "index.html");
    await mkdir(dirname(target),{recursive:true});
    await writeFile(target,html);
    sitemap.push(`<url><loc>${url(pathname)}</loc></url>`);
  }
  await writeFile(resolve("dist/sitemap.xml"),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap.join("")}</urlset>`);
  await writeFile(resolve("dist/robots.txt"),`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
  console.log(`Prerendered ${paths.length} bilingual pages and sitemap`);
} finally {
  await vite.close();
}
