import { mkdirSync, writeFileSync, readFileSync, copyFileSync, rmSync, existsSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { projects } from "./data/projects.js";
import { skills } from "./data/skills.js";
import { education } from "./data/education.js";
import { socials, siteUrl } from "./data/socials.js";
import { timeline } from "./data/timeline.js";
import { now, steps } from "./data/now.js";
import type { Project } from "./data/types.js";

const here = dirname(fileURLToPath(import.meta.url)); // build/
const root = join(here, "..");
const dist = join(root, "dist");
const css = readFileSync(join(root, "src", "styles.css"), "utf8");

const NAV: [string, string][] = [
  ["inicio", "Inicio"], ["sobre-mi", "Sobre mí"], ["proyectos", "Proyectos"], ["stack", "Stack"], ["contacto", "Contacto"],
];
const mail = `mailto:${socials.email}`;
const ext = (u: string) => `href="${u}" target="_blank" rel="noopener"`;
const chips = (a: string[]) => a.map((s) => `<span>${s}</span>`).join("");

/* ---------- layout compartido ---------- */
function layout(o: { title: string; desc: string; path: string; base: string; body: string }): string {
  const { title, desc, path, base, body } = o;
  const favicon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230D0F0E'/%3E%3Ctext x='16' y='22' font-family='monospace' font-size='15' font-weight='700' fill='%23B7FF3C' text-anchor='middle'%3EN/S%3C/text%3E%3C/svg%3E";
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${siteUrl}${path}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:url" content="${siteUrl}${path}">
<meta name="theme-color" content="#0D0F0E">
<link rel="icon" href="${favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
<a href="#main" class="btn sm" style="position:absolute;left:-999px" onfocus="this.style.left='8px'" onblur="this.style.left='-999px'">Saltar al contenido</a>
<header><div class="wrap"><nav aria-label="Principal">
  <a class="logo" href="${base || "./"}" aria-label="Nelson Sivisstum, inicio">N/S</a>
  <ul id="links">${NAV.map(([id, t]) => `<li><a href="${base}#${id}" data-s="${id}">${t}</a></li>`).join("")}</ul>
  <a class="btn sm hide-m" href="${base}#contacto">Contacto</a>
  <button class="btn sm" id="menu" aria-expanded="false" aria-controls="links">Menú</button>
</nav></div></header>
<main id="main">${body}</main>
<footer><div class="wrap">
  <div><b>NELSON SIVISSTUM</b><br>Web Developer · Formosa, Argentina<br><span class="mono">Built with curiosity.</span></div>
  <nav aria-label="Redes"><a class="ul" ${ext(socials.github)}>GitHub</a><a class="ul" ${ext(socials.linkedin)}>LinkedIn</a><a class="ul" href="${mail}">Email</a></nav>
  <div>© ${new Date().getFullYear()} Nelson Sivisstum</div>
</div></footer>
<script type="module" src="${base}client.js"></script>
</body>
</html>`;
}

/* ---------- home ---------- */
function home(): string {
  const base = "";
  return `
<section class="hero" id="inicio"><div class="wrap grid">
 <div>
  <p class="mono">DEVELOPER / FORMOSA, ARGENTINA</p>
  <h1>Transformo necesidades e ideas en aplicaciones web útiles, claras y funcionales.</h1>
  <p>Soy Nelson Sivisstum, desarrollador web junior autodidacta enfocado en React, Next.js, TypeScript y Python/Django.</p>
  <p class="mono" style="margin-top:14px">Actualmente aprendiendo · construyendo · mejorando</p>
  <div class="row">
   <a class="btn pri" href="#proyectos">Ver proyectos</a>
   <a class="btn" href="${socials.cv}" download>Descargar CV</a>
   <a class="ul mono" ${ext(socials.github)}>GitHub →</a>
  </div>
 </div>
 <div class="term" role="img" aria-label="Terminal con datos de Nelson Sivisstum">
  <div class="bar"><i></i><i></i><i></i></div>
  <pre><em>nelson@dev:~$</em> whoami

<b>Nelson Sivisstum</b>

role      → Web Developer
location  → Formosa, AR
focus     → React / Next / Django
status    → building <span class="cur"></span></pre>
 </div>
</div></section>

<section id="sobre-mi"><div class="wrap two">
 <div class="about">
  <h2>Sobre mí</h2>
  <p>Soy autodidacta y estoy construyendo mi carrera en desarrollo. Aprendo haciendo y resolviendo problemas en proyectos reales, tanto de frontend como de backend.</p>
  <p>Lo que me interesa es entender cómo funcionan las cosas, no copiar soluciones que no sé explicar. Hoy estudio y desarrollo proyectos propios mientras busco mi primera oportunidad.</p>
 </div>
 <ol class="tl">${timeline.map((t) => `<li><span class="mono">${t.period}</span><p>${t.text}</p></li>`).join("")}</ol>
</div></section>

<section id="proyectos"><div class="wrap">
 <h2>Proyectos</h2>
 ${projects.map((p) => `
 <article class="proj">
  <a class="shot" href="${base}proyectos/${p.id}/" aria-label="Ver case study de ${p.name}">${p.img[0] ? `<img src="${p.img[0]}" alt="Vista previa de ${p.name}" loading="lazy">` : `<div class="ph"><div><b>${p.name}</b><span class="mono">captura pendiente</span></div></div>`}</a>
  <div>
   <h3 style="font-size:1.6rem;letter-spacing:-.02em">${p.name}</h3>
   <p class="sub">${p.subtitle}</p>
   <p>${p.desc}</p>
   <div class="chips">${chips(p.stack)}</div>
   <div class="solved"><b style="color:var(--tx)">Lo que resolví</b><ul>${p.solved.map((s) => `<li>${s}</li>`).join("")}</ul></div>
   <div class="row"><a class="btn pri sm" href="${base}proyectos/${p.id}/">Case study</a>${p.repo ? `<a class="btn sm" ${ext(p.repo)}>GitHub</a>` : ""}${p.demo ? `<a class="btn sm" ${ext(p.demo)}>Demo</a>` : ""}</div>
  </div>
 </article>`).join("")}
</div></section>

<section id="stack"><div class="wrap">
 <h2>Stack</h2>
 <div class="stack">${skills.map((g) => `<div class="${g.learning ? "learn" : ""}"><h3>${g.title}</h3><ul>${g.items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`).join("")}</div>
</div></section>

<section><div class="wrap">
 <h2>Aprender construyendo.</h2>
 <p>Mi forma de aprender programación consiste en estudiar un concepto, entender cómo funciona, llevarlo a un proyecto y enfrentar los problemas que aparecen durante el desarrollo.</p>
 <div class="flow" aria-label="Proceso">${steps.map((s) => `<span>${s.toUpperCase()}</span>`).join("")}</div>
</div></section>

<section id="github"><div class="wrap">
 <h2>GitHub</h2>
 <p>Repositorios recientes, leídos en vivo desde mi cuenta.</p>
 <div class="repos" id="repos"><a class="repo" ${ext(socials.github + "/formosa-empleos")}><b>formosa-empleos</b><span class="mono">HTML · portal de empleos</span></a></div>
 <a class="ul" ${ext(socials.github)}>Ver GitHub →</a>
</div></section>

<section><div class="wrap two">
 <div><h2>Formación</h2>
  <ul class="edu">${education.map((c) => `<li><div><b>${c.name}</b><small>${c.detail}</small></div><span class="st">${c.status}</span></li>`).join("")}</ul></div>
 <div><h2>Ahora</h2>
  <ul class="now">${now.map((n, i) => `<li><span class="mono">0${i + 1}</span>${n}</li>`).join("")}</ul></div>
</div></section>

<section class="contact" id="contacto"><div class="wrap">
 <h2>¿Hablamos?</h2>
 <p>Estoy buscando mi primera oportunidad profesional y estoy abierto a proyectos, colaboraciones y lugares donde pueda seguir creciendo como desarrollador.</p>
 <div class="row"><a class="btn pri" href="${mail}">Enviar email →</a><a class="btn" ${ext(socials.linkedin)}>LinkedIn →</a></div>
 <div class="links mono"><a class="ul" href="${mail}">${socials.email}</a><a class="ul" ${ext(socials.linkedin)}>LinkedIn</a><a class="ul" ${ext(socials.github)}>GitHub</a></div>
</div></section>`;
}

/* ---------- case study ---------- */
function caseStudy(p: Project, base: string): string {
  const todo = `<p class="todo">Pendiente de redactar.</p>`;
  const text = (v: string | null) => (v ? `<p>${v}</p>` : todo);
  const list = (a: string[]) => (a.length ? `<ul>${a.map((x) => `<li>${x}</li>`).join("")}</ul>` : todo);
  const shots = p.img.length
    ? `<div class="shots">${p.img.map((s, i) => `<img src="${s}" alt="Captura ${i + 1} de ${p.name}" loading="lazy" style="width:100%;border:1px solid var(--bd);border-radius:8px">`).join("")}</div>`
    : `<p class="todo">Capturas pendientes: agregalas en el campo img del proyecto.</p>`;
  const block = (h: string, c: string) => `<div class="blk"><h2>${h}</h2><div>${c}</div></div>`;
  return `<div class="wrap case">
 <a class="back ul mono" href="${base}#proyectos">← Proyectos</a>
 <p class="sub mono" style="margin-top:20px">Case study</p>
 <h1>${p.name}</h1><p style="font-size:1.1rem">${p.subtitle}</p>
 <div class="row" style="margin-bottom:36px"><a class="btn pri sm" ${p.demo ? ext(p.demo) : 'aria-disabled="true"'}>${p.demo ? "Demo" : "Demo pendiente"}</a><a class="btn sm" ${p.repo ? ext(p.repo) : 'aria-disabled="true"'}>${p.repo ? "GitHub" : "GitHub pendiente"}</a></div>
 ${block("Problema", text(p.problema))}${block("Objetivo", text(p.objetivo))}${block("Solución", text(p.solucion))}
 ${block("Stack", `<div class="chips" style="margin:0">${chips(p.stack)}</div>`)}
 ${block("Arquitectura", text(p.arquitectura))}${block("Funcionalidades", list(p.funcionalidades))}
 ${block("Desafíos", list(p.desafios))}${block("Decisiones técnicas", list(p.decisiones))}
 ${block("Screenshots", shots)}${block("Resultado", text(p.resultado))}
 <div class="blk"><h2>Siguiente</h2><div><a class="ul" href="${base}#proyectos">← Volver a proyectos</a></div></div>
</div>`;
}

/* ---------- salida ---------- */
function write(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

rmSync(dist, { recursive: true, force: true });

write(join(dist, "index.html"), layout({
  title: "Nelson Sivisstum — Web Developer",
  desc: "Portfolio de Nelson Sivisstum, desarrollador web junior especializado en React, Next.js, TypeScript y Python/Django.",
  path: "/", base: "", body: home(),
}));

for (const p of projects) {
  write(join(dist, "proyectos", p.id, "index.html"), layout({
    title: `${p.name} — Nelson Sivisstum`,
    desc: `${p.subtitle}. Case study: problema, decisiones técnicas y desafíos.`,
    path: `/proyectos/${p.id}/`, base: "../../", body: caseStudy(p, "../../"),
  }));
}

copyFileSync(join(here, "client.js"), join(dist, "client.js"));

const imgs = join(root, "public", "img");
if (existsSync(imgs)) cpSync(imgs, join(dist, "img"), { recursive: true });

const cv = join(root, "public", "cv.pdf");
if (existsSync(cv)) copyFileSync(cv, join(dist, "cv.pdf"));

const urls = ["/", ...projects.map((p) => `/proyectos/${p.id}/`)];
write(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${siteUrl}${u}</loc></url>`).join("\n")}\n</urlset>\n`);
write(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

console.log(`dist/ generado: ${urls.length} páginas`);
