import { mkdirSync, writeFileSync, rmSync, existsSync, cpSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build as bundle } from "esbuild";
import { content, langs, siteUrl, homePath, casePath, other } from "./content/site.js";
import { layout } from "./render/layout.js";
import { home, type Videos } from "./render/home.js";
import { casePage } from "./render/case.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const dist = join(root, "dist");
const write = (path: string, text: string) => { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, text); };

rmSync(dist, { recursive: true, force: true });
cpSync(join(root, "public"), dist, { recursive: true });
write(join(dist, "styles.css"), ["styles.css", "journey.css"].map(file => readFileSync(join(root, "src", file), "utf8")).join("\n"));

// JS del navegador: client (todas las páginas) y home (3D + efectos de texto de React Bits).
const common = { bundle: true, format: "esm" as const, target: "es2020", minify: true, legalComments: "eof" as const, logLevel: "warning" as const };
await bundle({ ...common, entryPoints: [join(root, "src", "client.ts")], outfile: join(dist, "client.js") });
// La home se divide en chunks: home.js es chico y la escena y las islas llegan con import() (ver three/main.ts).
await bundle({ ...common, entryPoints: { home: join(root, "src", "three", "main.ts") }, outdir: dist, splitting: true, chunkNames: "chunks/[name]-[hash]", jsx: "automatic", loader: { ".css": "empty" } });

// Videos de los proyectos (renderizados con Hyperframes, ver video/README.md).
const ids = content.es.projects.map(p => p.id);
const videos: Videos = Object.fromEntries(ids.map(id => [id,
  existsSync(join(root, "public", "video", `${id}.mp4`)) ? { src: `/video/${id}.mp4`, poster: `/video/${id}.jpg` } : undefined]));

const urls: string[] = [];
for (const lang of langs) {
  const c = content[lang], alt = other(lang);
  write(join(dist, homePath(lang), "index.html"), layout({
    c, home: true, title: c.meta.title, description: c.meta.description,
    path: homePath(lang), altPath: homePath(alt), body: home(c, videos), scripts: ["/home.js"],
  }));
  urls.push(homePath(lang));
  for (const p of c.projects) {
    write(join(dist, casePath(lang, p.id), "index.html"), layout({
      c, title: `${p.name}: ${p.tagline} | Nelson Sivisstum`, description: p.summary,
      path: casePath(lang, p.id), altPath: casePath(alt, p.id), body: casePage(c, p, videos),
    }));
    urls.push(casePath(lang, p.id));
  }
}
write(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${siteUrl}${url}</loc></url>`).join("")}</urlset>\n`);
write(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
for (const file of ["cv.pdf", "cv-en.pdf"]) if (!existsSync(join(dist, file))) throw new Error(`Falta public/${file}`);
console.log(`dist/ generado: ${urls.length} páginas (es + en). Dominio: ${siteUrl}`);
