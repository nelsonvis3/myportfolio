import { aiTools, workflow, automation } from "../data/workflow.js";
import { label } from "./shared.js";

function toolSigil(index: number): string {
  const path = index === 0 ? '<path d="m13 9-7 9 7 9m10-18 7 9-7 9m-3-17-4 20"/>' : '<path d="M18 4v28M4 18h28M8 8l20 20M8 28 28 8"/><circle cx="18" cy="18" r="7"/>';
  return `<span class="tool-sigil" aria-hidden="true"><svg viewBox="0 0 36 36" fill="none" stroke="currentColor" stroke-width="1.2">${path}</svg></span>`;
}

export function engineeringSection(): string {
  return `<section id="enfoque" class="section engineering-section"><div class="wrap">
  ${label("02", "Cómo trabajo")}
  <div class="engineering-grid"><div class="engineering-heading"><h2 lang="en">Plan. Build.<br>Review.<br>Test.</h2><p>Primero entiendo qué necesita resolver la aplicación. Después implemento, reviso permisos y casos límite, y compruebo el comportamiento. La IA es una herramienta dentro de ese proceso.</p><span class="engineering-coordinate" aria-hidden="true">[ CÓDIGO + REVISIÓN + PRUEBAS ]</span></div>
  <div class="tool-index" data-tool-motion>${aiTools.map((tool, i) => `<article class="tool-entry">${toolSigil(i)}<div class="tool-entry-title"><span class="small-label">0${i + 1} / DEVELOPMENT TOOL</span><h3>${tool.name}</h3></div><p>${tool.description}</p><span class="tool-tasks">${tool.tasks}</span></article>`).join("")}<p class="accountability">La IA acelera el trabajo.<br><strong>Las decisiones técnicas siguen siendo mías.</strong></p></div></div>
  <div class="workflow" data-tabs data-initial="1"><div class="flow-heading"><span class="small-label">THE ENGINEERING LOOP</span><span>Explorá cada etapa</span></div><div class="workflow-nodes" data-tablist aria-label="Etapas del desarrollo">${workflow.map((step, i) => `<button type="button" class="workflow-node" id="step-${step.id}" data-tab="${step.id}" aria-controls="panel-${step.id}"><span class="node-index">0${i + 1}</span><span lang="en">${step.name}</span><span class="node-arrow" aria-hidden="true">→</span></button>`).join("")}</div><div class="workflow-panels">${workflow.map((step, i) => `<div class="workflow-panel" data-panel="${step.id}" id="panel-${step.id}" aria-labelledby="step-${step.id}"><span class="panel-index" aria-hidden="true">0${i + 1}</span><div><span class="small-label">${step.owner}</span><h3>${step.title}</h3><p>${step.text}</p></div><div class="workflow-output"><span class="small-label">DELIVERABLE</span><p>${step.output}</p></div></div>`).join("")}</div></div>
  <p class="engineering-principle" lang="en">Deliberate. Testable. <span>Accountable.</span></p>
  </div></section>`;
}

function nodeShape(index: number): string {
  const paths = [
    '<path d="M17 8H8v48h9m30-48h9v48h-9M20 32h24m-7-7 7 7-7 7"/>',
    '<rect x="10" y="10" width="44" height="44" rx="4"/><path d="m25 24-8 8 8 8m14-16 8 8-8 8m-6-18-4 20"/>',
    '<path d="m32 4 28 28-28 28L4 32Zm0 12 16 16-16 16-16-16Zm0 9v14m-7-7h14"/>',
    '<path d="M21 7h22l14 14v22L43 57H21L7 43V21Z"/><path d="m23 32 6 6 13-14"/>',
    '<circle cx="32" cy="32" r="24"/><path d="m21 32 8 8 16-18"/>'
  ];
  return `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="1.2">${paths[index]}</svg>`;
}

export function automationSection(): string {
  return `<section id="automatizacion" class="section automation-section"><div class="wrap">
  <details class="automation-study"><summary><span><span class="small-label">EXPLORACIÓN / 03</span><span class="automation-study-title">Diseño de un flujo de automatización</span></span><span class="automation-study-action">Ver estudio conceptual <span aria-hidden="true">+</span></span></summary>
  <div class="automation-intro">${label("03", "AI Automation / Concept study")}<h2 lang="en">Systems that<br><span class="indent">work smarter.</span></h2><p>Explorar cómo conectar datos, servicios y decisiones.<br>Un estudio de flujo, desde la entrada hasta un resultado trazable.</p></div>
  <div class="automation-diagram" data-tabs data-flow-motion data-initial="0"><div class="diagram-topline"><span class="diagram-id">FLOW STUDY / 001</span><span class="concept-status"><i></i>Diagrama conceptual · sin servicios conectados</span></div>
  <div class="flow-playback" hidden><span data-flow-label>Recorrido automático · 01 / 05</span><button type="button" data-flow-toggle>Pausar recorrido <span aria-hidden="true">Ⅱ</span></button></div>
  <div class="pipeline-nodes" data-tablist data-vertical-mobile aria-label="Etapas del flujo conceptual de automatización"><svg class="pipeline-route" aria-hidden="true" focusable="false"><path class="route-track"/><path class="route-progress"/><circle class="route-particle" r="3"/></svg>${automation.map((step, i) => `<button type="button" class="pipeline-node" id="auto-${step.id}" data-tab="${step.id}" aria-controls="auto-panel-${step.id}"><span class="pipeline-shape">${nodeShape(i)}</span><span class="pipeline-number">0${i + 1}</span><span class="pipeline-title" lang="en">${step.name}</span><span class="pipeline-subtitle" lang="en">${step.subtitle}</span></button>`).join("")}</div>
  <div class="human-check"><span></span><p>HUMAN REVIEW BEFORE ACTION</p><span></span></div>
  <div class="automation-panels">${automation.map((step, i) => `<div class="automation-panel" data-panel="${step.id}" id="auto-panel-${step.id}" aria-labelledby="auto-${step.id}"><div><span class="small-label">0${i + 1} / ${step.name}</span><h3>${step.title}</h3><p>${step.text}</p></div><div class="automation-example"><span class="small-label">ILLUSTRATIVE SCENARIO</span><p>${step.example}</p><span class="automation-output">↳ ${step.output}</span></div></div>`).join("")}</div>
  </div><p class="automation-note">Esta pieza explica una arquitectura posible. No ejecuta agentes, llamadas a APIs ni acciones automáticas.</p>
  </details></div></section>`;
}
