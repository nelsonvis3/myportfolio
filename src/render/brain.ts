import { constellation } from "../data/constellation.js";
import { esc } from "./shared.js";

export function skillBrain(): string {
  const connections = [
    { point:[380,360], path:"M380 360 C350 280 220 270 185 155" },
    { point:[620,430], path:"M620 430 C660 405 695 420 730 420" },
    { point:[380,640], path:"M380 640 C335 670 345 725 310 725" },
    { point:[570,690], path:"M570 690 C600 760 790 735 825 820" },
  ];
  return `<figure class="skill-brain" data-brain>
    <div class="brain-topline"><span class="small-label">A NETWORK OF POSSIBILITIES</span><span class="small-label" aria-hidden="true">NEURAL INTERFACE</span></div>
    <div class="brain-viewport" tabindex="-1" role="group" aria-label="Cerebro de habilidades" aria-describedby="brain-instructions" aria-keyshortcuts="ArrowLeft ArrowRight Home End">
      <img class="brain-poster" src="/img/brain.webp" alt="Cerebro tridimensional dibujado con líneas luminosas azules y violetas que recorren sus pliegues" width="655" height="624" fetchpriority="high">
      <canvas id="brain-canvas" width="800" height="800" aria-hidden="true"></canvas>
      <svg class="brain-connections" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">${connections.map(({point:[x,y],path},i)=>`<g class="brain-connection${i===0?" is-active":""}" data-brain-connection="${i}">
        <path class="brain-link" d="${path}"/><path class="brain-impulse" d="${path}" pathLength="100"/>
        <path class="brain-dendrite" d="M${x-24} ${y+18} Q${x-8} ${y+16} ${x} ${y} Q${x+8} ${y-12} ${x+24} ${y-9}"/>
        <circle class="brain-synapse-ring" cx="${x}" cy="${y}" r="10"/><circle class="brain-synapse" cx="${x}" cy="${y}" r="3.5"/>
      </g>`).join("")}</svg>
      <div class="brain-selector" role="group" aria-label="Conexiones del cerebro: elegir área de habilidades">${constellation.map((skill,i)=>`<button type="button" class="brain-node" data-brain-skill="${i}" data-coordinate="${esc(skill.coordinate)}" disabled aria-pressed="${i===0}" aria-controls="brain-detail"><span class="brain-node-index" aria-hidden="true">0${i+1}</span><span class="brain-node-name">${esc(skill.name)}</span><span class="brain-node-tools">${esc(skill.tools.split(" · ").slice(0,2).join(" / "))}</span></button>`).join("")}</div>
    </div>
    <figcaption class="brain-caption">
      <div class="brain-instructions"><p id="brain-instructions"><span data-brain-hint>Explorá las habilidades</span><span aria-hidden="true"> ↔</span><span class="sr-only"> Usá las flechas izquierda y derecha del teclado para cambiar de habilidad.</span></p><button type="button" class="brain-pause" data-brain-pause hidden><span data-pause-icon aria-hidden="true">Ⅱ</span><span data-pause-label>Pausar giro</span></button></div>
      <div class="brain-detail" id="brain-detail">${constellation.map((skill,i)=>`<div data-brain-panel="${i}"${i ? " hidden" : ""}><p class="small-label">${esc(skill.coordinate)}</p><h2>${esc(skill.tools)}</h2><p>${esc(skill.detail)}</p></div>`).join("")}</div>
      <span class="sr-only" role="status" data-brain-announcement></span><noscript><p class="brain-static-note">Todas las tecnologías están en <a href="#stack">Technical index ↗</a>.</p></noscript>
    </figcaption>
  </figure>`;
}
