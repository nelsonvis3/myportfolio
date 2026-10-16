import type { Content, Project } from "../content/types.js";
import { casePath, homePath } from "../content/site.js";
import { esc, ext } from "./shared.js";
import type { Videos } from "./home.js";

const section = (id: string, title: string, body: string) =>
  `<section class="case-section" aria-labelledby="${id}"><h2 id="${id}">${esc(title)}</h2><div class="case-content">${body}</div></section>`;
const paragraphs = (items: string[]) => items.map(p => `<p>${esc(p)}</p>`).join("");

export function casePage(c: Content, p: Project, videos: Videos): string {
  const u = c.ui;
  const index = c.projects.findIndex(x => x.id === p.id);
  const next = c.projects[(index + 1) % c.projects.length];
  const video = videos[p.id];
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
      ${p.demo ? `<a class="btn" ${ext(p.demo)}>${esc(p.demoLabel)}</a>` : ""}
    </div>
  </header>
  <figure class="case-media">
    ${video
      ? `<video src="${video.src}" poster="${video.poster}" autoplay muted loop playsinline aria-label="${esc(p.images[0].alt)}"></video>`
      : `<img src="${esc(p.images[0].src)}" alt="${esc(p.images[0].alt)}">`}
  </figure>
  ${section("problem", u.caseProblem, paragraphs(p.problem))}
  ${section("solution", u.caseSolution, `${paragraphs(p.solution)}<h3>${esc(u.caseFeatures)}</h3><ul class="list">${p.features.map(f => `<li>${esc(f)}</li>`).join("")}</ul>`)}
  ${p.images[1] ? `<figure class="case-media case-media-secondary"><img src="${esc(p.images[1].src)}" alt="${esc(p.images[1].alt)}" loading="lazy"></figure>` : ""}
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
