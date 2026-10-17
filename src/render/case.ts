import type { Content, Project } from "../content/types.js";
import { casePath, homePath } from "../content/site.js";
import { cover, esc, ext, projectLinks } from "./shared.js";

/** Clips de "Cómo se usa" que existen en public/clips (los arma build.ts). */
export type Clips = Record<string, { desktop: string; poster: string; size: [number, number]; mobile?: string; mobilePoster?: string }>;

const section = (id: string, title: string, body: string) =>
  `<section class="case-section" aria-labelledby="${id}"><h2 id="${id}">${esc(title)}</h2><div class="case-content">${body}</div></section>`;
const paragraphs = (items: string[]) => items.map(p => `<p>${esc(p)}</p>`).join("");

/** Captura que acompaña a "La solución". La de celular va al lado del texto, a tamaño de celular; la de
 * escritorio va debajo, con un recorte legible en pantallas chicas y un link a la imagen completa. */
function solution(c: Content, p: Project): string {
  const body = `${paragraphs(p.solution)}<h3>${esc(c.ui.caseFeatures)}</h3><ul class="list">${p.features.map(f => `<li>${esc(f)}</li>`).join("")}</ul>`;
  const image = p.images[1];
  if (image?.phone) {
    return section("solution", c.ui.caseSolution, `<div class="solution-split"><div class="case-content">${body}</div>
    <figure class="case-phone"><img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="lazy"></figure></div>`);
  }
  const figure = !image ? "" : image.mobileSrc
    ? `<figure class="case-media case-media-secondary"><a href="${esc(image.src)}" target="_blank" rel="noopener"><picture>
    <source media="(max-width: 760px)" srcset="${esc(image.mobileSrc)}"><img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="lazy">
  </picture></a><figcaption class="case-media-hint">${esc(c.ui.caseImageFull)}</figcaption></figure>`
    : `<figure class="case-media case-media-secondary"><img src="${esc(image.src)}" alt="${esc(image.alt)}" loading="lazy"></figure>`;
  return `${section("solution", c.ui.caseSolution, body)}
  ${figure}`;
}

/** "Cómo se usa": un clip por paso. En el celular se usa el clip grabado en el celular si existe;
 * si no, el de escritorio, que se puede tocar para verlo en pantalla completa. Los reproduce client.ts. */
function usage(c: Content, p: Project, clips: Clips): string {
  const steps = (p.usage ?? []).filter(s => clips[s.clip]);
  if (!steps.length) return "";
  // A todo el ancho: el clip muestra la página entera y así se lee casi a tamaño real.
  return `<section class="case-section case-usage" aria-labelledby="usage"><h2 id="usage">${esc(c.ui.caseUsage)}</h2><ol class="usage">${steps.map((s, i) => {
    const clip = clips[s.clip];
    return `<li class="usage-step">
      <div class="usage-text"><span class="usage-n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(s.name)}</h3><p>${esc(s.detail)}</p></div>
      <figure class="usage-clip${clip.mobile ? " has-mobile" : ""}">
        <video muted loop playsinline preload="none" width="${clip.size[0]}" height="${clip.size[1]}" poster="${clip.poster}"${clip.mobilePoster ? ` data-poster-mobile="${clip.mobilePoster}"` : ""} data-clip${clip.mobile ? "" : " data-fullscreen"} aria-label="${esc(s.name)}">
          ${clip.mobile ? `<source src="${clip.mobile}" type="video/mp4" media="(max-width: 760px)">` : ""}<source src="${clip.desktop}" type="video/mp4">
        </video>
        ${clip.mobile ? "" : `<figcaption class="case-media-hint">${esc(c.ui.caseVideoFull)}</figcaption>`}
      </figure>
    </li>`;
  }).join("")}</ol></section>`;
}

export function casePage(c: Content, p: Project, clips: Clips): string {
  const u = c.ui;
  const index = c.projects.findIndex(x => x.id === p.id);
  const next = c.projects[(index + 1) % c.projects.length];
  return `<article class="case wrap">
  <a class="back" href="${homePath(c.lang)}#${c.ids.projects}">${esc(u.caseBack)}</a>
  <header class="case-header">
    <p class="kind">${esc(p.kind)}</p>
    <h1>${esc(p.name)}</h1>
    <p class="case-tagline">${esc(p.tagline)}</p>
    <dl class="case-meta">
      <div><dt>${esc(u.caseStack)}</dt><dd>${p.stack.map(esc).join(" / ")}</dd></div>
      <div><dt>${esc(u.caseRole)}</dt><dd>${esc(p.role)}</dd></div>
    </dl>
    <div class="actions">
      ${p.repo ? `<a class="btn btn-solid" ${ext(p.repo)}>${esc(u.viewCode)}</a>` : ""}
      ${projectLinks(c, p)}
    </div>
  </header>
  ${cover(p, "case-cover")}
  ${section("problem", u.caseProblem, paragraphs(p.problem))}
  ${solution(c, p)}
  ${usage(c, p, clips)}
  ${section("architecture", u.caseArchitecture, `<p>${esc(p.architecture.text)}</p><dl class="parts">${p.architecture.parts.map(part => `<div><dt>${esc(part.name)}</dt><dd>${esc(part.detail)}</dd></div>`).join("")}</dl>`)}
  ${section("flow", p.flow.title, `<ol class="steps">${p.flow.steps.map(s => `<li><strong>${esc(s.name)}</strong><p>${esc(s.detail)}</p></li>`).join("")}</ol>`)}
  ${section("challenges", u.caseChallenges, p.challenges.map(ch => `<div class="challenge">
    <h3>${esc(ch.title)}</h3>
    <p><span class="label">${esc(u.caseProblemLabel)}</span>${esc(ch.problem)}</p>
    <p><span class="label">${esc(u.caseSolutionLabel)}</span>${esc(ch.solution)}</p>
    <p class="source"><span class="label">${esc(u.caseCode)}</span><code>${esc(ch.source)}</code></p>
  </div>`).join(""))}
  ${section("decisions", u.caseDecisions, `<dl class="parts">${p.decisions.map(d => `<div><dt>${esc(d.name)}</dt><dd>${esc(d.detail)}</dd></div>`).join("")}</dl>`)}
  ${section("status", u.caseStatus, `<div class="status"><div><h3>${esc(u.caseWorks)}</h3><p>${esc(p.status.works)}</p></div><div><h3>${esc(u.caseMissing)}</h3><p>${esc(p.status.missing)}</p></div></div>`)}
  ${section("learning", u.caseLearning, `<p class="learning">${esc(p.learning)}</p>`)}
  <a class="next" href="${casePath(c.lang, next.id)}"><span>${esc(u.caseNext)}</span><strong>${esc(next.name)}</strong></a>
</article>`;
}
