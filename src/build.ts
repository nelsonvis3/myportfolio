import { mkdirSync, writeFileSync, copyFileSync, rmSync, existsSync, cpSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "./data/projects.js";
import { profile } from "./data/profile.js";
import { siteUrl } from "./data/socials.js";
import { layout } from "./render/layout.js";
import { home } from "./render/home.js";
import { ledgerCase } from "./render/cases.js";
import { projectCase } from "./render/project-cases.js";
import { esc, projectUrl } from "./render/shared.js";
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const dist = join(root, "dist");
function write(path: string, text: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}
rmSync(dist, { recursive: true, force: true });
cpSync(join(root, "public"), dist, { recursive: true });
write(join(dist, "styles.css"), ["styles.css", "brain.css", "showcase.css", "cases.css"].map(file => readFileSync(join(root, "src", file), "utf8")).join("\n"));
copyFileSync(join(here, "client.js"), join(dist, "client.js"));
mkdirSync(join(dist, "visual"), { recursive: true });
for (const file of readdirSync(join(root, "src", "visual")).filter(file => file.endsWith(".ts"))) {
  copyFileSync(join(here, "visual", file.replace(/\.ts$/, ".js")), join(dist, "visual", file.replace(/\.ts$/, ".js")));
}
write(join(dist, "index.html"), layout(`${profile.name} — Full Stack & AI-Assisted Engineering`, profile.description, "/", home()));
for (const project of projects) {
  write(join(dist, "proyectos", project.id, "index.html"), layout(`${project.name} — Case Study · ${profile.name}`, project.desc, projectUrl(project), project.id === "ledgercore" ? ledgerCase() : projectCase(project)));
}
const urls = ["/", ...projects.map(projectUrl)];
if (siteUrl) write(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${esc(siteUrl + url)}</loc></url>`).join("")}</urlset>\n`);
write(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n${siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : ""}`);
if (!existsSync(join(dist, "cv.pdf"))) throw new Error("Falta public/cv.pdf");
console.log(`dist/ generado: ${urls.length} páginas. ${siteUrl ? `Dominio: ${siteUrl}` : "SITE_URL sin configurar: canonical y sitemap omitidos."}`);
