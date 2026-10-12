import { skillBrain } from "./brain.js";
import { engineeringSection, automationSection } from "./process.js";
import { aboutSection, stackSection, contactSection } from "./about.js";
import { selectedWork } from "./showcase.js";
import { arrow } from "./shared.js";

function hero(): string {
  return `<section class="hero" id="inicio"><div class="wrap">
  <div class="hero-topline"><p class="eyebrow">Full Stack / AI-Assisted Engineering</p><span class="edition">Portfolio — Selected work / 2026</span></div>
  <div class="hero-composition">
    <h1 lang="en"><span>Building</span><span>systems.</span><span class="title-secondary">Shaping experiences.</span></h1>
    ${skillBrain()}
    <div class="hero-profile"><span class="hero-profile-mark" aria-hidden="true">↳</span><p>Soy <strong>Nelson Sivisstum.</strong> Desarrollo aplicaciones Full Stack, arquitectura SaaS y flujos asistidos por IA. Del primer modelo de datos a la experiencia que llega al usuario.</p></div>
    <div class="hero-links"><a href="#proyectos">Explorar proyectos ${arrow}</a><a href="#contacto">Iniciar una conversación ${arrow}</a></div>
  </div>
  <div class="hero-disciplines"><span><i>01</i>Full Stack Development</span><span><i>02</i>SaaS Engineering</span><span><i>03</i>AI-Assisted Workflows</span><a href="#proyectos" aria-label="Ir a proyectos"><span aria-hidden="true">↓</span></a></div>
  </div></section>`;
}

export function home(): string {
  return `${hero()}${selectedWork()}${engineeringSection()}${automationSection()}${aboutSection()}${stackSection()}${contactSection()}`;
}
