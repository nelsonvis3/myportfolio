import type { Card, Challenge, Content, Part, Project } from "../content/types.js";
import { icon, logo } from "./icons.js";

export const esc = (s: string) => s.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
export const ext = (url: string) => `href="${esc(url)}" target="_blank" rel="noopener noreferrer"`;
export const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
export const pad = (n: number) => String(n).padStart(2, "0");

/** Clips de "Cómo se usa" que existen en public/clips (los arma build.ts). */
export type Clips = Record<string, { desktop: string; poster: string; size: [number, number]; mobile?: string; mobilePoster?: string }>;

/** Código, demo (o "Demo en preparación" si todavía no hay) y video externo del proyecto. */
export const projectLinks = (c: Content, p: Project, solid = true) => [
  p.repo ? `<a class="btn${solid ? " btn-accent" : ""}" ${ext(p.repo)}>${logo("github")}${esc(c.ui.viewCode)}</a>` : "",
  p.demo ? `<a class="btn" ${ext(p.demo)}>${esc(p.demoLabel)}${icon("arrow")}</a>` : `<span class="btn is-pending">${esc(c.ui.demoSoon)}</span>`,
  p.video ? `<a class="btn" ${ext(p.video)}>${esc(p.videoLabel)}${icon("arrow")}</a>` : "",
].join("");

export const chips = (items: string[]) => `<ul class="chips">${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>`;

/** Encabezado de bloque: número y nombre chico arriba, título grande abajo. */
export const blockHead = (eyebrow: string, title: string, id?: string, tag = "h3") =>
  `<p class="eyebrow${/^\d+$/.test(eyebrow) ? " num" : ""}">${esc(eyebrow)}</p><${tag} class="block-title"${id ? ` id="${id}"` : ""}>${esc(title)}</${tag}>`;

/** Portada: la captura de escritorio con la de celular delante. client.ts la inclina siguiendo el puntero. */
export const cover = (p: Project, cls = "", lazy = false) => `<figure class="cover3d ${cls}" data-cover>
    <div class="cover3d-scene">
      <img class="cover3d-desk" src="${esc(p.images[0].src)}" alt="${esc(p.images[0].alt)}"${lazy ? ` loading="lazy"` : ""}>
      <img class="cover3d-phone" src="${esc(p.phoneShot)}" alt="" loading="lazy">
    </div>
  </figure>`;

export const featureCards = (cards: Card[]) => `<ul class="feature-grid">${cards.map((card, i) => `<li class="card" data-reveal style="--i:${i % 3}">
    <span class="card-icon">${icon(card.icon)}</span>
    <h4>${esc(card.title)}</h4>
    <p>${esc(card.text)}</p>
  </li>`).join("")}</ul>`;

export const challengeRows = (c: Content, list: Challenge[]) => `<ol class="challenge-rows">${list.map((ch, i) => `<li class="challenge-row" data-reveal>
    <span class="challenge-n">${pad(i + 1)}</span>
    <h4>${icon("alert")}${esc(ch.title)}</h4>
    <div class="challenge-body">
      <p class="muted">${esc(ch.problem)}</p>
      <p>${esc(ch.solution)}</p>
      <p class="source"><span>${esc(c.ui.caseCode)}</span><code>${esc(ch.source)}</code></p>
    </div>
  </li>`).join("")}</ol>`;

export const partsGrid = (parts: Part[]) =>
  `<dl class="parts-grid">${parts.map((part, i) => `<div class="card" data-reveal style="--i:${i % 3}"><dt>${esc(part.name)}</dt><dd>${esc(part.detail)}</dd></div>`).join("")}</dl>`;

/** "Cómo se usa": un clip por paso. En el celular se usa el clip grabado en el celular si existe;
 * si no, el de escritorio, que se puede tocar para verlo en pantalla completa. Los reproduce client.ts. */
export function usageSteps(c: Content, p: Project, clips: Clips): string {
  const steps = (p.usage ?? []).filter(s => clips[s.clip]);
  if (!steps.length) return "";
  return `<ol class="usage">${steps.map((s, i) => {
    const clip = clips[s.clip];
    return `<li class="usage-step" data-reveal>
      <div class="usage-text"><span class="usage-n">${pad(i + 1)}</span><h4>${esc(s.name)}</h4><p>${esc(s.detail)}</p></div>
      <figure class="usage-clip${clip.mobile ? " has-mobile" : ""}">
        <video muted loop playsinline preload="none" width="${clip.size[0]}" height="${clip.size[1]}" poster="${clip.poster}"${clip.mobilePoster ? ` data-poster-mobile="${clip.mobilePoster}"` : ""} data-clip${clip.mobile ? "" : " data-fullscreen"} aria-label="${esc(s.name)}">
          ${clip.mobile ? `<source src="${clip.mobile}" type="video/mp4" media="(max-width: 760px)">` : ""}<source src="${clip.desktop}" type="video/mp4">
        </video>
        ${clip.mobile ? "" : `<figcaption class="case-media-hint">${esc(c.ui.caseVideoFull)}</figcaption>`}
      </figure>
    </li>`;
  }).join("")}</ol>`;
}

export const statusCards = (c: Content, p: Project) => `<div class="status-grid">
    <div class="card status-card is-ok" data-reveal><h4>${icon("check")}${esc(c.ui.caseWorks)}</h4><p>${esc(p.status.works)}</p></div>
    <div class="card status-card" data-reveal style="--i:1"><h4>${icon("clock")}${esc(c.ui.caseMissing)}</h4><p>${esc(p.status.missing)}</p></div>
  </div>
  <blockquote class="learning" data-reveal><p class="eyebrow">${esc(c.ui.caseLearning)}</p><p>${esc(p.learning)}</p></blockquote>`;
