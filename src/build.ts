import { mkdirSync, writeFileSync, rmSync, existsSync, cpSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build as bundle } from "esbuild";
import { content, langs, siteUrl, homePath, casePath, other } from "./content/site.js";
import { layout } from "./render/layout.js";
import { home } from "./render/home.js";
import { casePage, type Clips } from "./render/case.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const dist = join(root, "dist");
const write = (path: string, text: string) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, text); };

rmSync(dist, { recursive: true, force: true });
cpSync(join(root, "public"), dist, { recursive: true });
cpSync(join(root, "src", "styles.css"), join(dist, "styles.css"));

// JS del navegador: client.ts en todas las páginas. El scroll suave y las animaciones (motion.ts, con Lenis y GSAP)
// llegan con import() después del primer pintado.
await bundle({ bundle: true, format: "esm", target: "es2020", minify: true, legalComments: "eof", logLevel: "warning",
  entryPoints: [join(root, "src", "web", "client.ts")], outdir: dist, splitting: true, chunkNames: "chunks/[name]-[hash]" });

// Imágenes opcionales: public/img/nelson.* (foto de "Sobre mí") y public/img/hero.* (fondo del hero).
// Si no están, esas partes se arman sin imagen.
const image = (name: string) => ["webp", "jpg", "png"].map(e => `/img/${name}.${e}`).find(file => existsSync(join(root, "public", file)));
const images = { photo: image("nelson"), hero: image("hero") };

// Clips de "Cómo se usa": public/clips/<clip>-desktop.mp4 y, opcional, <clip>-mobile.mp4, cada uno con su póster .webp.
// El tamaño sale del póster (mismo cuadro que el video) para reservar el lugar antes de que cargue.
function webpSize(file: string): [number, number] {
  const b = readFileSync(file), kind = b.toString("ascii", 12, 16);
  if (kind === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (kind === "VP8L") { const bits = b.readUInt32LE(21); return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1]; }
  return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
}
const clipDir = join(root, "public", "clips");
const clips: Clips = {};
for (const file of existsSync(clipDir) ? readdirSync(clipDir) : []) {
  const match = /^(.+)-desktop\.mp4$/.exec(file);
  if (!match) continue;
  const name = match[1], mobile = existsSync(join(clipDir, `${name}-mobile.mp4`));
  clips[name] = { desktop: `/clips/${file}`, poster: `/clips/${name}-desktop.webp`, size: webpSize(join(clipDir, `${name}-desktop.webp`)),
    ...(mobile ? { mobile: `/clips/${name}-mobile.mp4`, mobilePoster: `/clips/${name}-mobile.webp` } : {}) };
}

const urls: string[] = [];
for (const lang of langs) {
  const c = content[lang], alt = other(lang);
  write(join(dist, homePath(lang), "index.html"), layout({
    c, home: true, title: c.meta.title, description: c.meta.description,
    path: homePath(lang), altPath: homePath(alt), body: home(c, clips, images),
  }));
  urls.push(homePath(lang));
  for (const p of c.projects) {
    write(join(dist, casePath(lang, p.id), "index.html"), layout({
      c, title: `${p.name}: ${p.tagline} | Nelson Sivisstum`, description: p.summary,
      path: casePath(lang, p.id), altPath: casePath(alt, p.id), body: casePage(c, p, clips),
    }));
    urls.push(casePath(lang, p.id));
  }
}
write(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${siteUrl}${url}</loc></url>`).join("")}</urlset>\n`);
write(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
for (const file of ["cv.pdf", "cv-en.pdf"]) if (!existsSync(join(dist, file))) throw new Error(`Falta public/${file}`);
console.log(`dist/ generado: ${urls.length} páginas (es + en). Dominio: ${siteUrl}`);
