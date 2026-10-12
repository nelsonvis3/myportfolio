import type { Project } from "../data/types.js";
export const esc = (s: string) => s.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
export const arrow = '<svg class="arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.4"/></svg>';
export const ext = (url: string) => `href="${esc(url)}" target="_blank" rel="noopener noreferrer"`;
export const tags = (items: string[]) => `<ul class="tags" aria-label="Tecnologías">${items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>`;
export const list = (items: string[]) => `<ul class="text-list">${items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>`;
export const label = (num: string, name: string) => `<p class="eyebrow"><span>${name}</span><span class="index">/ ${num}</span></p>`;
export const projectUrl = (p: Project) => `/proyectos/${p.id}/`;
export const projectLinks = (p: Project) => (p.repo || p.demo)
  ? `<div class="actions">${p.repo ? `<a class="text-link" ${ext(p.repo)}>Ver código ${arrow}</a>` : ""}${p.demo ? `<a class="text-link" ${ext(p.demo)}>Abrir proyecto ${arrow}</a>` : ""}</div>` : "";
