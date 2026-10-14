import { profile } from "../data/profile.js";
import { socials } from "../data/socials.js";
import { timeline } from "../data/timeline.js";
import { education } from "../data/education.js";
import { now } from "../data/now.js";
import { skills } from "../data/skills.js";
import { esc, ext, arrow, label } from "./shared.js";

export function aboutSection(): string {
  return `<section id="sobre-mi" class="section about-section"><div class="wrap">
  ${label("04", "About the developer")}
  <div class="about-lead"><h2 lang="en">A builder.<br><span>Always learning.</span></h2><div class="about-location"><span class="small-label">BASED IN</span><p>Formosa,<br>Argentina.</p><span class="location-cross" aria-hidden="true">+</span></div></div>
  <div class="about-story"><p class="about-statement">Me interesa lo que una interfaz permite hacer.<br>Y todo lo que necesita<br><span>para funcionar bien.</span></p><div><p>Soy Nelson Sivisstum, desarrollador autodidacta de Formosa, Argentina. Trabajo principalmente con React, Next.js, TypeScript y Python/Django.</p><p>En Ragnar desarrollé el recorrido de compra y las herramientas para administrar una tienda. En Fracxion trabajé sobre clientes, facturas y cobros, con datos y permisos separados por empresa. Me interesa entender el recorrido completo de una operación, desde el formulario hasta lo que queda guardado.</p><p>Uso Codex y Claude Code para explorar código y avanzar en la implementación. Reviso los cambios y los contrasto con las reglas del proyecto y las pruebas disponibles.</p><p>Busco mi primera oportunidad profesional en desarrollo Full Stack. Quiero aportar con estas tecnologías, aprender del trabajo con otras personas y participar en la evolución de un producto.</p><a class="text-link" href="${socials.cv}" download>Descargar CV ${arrow}</a></div></div>
  <div class="background-details"><details><summary><span>01 /</span>Recorrido<span aria-hidden="true">+</span></summary><ol class="timeline">${timeline.map(item => `<li><span>${esc(item.period)}</span><p>${esc(item.text)}</p></li>`).join("")}</ol></details><details><summary><span>02 /</span>Formación continua<span aria-hidden="true">+</span></summary><ul class="education">${education.map(item => `<li><div><h3>${esc(item.name)}</h3><p>${esc(item.detail)}</p></div><span>${esc(item.status)}</span></li>`).join("")}</ul></details><details><summary><span>03 /</span>En este momento<span aria-hidden="true">+</span></summary><ul class="now-list">${now.map(item => `<li>${esc(item)}</li>`).join("")}</ul></details></div>
  </div></section>`;
}

export function stackSection(): string {
  return `<section id="stack" class="section stack-section"><div class="wrap">
  <div class="stack-intro">${label("05", "Technical index")}<h2 lang="en">The right tools.<br>A clear purpose.</h2><p>Tecnologías conectadas al trabajo real.<br>Las áreas en exploración están identificadas.</p></div>
  <div class="skills">${skills.map((group, i) => `<article class="skill-row"><span class="skill-number">0${i + 1}</span><div><h3 lang="en">${esc(group.title)}</h3><p>${esc(group.description)}</p></div><ul>${group.items.map(item => `<li>${esc(item)}</li>`).join("")}</ul><span class="skill-corner" aria-hidden="true">↗</span></article>`).join("")}</div>
  </div></section>`;
}

export function contactSection(): string {
  return `<section id="contacto" class="contact-section"><div class="wrap">
  <div class="contact-top">${label("06", "Start a conversation")}<p><span class="availability-dot"></span>${profile.availability}</p></div>
  <a class="contact-heading" href="mailto:${socials.email}"><h2 lang="en">LET’S BUILD<br><span>WHAT’S NEXT.</span></h2><span class="contact-arrow">${arrow}</span></a>
  <div class="contact-bottom"><a class="contact-email" href="mailto:${socials.email}">${socials.email}</a><div><a ${ext(socials.github)}>GitHub ${arrow}</a><a ${ext(socials.linkedin)}>LinkedIn ${arrow}</a></div><span class="contact-location">FORMOSA, ARGENTINA<br>OPEN TO COLLABORATION</span></div>
  </div></section>`;
}
