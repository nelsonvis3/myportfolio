import type { Content, Project } from "../content/types.js";
import { socials, casePath } from "../content/site.js";
import { icon, logo } from "./icons.js";
import { blockHead, challengeRows, chips, cover, esc, ext, featureCards, pad, partsGrid, projectLinks, statusCards, usageSteps, type Clips } from "./shared.js";

// Home: hero → intro → proyectos → caso de estudio → sobre mí → stack → disponibilidad → contacto.
// Todo el contenido está en el HTML. client.ts suma el scroll suave, las animaciones y el cambio de caso.

// Frases que van en renglones separados en pantallas anchas y corridas en el celular.
const lines = (items: string[]) => items.map(l => `<span class="line">${esc(l)}</span>`).join(" ");

function hero(c: Content, image?: string): string {
  return `<section class="hero" data-hero>
  <div class="hero-card${image ? " has-image" : ""}">
    <div class="glow" aria-hidden="true"><span></span><span></span></div>
    ${image ? `<img class="hero-img" src="${image}" alt="" fetchpriority="high" data-hero-img>` : ""}
    <div class="hero-content">
      <p class="eyebrow">${esc(c.hero.eyebrow)}</p>
      <h1>${lines(c.hero.title)}</h1>
      <p class="hero-lines">${lines(c.hero.lines)}</p>
      <div class="actions">
        <a class="btn btn-accent" href="#${c.ids.projects}">${esc(c.hero.primary)}</a>
        <a class="btn btn-glass" href="#${c.ids.contact}">${esc(c.hero.secondary)}</a>
      </div>
      <p class="hero-note">${esc(c.hero.note)}</p>
    </div>
  </div>
</section>`;
}

function intro(c: Content): string {
  return `<section class="section intro tone-deep" aria-labelledby="intro-title"><div class="wrap center">
  <p class="eyebrow" data-reveal>${esc(c.intro.eyebrow)}</p>
  <h2 id="intro-title" class="display" data-reveal>${lines(c.intro.title)}</h2>
  <p class="intro-text" data-words>${esc(c.intro.text)}</p>
</div></section>`;
}

function work(c: Content): string {
  const total = pad(c.projects.length);
  return `<section class="work tone-deep" id="${c.ids.projects}" aria-labelledby="work-title" data-work>
  <div class="wrap work-head">
    <div>${blockHead(c.work.eyebrow, c.work.title, "work-title", "h2")}</div>
    <p class="muted">${esc(c.work.lead)}</p>
  </div>
  <div class="work-viewport"><ol class="work-track" data-work-track>${c.projects.map((p, i) => `<li class="work-card">
    <a href="#caso-${p.id}" data-case-link="${p.id}" aria-label="${esc(`${c.work.open}: ${p.name}`)}">
      <img src="${esc(p.images[0].src)}" alt="${esc(p.images[0].alt)}" loading="${i ? "lazy" : "eager"}">
      <span class="work-count">${pad(i + 1)} / ${total}</span>
      <span class="work-info"><span class="kind">${esc(p.kind)}</span><strong>${esc(p.name)}</strong><span class="work-sub">${esc(p.tagline)}</span></span>
      <span class="circle work-arrow">${icon("arrow")}</span>
    </a>
  </li>`).join("")}</ol></div>
</section>`;
}

/** Un caso por proyecto; sin JS se ven los tres uno debajo del otro. */
function casePanel(c: Content, p: Project, clips: Clips): string {
  const u = c.ui;
  const usage = usageSteps(c, p, clips);
  const blocks: [string, string][] = [
    [u.caseFeatures, featureCards(p.cards)],
    ...(usage ? [[u.caseUsage, usage] as [string, string]] : []),
    [c.cases.challengesTitle, challengeRows(c, p.challenges)],
    [u.caseArchitecture, `<p class="lead-text">${esc(p.architecture.text)}</p>${partsGrid(p.architecture.parts)}`],
    [u.caseStatus, statusCards(c, p)],
  ];
  return `<article class="case-panel" id="caso-${p.id}" data-case="${p.id}" aria-labelledby="caso-${p.id}-title">
  <div class="cs-overview">
    ${cover(p, "cs-cover", true)}
    <div class="cs-summary">
      <p class="eyebrow">${esc(c.cases.eyebrow)} · ${pad(1)} ${esc(p.kind)}</p>
      <h2 id="caso-${p.id}-title" class="block-title">${esc(p.name)}</h2>
      <p class="lead-text">${esc(p.summary)}</p>
      <p class="muted">${esc(p.role)}</p>
      ${chips(p.stack)}
      <div class="actions">${projectLinks(c, p)}</div>
    </div>
  </div>
  ${blocks.map(([title, body], i) => `<div class="cs-block">${blockHead(pad(i + 2), title)}${body}</div>`).join("")}
  <a class="text-link" href="${casePath(c.lang, p.id)}">${esc(c.cases.full)} ${icon("arrow")}</a>
</article>`;
}

function cases(c: Content, clips: Clips): string {
  return `<section class="section cases tone-base" aria-label="${esc(c.cases.eyebrow)}" data-cases>
  <div class="wrap">
    <nav class="case-tabs" aria-label="${esc(c.cases.tabsLabel)}">${c.projects.map((p, i) => `<a href="#caso-${p.id}" data-case-link="${p.id}"${i ? "" : ` aria-current="true"`}>${esc(p.name)}</a>`).join("")}</nav>
    ${c.projects.map(p => casePanel(c, p, clips)).join("")}
  </div>
</section>`;
}

