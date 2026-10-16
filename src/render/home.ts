import type { Content, Project } from "../content/types.js";
import { socials, casePath } from "../content/site.js";
import { esc, ext, json, projectLinks } from "./shared.js";

// Home: hero 3D → entrada al cerebro → carrusel → IA → sobre mí → stack → contacto.
// Todo el contenido está en el HTML; el 3D y los efectos de texto son mejoras progresivas.

export type Videos = Record<string, { src: string; poster: string } | undefined>;

function actions(c: Content, p: Project): string {
  return `<div class="actions">
    <a class="btn btn-solid" href="${casePath(c.lang, p.id)}">${esc(c.ui.readCase)}</a>
    ${p.repo ? `<a class="btn" ${ext(p.repo)}>${esc(c.ui.viewCode)}</a>` : ""}
    ${projectLinks(c, p)}
  </div>`;
}

function media(p: Project, videos: Videos, cls: string): string {
  const v = videos[p.id];
  return v
    ? `<video class="${cls}" src="${v.src}" poster="${v.poster}" muted loop playsinline preload="none" aria-label="${esc(p.images[0].alt)}"></video>`
    : `<img class="${cls}" src="${esc(p.images[0].src)}" alt="${esc(p.images[0].alt)}" loading="lazy">`;
}

function journey(c: Content, videos: Videos): string {
  const data = c.projects.map(p => ({ id: p.id, name: p.name, sub: p.tagline, img: p.images[0].src, video: videos[p.id]?.src ?? null, poster: videos[p.id]?.poster ?? null }));
  const first = c.projects[0];
  return `<section class="journey" data-journey aria-label="${esc(c.ui.carouselLabel)}">
  <div class="stage" data-stage>
    <div class="hero" data-hero>
      <h1 class="hero-name" data-island="proximity" data-label="Nelson Sivisstum"><span>Nelson</span> <span>Sivisstum</span></h1>
      <p class="hero-role">${esc(c.ui.role)}</p>
      <p class="hero-line">${esc(c.ui.heroLine)}</p>
      <div class="actions">
        <a class="btn btn-solid" href="#${c.ids.projects}" data-to-carousel>${esc(c.ui.viewProjects)}</a>
        <a class="btn" href="${socials.cv[c.lang]}" download>${esc(c.ui.downloadCv)}</a>
      </div>
      <p class="hero-meta">${esc(c.ui.heroMeta)}</p>
    </div>
    <div class="hero-poster" aria-hidden="true"><img class="on-dark" src="/img/brain-dark.webp" alt="" width="900" height="900"><img class="on-light" src="/img/brain-light.webp" alt="" width="900" height="900"></div>
    <p class="scroll-cue" aria-hidden="true" data-scroll-cue><span></span>${esc(c.ui.scrollCue)}</p>
    <div class="carousel-ui" data-carousel-ui data-count="${esc(c.ui.countOf)}">
      <div class="carousel-caption" aria-live="polite">
        <p class="carousel-count" data-carousel-count>${esc(c.ui.countOf.replace("{n}", "1").replace("{total}", String(c.projects.length)))}</p>
        <h2 data-carousel-name>${esc(first.name)}</h2>
        <p data-carousel-sub>${esc(first.tagline)}</p>
      </div>
      <div class="carousel-controls" role="group" aria-label="${esc(c.ui.carouselLabel)}">
        <button type="button" class="square" data-carousel-prev aria-label="${esc(c.ui.prev)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
        <button type="button" class="btn btn-solid" data-carousel-open>${esc(c.ui.openProject)}</button>
        <button type="button" class="square" data-carousel-next aria-label="${esc(c.ui.next)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
      </div>
      <p class="carousel-hint">${esc(c.ui.carouselHint)}</p>
    </div>
  </div>
  <span class="journey-anchor" id="${c.ids.projects}" aria-hidden="true"></span>
  <div class="fallback wrap">
    <h2>${esc(c.ui.projectsTitle)}</h2>
    <ul class="fallback-grid">${c.projects.map(p => `<li class="fallback-card">
      <img src="${esc(p.images[0].src)}" alt="${esc(p.images[0].alt)}" loading="lazy">
      <p class="kind">${esc(p.kind)}</p>
      <h3>${esc(p.name)}</h3>
      <p class="tagline">${esc(p.tagline)}</p>
      <p>${esc(p.summary)}</p>
      ${actions(c, p)}
    </li>`).join("")}</ul>
  </div>
  <script type="application/json" id="journey-data">${json(data)}</script>
</section>
<dialog class="detail" id="project-detail" aria-label="${esc(c.ui.detailLabel)}">
  <button type="button" class="detail-close" data-detail-close>${esc(c.ui.backToCarousel)}</button>
  ${c.projects.map(p => `<article class="detail-body" data-project-detail="${esc(p.id)}" hidden aria-labelledby="detail-${esc(p.id)}">
    ${media(p, videos, "detail-media")}
    <div class="detail-copy">
      <p class="kind">${esc(p.kind)}</p>
      <h2 id="detail-${esc(p.id)}">${esc(p.name)}</h2>
      <p class="tagline">${esc(p.tagline)}</p>
      <p>${esc(p.summary)}</p>
      <h3>${esc(c.ui.whatItDoes)}</h3>
      <ul class="list">${p.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>
      <h3>${esc(c.ui.myPart)}</h3>
      <p>${esc(p.role)}</p>
      <p class="stack-line">${p.stack.map(esc).join(" / ")}</p>
      ${actions(c, p)}
    </div>
  </article>`).join("")}
</dialog>`;
}

const aiPrompts = {
  es: ["explicame cómo se conecta este módulo con la API", "proponé un cambio chico y mostrame el diff", "¿qué casos límite no están probados?"],
  en: ["explain how this module talks to the API", "suggest a small change and show me the diff", "which edge cases aren't tested yet?"],
};

function ai(c: Content): string {
  return `<section class="ai" id="${c.ids.ai}" data-ai aria-labelledby="ai-title">
  <div class="ai-track"><div class="ai-stage">
    <div class="wrap ai-head">
      <h2 id="ai-title">${esc(c.ai.title)}</h2>
      <p class="ai-lead">${esc(c.ai.lead)}</p>
      <p class="ai-prompt" data-island="type" data-prefix=">_ " data-texts="${esc(JSON.stringify(aiPrompts[c.lang]))}"><span>&gt;_ ${esc(aiPrompts[c.lang][0])}</span></p>
    </div>
    <div class="wrap ai-cards">${c.ai.cards.map(card => `<article class="ai-card" data-tilt>
      <h3>${esc(card.name)}</h3>
      <p>${esc(card.text)}</p>
      <ul class="chips">${card.uses.map(u => `<li>${esc(u)}</li>`).join("")}</ul>
    </article>`).join("")}</div>
  </div></div>
  <div class="wrap ai-rule">
    <h3>${esc(c.ai.ruleTitle)}</h3>
    <p>${esc(c.ai.rule)}</p>
  </div>
</section>`;
}

function about(c: Content): string {
  const a = c.about;
  return `<section class="section about" id="${c.ids.about}" aria-labelledby="about-title"><div class="wrap">
  <div class="split">
    <h2 id="about-title">${esc(a.title)}</h2>
    <div class="prose">${a.paragraphs.map(p => `<p>${esc(p)}</p>`).join("")}
      <div class="actions"><a class="btn" href="${socials.cv.es}" download>${esc(a.cvEs)}</a><a class="btn" href="${socials.cv.en}" download>${esc(a.cvEn)}</a></div>
    </div>
  </div>
  <div class="about-columns">
    <div><h3>${esc(a.timelineTitle)}</h3><ol class="timeline">${a.timeline.map(t => `<li><span>${esc(t.name)}</span><p>${esc(t.detail)}</p></li>`).join("")}</ol></div>
    <div><h3>${esc(a.educationTitle)}</h3><ul class="education">${a.education.map(e => `<li><strong>${esc(e.name)}</strong><p>${esc(e.detail)}</p><span>${esc(e.status)}</span></li>`).join("")}</ul></div>
    <div><h3>${esc(a.nowTitle)}</h3><ul class="list">${a.now.map(n => `<li>${esc(n)}</li>`).join("")}</ul></div>
  </div>
</div></section>`;
}

function stack(c: Content): string {
  return `<section class="section stack" aria-labelledby="stack-title"><div class="wrap">
  <div class="split">
    <div><h2 id="stack-title">${esc(c.stack.title)}</h2><p class="muted">${esc(c.stack.lead)}</p></div>
    <dl class="stack-rows">${c.stack.groups.map(g => `<div><dt>${esc(g.name)}</dt><dd>${g.items.map(i => `<span>${esc(i)}</span>`).join("")}</dd></div>`).join("")}</dl>
  </div>
</div></section>`;
}

function contact(c: Content): string {
  return `<section class="section contact" id="${c.ids.contact}" aria-labelledby="contact-title"><div class="wrap">
  <h2 id="contact-title" class="contact-title" data-island="pressure" data-label="${esc(c.contact.title)}">${esc(c.contact.title)}</h2>
  <div class="split">
    <p class="muted">${esc(c.contact.text)}</p>
    <div>
      <a class="contact-email" href="mailto:${socials.email}" aria-label="${esc(c.contact.emailLabel)}: ${socials.email}">${socials.email}</a>
      <ul class="contact-links">
        <li><a ${ext(socials.github)}>GitHub</a></li>
        <li><a ${ext(socials.linkedin)}>LinkedIn</a></li>
        <li><a href="${socials.cv.es}" download>${esc(c.about.cvEs)}</a></li>
        <li><a href="${socials.cv.en}" download>${esc(c.about.cvEn)}</a></li>
      </ul>
    </div>
  </div>
</div></section>`;
}

export function home(c: Content, videos: Videos): string {
  return `${journey(c, videos)}${ai(c)}${about(c)}${stack(c)}${contact(c)}`;
}
