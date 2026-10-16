export const esc = (s: string) => s.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
export const ext = (url: string) => `href="${esc(url)}" target="_blank" rel="noopener noreferrer"`;
import type { Content, Project } from "../content/types.js";

/** Demo (o "Demo en preparación" si todavía no hay) y video externo del proyecto. */
export const projectLinks = (c: Content, p: Project) => [
  p.demo ? `<a class="btn" ${ext(p.demo)}>${esc(p.demoLabel)}</a>` : `<span class="btn is-pending">${esc(c.ui.demoSoon)}</span>`,
  p.video ? `<a class="btn" ${ext(p.video)}>${esc(p.videoLabel)}</a>` : "",
].join("");
export const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
