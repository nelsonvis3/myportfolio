import { skillBrain } from "./brain.js";
import { engineeringSection, automationSection } from "./process.js";
import { aboutSection, stackSection, contactSection } from "./about.js";
import { selectedWork } from "./showcase.js";
import { arrow } from "./shared.js";
import { esc } from "./shared.js";
import { profile } from "../data/profile.js";
import { socials } from "../data/socials.js";

function hero(): string {
  return `<section class="hero" id="inicio"><div class="wrap">
  <div class="hero-topline"><p class="eyebrow">Full Stack / React · Next.js · Django</p><span class="edition">Portfolio / ${new Date().getFullYear()}</span></div>
  <div class="hero-composition">
    <h1 lang="en"><span>Building</span><span>systems.</span><span class="title-secondary">Shaping experiences.</span></h1>
    ${skillBrain()}
    <div class="hero-profile"><span class="hero-profile-mark" aria-hidden="true">↳</span><div><p>${esc(profile.intro)}</p><p class="hero-availability">${esc(profile.availability)} · ${esc(profile.location)}</p></div></div>
    <div class="hero-links"><a href="#proyectos">Explorar proyectos ${arrow}</a><a href="${socials.cv}" download>Descargar CV ${arrow}</a><a href="#contacto">Contactarme ${arrow}</a></div>
  </div>
  <div class="hero-disciplines"><span><i>01</i>Interfaces y experiencia de uso</span><span><i>02</i>APIs y reglas de negocio</span><span><i>03</i>Datos y pruebas</span><a href="#proyectos" aria-label="Ir a proyectos"><span aria-hidden="true">↓</span></a></div>
  </div></section>`;
}

export function home(): string {
  return `${hero()}${selectedWork()}${engineeringSection()}${automationSection()}${aboutSection()}${stackSection()}${contactSection()}`;
}
