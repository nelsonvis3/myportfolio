import type { Content, Project } from "../content/types.js";
import { casePath, homePath } from "../content/site.js";
import { icon } from "./icons.js";
import { blockHead, challengeRows, chips, cover, esc, pad, partsGrid, projectLinks } from "./shared.js";

const paragraphs = (items: string[]) => items.map(p => `<p>${esc(p)}</p>`).join("");

/** Captura que acompaña a "La solución". La de celular va al lado del texto, a tamaño de celular; la de
 * escritorio va debajo, con un recorte legible en pantallas chicas y un link a la imagen completa. */
function solution(c: Content, p: Project): string {
  const body = `${paragraphs(p.solution)}<h4 class="sub">${esc(c.ui.caseFeatures)}</h4><ul class="check-list">${p.features.map(f => `<li>${icon("check")}<span>${esc(f)}</span></li>`).join("")}</ul>`;
  const image = p.images[1];
  if (image?.phone) {
    return `<div class="solution-split"><div class="prose">${body}</div>
    <figure class="case-phone"><img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="lazy"></figure></div>`;
  }
  const figure = !image ? "" : image.mobileSrc
    ? `<figure class="case-media"><a href="${esc(image.src)}" target="_blank" rel="noopener"><picture>
    <source media="(max-width: 760px)" srcset="${esc(image.mobileSrc)}"><img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="lazy">
  </picture></a><figcaption class="case-media-hint">${esc(c.ui.caseImageFull)}</figcaption></figure>`
    : `<figure class="case-media"><img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="lazy"></figure>`;
  return `<div class="prose">${body}</div>${figure}`;
}

export function casePage(c: Content, p: Project): string {
  const u = c.ui;
  const index = c.projects.findIndex(x => x.id === p.id);
  const next = c.projects[(index + 1) % c.projects.length];
  const blocks: [string, string, string][] = [
    ["problem", u.caseProblem, `<div class="prose">${paragraphs(p.problem)}</div>`],
    ["solution", u.caseSolution, solution(c, p)],
    ["architecture", u.caseArchitecture, `<div class="prose"><p>${esc(p.architecture.text)}</p></div>${partsGrid(p.architecture.parts)}`],
    ["flow", p.flow.title, `<ol class="steps">${p.flow.steps.map(s => `<li data-reveal><strong>${esc(s.name)}</strong><p>${esc(s.detail)}</p></li>`).join("")}</ol>`],
    ["challenges", u.caseChallenges, challengeRows(c, p.challenges)],
    ["decisions", u.caseDecisions, partsGrid(p.decisions)],
  ];
  return `<article class="case-page">
  <div class="wrap">
    <a class="back" href="${homePath(c.lang)}#caso-${p.id}"><span aria-hidden="true">←</span> ${esc(u.caseBack)}</a>
    <header class="cp-head">
      <p class="eyebrow">${esc(u.caseEyebrow)} · ${esc(p.kind)}</p>
      <h1>${esc(p.name)}</h1>
      <p class="cp-tagline">${esc(p.tagline)}</p>
      ${chips(p.stack)}
      <div class="actions">${projectLinks(c, p)}</div>
    </header>
    ${cover(p, "cp-cover")}
    <dl class="cp-role card"><dt class="eyebrow">${esc(u.caseRole)}</dt><dd>${esc(p.role)}</dd></dl>
    ${blocks.map(([id, title, body], i) => `<section class="cp-section" aria-labelledby="${id}">
      <div class="cp-label">${blockHead(pad(i + 1), title, id, "h2")}</div>
      <div class="cp-content">${body}</div>
    </section>`).join("")}
    <aside class="case-verification" aria-label="${esc(u.caseVerification)}">
      <span class="eyebrow">${esc(u.caseVerification)}</span>
      <p>${esc(p.verification)}</p>
    </aside>
  </div>
  <a class="next-card wrap" href="${casePath(c.lang, next.id)}">
    <img src="${esc(next.images[0].src)}" alt="" loading="lazy">
    <span class="next-text"><span class="eyebrow">${esc(u.caseNext)}</span><strong>${esc(next.name)}</strong><span>${esc(next.tagline)}</span></span>
    <span class="circle">${icon("arrow")}</span>
  </a>
  <nav class="wrap case-end" aria-label="${esc(u.caseBack)}">
    <a class="btn" href="${homePath(c.lang)}#${c.ids.projects}"><span aria-hidden="true">←</span>${esc(u.caseBack)}</a>
    <a class="btn" href="${homePath(c.lang)}">${esc(u.caseBackHome)}</a>
  </nav>
</article>`;
}
