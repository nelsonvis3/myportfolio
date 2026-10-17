export const esc = (s: string) => s.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
export const ext = (url: string) => `href="${esc(url)}" target="_blank" rel="noopener noreferrer"`;
import type { Content, Project } from "../content/types.js";

/** Demo (o "Demo en preparación" si todavía no hay) y video externo del proyecto. */
export const projectLinks = (c: Content, p: Project) => [
  p.demo ? `<a class="btn" ${ext(p.demo)}>${esc(p.demoLabel)}</a>` : `<span class="btn is-pending">${esc(c.ui.demoSoon)}</span>`,
  p.video ? `<a class="btn" ${ext(p.video)}>${esc(p.videoLabel)}</a>` : "",
].join("");
/** Portada 3D del proyecto: la captura de escritorio inclinada en perspectiva y la de celular delante.
 * Es CSS 3D; client.ts la inclina siguiendo el puntero (o el scroll en táctil). */
export const cover = (p: Project, cls = "") => `<figure class="cover3d ${cls}" data-cover>
    <div class="cover3d-scene">
      <img class="cover3d-desk" src="${esc(p.images[0].src)}" alt="${esc(p.images[0].alt)}">
      <img class="cover3d-phone" src="${esc(p.phoneShot)}" alt="" loading="lazy">
    </div>
  </figure>`;
export const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
