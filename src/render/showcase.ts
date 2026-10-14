import { projects } from "../data/projects.js";
import { socials } from "../data/socials.js";
import { esc, ext, arrow, label, tags, projectUrl } from "./shared.js";

const presentations = [
  { id:"ledger", code:"01", area:"MULTI-TENANT SAAS", statement:"Un sistema.<br>Muchas empresas.", phrase:"ISOLATED BY DESIGN", domains:["Tenancy", "Billing", "Audit"], mobile:"/img/ledgercore-mobile.png", screen:"Company workspace", width:1440, height:1000, alt:"Captura real de Fracxion: resumen de empresa y módulos de gestión", note:"Capturas reales de Fracxion en escritorio y móvil, con datos de prueba.", chapters:"Overview / Architecture / Multi-Tenancy", action:"Dentro del sistema", detailLabel:"CONTEXT MATTERS", detail:"Una empresa activa.<br>Un alcance definido." },
  { id:"ragnar", code:"02", area:"FULL STACK COMMERCE", statement:"La marca se siente.<br>La operación responde.", phrase:"BUILT TO MOVE", domains:["Commerce", "Inventory", "Payments"], mobile:"/img/ragnar-mobile.webp", screen:"Ragnar / Storefront", width:1917, height:1023, alt:"Captura real de la tienda Ragnar Suplementos", note:"Capturas reales de portada y catálogo móvil de Ragnar, en entornos locales de demostración.", chapters:"Overview / Architecture / Checkout & Inventory", action:"Dentro del e-commerce", detailLabel:"BEYOND THE CART", detail:"Productos y combos.<br>Un mismo inventario." },
  { id:"road", code:"03", area:"ROUTING & API INTEGRATION", statement:"De una coordenada<br>a todo un viaje.", phrase:"MAKE THE ROUTE VISIBLE", domains:["Routing", "Planning", "Daily logs"], mobile:"/img/roadledger-mobile.webp", screen:"RoadLedger / Trip planner", width:1886, height:1050, alt:"Captura real de RoadLedger: formulario y mapa inicial antes de calcular una ruta", note:"Capturas reales de escritorio y móvil del estado inicial. RoadLedger es un prototipo de planificación, no un registro ELD certificado.", chapters:"Overview / Architecture / Planning Pipeline", action:"Dentro del planificador", detailLabel:"FROM INPUT TO INSIGHT", detail:"Ubicaciones. Eventos.<br>Una lectura del viaje." },
];

export function selectedWork():string {
  return `<section id="proyectos" class="section selected-work"><div class="wrap">
    ${label("01","Selected work")}
    <div class="work-heading"><h2 lang="en">Selected<br><span class="indent">projects.</span></h2><p>Software que resuelve problemas.<br>Las decisiones detrás del resultado.</p><span class="work-count">(03)</span></div>
    ${projects.map((project,i)=>{
      const p=presentations[i];
      return `<article class="project-showcase showcase-${p.id}">
        <div class="showcase-heading"><div><p class="eyebrow"><span class="project-index">${p.code} /</span>${p.area}</p><h3><a href="${projectUrl(project)}">${esc(project.name)}</a></h3></div><p class="showcase-statement">${p.statement}</p></div>
        <a class="project-scene" data-project-scene href="${projectUrl(project)}">
          <span class="scene-catalog" aria-hidden="true">SELECTED OBJECT / ${p.code}<span>${p.phrase}</span></span>
          <span class="scene-number" aria-hidden="true">${p.code}</span><span class="scene-horizon" aria-hidden="true"></span>
          <span class="scene-orbit scene-orbit-a" aria-hidden="true"></span><span class="scene-orbit scene-orbit-b" aria-hidden="true"></span>
          <div class="scene-composition">
            <div class="scene-wire" aria-hidden="true"><span></span><span></span><span></span></div>
            <div class="project-device"><div class="device-chrome" aria-hidden="true"><span class="device-lights">● ● ●</span><span>${p.screen}</span><span>↗</span></div><img src="${esc(project.img[0])}" alt="${p.alt}" width="${p.width}" height="${p.height}" loading="lazy"><span class="device-edge" aria-hidden="true"></span></div>
            <div class="scene-companion" aria-hidden="true"><img src="${p.mobile}" alt="" width="390" height="844" loading="lazy"><span class="companion-home"></span></div>
            <div class="scene-plaque" aria-hidden="true"><span class="small-label">${p.detailLabel}</span><span class="plaque-line"></span><p>${p.detail}</p><span class="plaque-footer">${p.domains.join(" / ")}</span></div>
          </div>
          <span class="scene-bottom"><span class="scene-domains" aria-hidden="true">${p.domains.map(d=>`<span>${d}</span>`).join("")}</span><span class="scene-explore">Explorar caso<span class="sr-only">: ${esc(project.name)}</span> ${arrow}</span></span>
        </a>
        <p class="showcase-evidence">${p.note}</p>
        <div class="showcase-summary"><div class="showcase-product"><p>${esc(project.desc)}</p><ul class="showcase-features" aria-label="Funciones de ${esc(project.name)}">${project.highlights.map(item=>`<li>${esc(item)}</li>`).join("")}</ul></div><div><p class="showcase-contribution"><span class="small-label">MI TRABAJO</span>${esc(project.contribution)}</p>${tags(project.stack)}<div class="showcase-links"><a class="text-link" href="${projectUrl(project)}">${p.action} ${arrow}</a>${project.repo?`<a class="text-link" ${ext(project.repo)}>Ver código<span class="sr-only"> de ${esc(project.name)}</span> ${arrow}</a>`:""}</div><p class="case-chapters">${p.chapters}</p></div></div>
      </article>`;
    }).join("")}
    <a class="work-archive" ${ext(socials.github)}><span class="small-label">MORE EXPLORATIONS</span><span>El código también cuenta la historia.</span><span>GitHub ${arrow}</span></a>
  </div></section>`;
}