function about(c: Content, photo?: string): string {
  const a = c.about;
  return `<section class="section about tone-base" id="${c.ids.about}" aria-labelledby="about-title"><div class="wrap">
  <div class="about-grid${photo ? "" : " no-photo"}">
    ${photo ? `<figure class="about-photo" data-reveal><img src="${photo}" alt="${esc(a.photoAlt)}" loading="lazy"></figure>` : ""}
    <div class="about-text">
      ${blockHead(a.eyebrow, a.title, "about-title", "h2")}
      ${a.paragraphs.map(p => `<p data-words>${esc(p)}</p>`).join("")}
    </div>
  </div>
  <div class="about-cards">
    <div class="card" data-reveal><h3 class="eyebrow">${esc(a.timelineTitle)}</h3><ol class="timeline">${a.timeline.map(t => `<li><span>${esc(t.name)}</span><p>${esc(t.detail)}</p></li>`).join("")}</ol></div>
    <div class="card" data-reveal style="--i:1"><h3 class="eyebrow">${esc(a.educationTitle)}</h3><ul class="timeline">${a.education.map(e => `<li><span>${esc(e.status)}</span><p><strong>${esc(e.name)}</strong> ${esc(e.detail)}</p></li>`).join("")}</ul></div>
    <div class="card" data-reveal style="--i:2"><h3 class="eyebrow">${esc(a.nowTitle)}</h3><ul class="now">${a.now.map(n => `<li>${icon("check")}<span>${esc(n)}</span></li>`).join("")}</ul></div>
  </div>
</div></section>`;
}

function stack(c: Content): string {
  const s = c.stack;
  const tiles = (hidden: boolean) => s.tools.map(t => `<li${hidden ? ` aria-hidden="true"` : ""}>${logo(t.logo)}<span>${esc(t.name)}</span></li>`).join("");
  return `<section class="section stack tone-deep" id="${c.ids.stack}" aria-labelledby="stack-title">
  <div class="wrap center">
    <p class="eyebrow" data-reveal>${esc(s.eyebrow)}</p>
    <h2 id="stack-title" class="display" data-reveal>${esc(s.title)}</h2>
    <p class="muted stack-lead" data-reveal>${esc(s.lead)}</p>
  </div>
  <div class="marquee" data-reveal><ul class="marquee-track">${tiles(false)}${tiles(true)}</ul></div>
  <div class="ai-studio wrap center">
    <p class="eyebrow">${esc(s.aiEyebrow)}</p>
    <ul>${s.ai.map(t => `<li data-reveal>${logo(t.logo)}<span>${esc(t.name)}</span></li>`).join("")}</ul>
  </div>
</section>`;
}

function availability(c: Content): string {
  const v = c.availability;
  const [cv, other] = c.lang === "es" ? [socials.cv.es, socials.cv.en] : [socials.cv.en, socials.cv.es];
  return `<section class="availability tone-deep" aria-labelledby="avail-title"><div class="wrap avail-grid">
  <div class="avail-text">
    <p class="eyebrow pulse" data-reveal>${esc(v.eyebrow)}</p>
    <h2 id="avail-title" class="display" data-reveal>${esc(v.title)}</h2>
    <p class="muted" data-reveal>${esc(v.text)}</p>
    <div class="actions" data-reveal>
      <a class="btn btn-light" href="${cv}" download>${icon("download")}${esc(v.cv)}</a>
      <a class="btn" href="${other}" download>${esc(v.cvOther)}</a>
    </div>
  </div>
  <div class="avail-visual" aria-hidden="true">
    <div class="orb"><span></span></div>
  </div>
  <p class="avail-note card" data-reveal><span class="card-icon">${icon("check")}</span>${esc(v.note)}</p>
</div></section>`;
}

function contact(c: Content): string {
  const k = c.contact;
  return `<section class="section contact tone-cream" id="${c.ids.contact}" aria-labelledby="contact-title"><div class="wrap center">
  <h2 id="contact-title" class="display" data-reveal>${esc(k.title)}</h2>
  <p class="contact-text" data-reveal>${esc(k.text)}</p>
  <a class="btn btn-ink" href="mailto:${socials.email}" data-reveal>${esc(k.button)}</a>
  <ul class="contact-list" data-reveal>
    <li><a href="mailto:${socials.email}">${icon("mail")}${socials.email}</a></li>
    <li><a ${ext(socials.linkedin)}>${icon("linkedin")}LinkedIn</a></li>
    <li><a ${ext(socials.github)}>${logo("github")}GitHub</a></li>
    <li>${icon("pin")}${esc(k.location)}</li>
  </ul>
</div></section>`;
}

/** Imágenes opcionales de public/img: foto de "Sobre mí" y la imagen del hero. */
export interface HomeImages { photo?: string; hero?: string }

export function home(c: Content, clips: Clips, images: HomeImages = {}): string {
  const { photo } = images;
  return `${hero(c, images.hero)}${intro(c)}${work(c)}${cases(c, clips)}${about(c, photo)}${stack(c)}${availability(c)}${contact(c)}`;
}
