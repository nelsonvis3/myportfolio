// Todas las páginas: menú, caso de estudio de la home, clips, portadas y brillo de las tarjetas. El scroll suave y las
// animaciones (motion.ts) llegan con import() cuando la página ya cargó; sin JS o con movimiento reducido
// la página se ve completa y quieta.
const root = document.documentElement;
root.classList.add("js");

// Al recargar, la página vuelve al inicio: sin recordar el scroll ni el caso abierto (#caso-<id>).
// Llegar con un link a #caso-<id> (por ejemplo, "← Proyectos" en un caso) sigue llevando a ese caso.
history.scrollRestoration = "manual";
if ((performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type === "reload") {
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  window.scrollTo(0, 0);
}
const small = matchMedia("(max-width: 760px)").matches;
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(pointer: fine)").matches;

// Desplazamiento a un elemento: lo reemplaza motion.ts con Lenis cuando está activo.
export type ScrollTo = (target: HTMLElement | number) => void;
let scrollTo: ScrollTo = target => {
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + scrollY - 88;
  window.scrollTo({ top, behavior: still ? "auto" : "smooth" });
};

// Encabezado: más opaco al bajar; menú desplegable en pantallas chicas.
const header = document.querySelector<HTMLElement>(".header");
const casesArea = document.querySelector<HTMLElement>("[data-cases]");
let casesPad = casesArea ? parseFloat(getComputedStyle(casesArea).paddingTop) : 0;
addEventListener("resize", () => { if (casesArea) casesPad = parseFloat(getComputedStyle(casesArea).paddingTop); });
const onScroll = () => {
  header?.classList.toggle("is-scrolled", scrollY > 24);
  // En los casos de la home quedan arriba solo las pestañas de proyectos; al salir vuelve el encabezado.
  if (casesArea) {
    // Las pestañas quedan pegadas cuando la sección pasó el borde de arriba más su relleno.
    const r = casesArea.getBoundingClientRect();
    root.classList.toggle("in-cases", r.top + casesPad < 88 && r.bottom > innerHeight * 0.5);
  }
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const menu = document.querySelector<HTMLButtonElement>(".menu-toggle");
const panel = document.querySelector<HTMLElement>("#nav-menu");
function setMenu(open: boolean, focus = false): void {
  if (!menu || !panel) return;
  panel.hidden = !open;
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", (open ? menu.dataset.labelClose : menu.dataset.labelOpen) ?? "");
  header?.classList.toggle("menu-open", open);
  if (focus) menu.focus();
}
menu?.addEventListener("click", () => setMenu(panel?.hidden ?? false));
panel?.addEventListener("click", event => { if ((event.target as Element).closest("a")) setMenu(false); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && menu?.getAttribute("aria-expanded") === "true") setMenu(false, true); });

// Links internos (#id) con el mismo scroll que el resto de la página.
document.addEventListener("click", event => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
  if (!link || link.dataset.caseLink || link.origin !== location.origin || link.pathname !== location.pathname) return;
  const target = link.hash === "#main" ? 0 : document.getElementById(decodeURIComponent(link.hash.slice(1)));
  if (target === null) return;
  event.preventDefault();
  scrollTo(target);
});

// Caso de estudio de la home: se ve un proyecto por vez. Las tarjetas de proyectos y las pestañas lo cambian
// en el lugar, sin salir de la página.
const panels = [...document.querySelectorAll<HTMLElement>("[data-case]")];
const casesSection = document.querySelector<HTMLElement>("[data-cases]");
function select(next: HTMLElement): boolean {
  const changed = next.hidden || panels.some(p => p !== next && !p.hidden);
  for (const p of panels) p.hidden = p !== next;
  for (const tab of document.querySelectorAll<HTMLAnchorElement>(".case-tabs [data-case-link]")) {
    if (tab.dataset.caseLink === next.dataset.case) tab.setAttribute("aria-current", "true"); else tab.removeAttribute("aria-current");
  }
  return changed;
}
function showCase(id: string, scroll: boolean): void {
  const next = panels.find(p => p.dataset.case === id);
  if (!next || !casesSection) return;
  const changed = select(next);
  if (changed && !still) { next.classList.remove("is-entering"); void next.offsetWidth; next.classList.add("is-entering"); }
  history.replaceState(null, "", `#caso-${id}`);
  document.dispatchEvent(new CustomEvent("case-change"));
  if (scroll) scrollTo(casesSection);
}
if (panels.length) {
  const fromHash = panels.find(p => location.hash === `#caso-${p.dataset.case}`);
  select(fromHash ?? panels[0]);
  if (fromHash) requestAnimationFrame(() => casesSection?.scrollIntoView());
  document.addEventListener("click", event => {
    const link = (event.target as Element).closest<HTMLAnchorElement>("[data-case-link]");
    if (!link?.dataset.caseLink) return;
    event.preventDefault();
    showCase(link.dataset.caseLink, true);
  });
}

// Clips de escritorio en el celular: se ven chicos; tocarlos los abre en pantalla completa. iPhone no tiene
// requestFullscreen en elementos, solo webkitEnterFullscreen en el video.
for (const video of document.querySelectorAll<HTMLVideoElement & { webkitEnterFullscreen?: () => void }>("[data-fullscreen]")) {
  video.addEventListener("click", () => {
    if (!matchMedia("(max-width: 760px)").matches) return;
    if (video.requestFullscreen) void video.requestFullscreen().catch(() => video.webkitEnterFullscreen?.());
    else video.webkitEnterFullscreen?.();
  });
}

// Clips de "Cómo se usa": cada uno se reproduce solo mientras está en pantalla. Con movimiento reducido
// quedan quietos, con controles para reproducirlos a mano.
const clips = [...document.querySelectorAll<HTMLVideoElement>("[data-clip]")];
for (const video of clips) {
  if (small && video.dataset.posterMobile) video.poster = video.dataset.posterMobile;
  if (still) video.controls = true;
}
if (!still && clips.length) {
  const watcher = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      const video = target as HTMLVideoElement;
      if (isIntersecting) void video.play().catch(() => {}); else video.pause();
    }
  }, { threshold: 0.45 });
  clips.forEach(video => watcher.observe(video));
}

// Portadas: con mouse se inclinan hacia el puntero.
for (const figure of still || !fine ? [] : document.querySelectorAll<HTMLElement>("[data-cover]")) {
  const scene = figure.querySelector<HTMLElement>(".cover3d-scene");
  if (!scene) continue;
  const tilt = (rx: number, ry: number) => { scene.style.setProperty("--rx", `${rx.toFixed(2)}deg`); scene.style.setProperty("--ry", `${ry.toFixed(2)}deg`); };
  figure.addEventListener("pointermove", event => {
    const r = figure.getBoundingClientRect();
    tilt(5 - ((event.clientY - r.top) / r.height - 0.5) * 8, -9 + ((event.clientX - r.left) / r.width - 0.5) * 14);
  });
  figure.addEventListener("pointerleave", () => tilt(5, -9));
}

// Brillo ámbar dentro de las tarjetas, en el lugar del puntero (solo con mouse).
if (fine && !still) {
  document.addEventListener("pointermove", event => {
    const card = (event.target as Element).closest<HTMLElement>(".card, .challenge-row, .work-card a");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--px", `${event.clientX - r.left}px`);
    card.style.setProperty("--py", `${event.clientY - r.top}px`);
  }, { passive: true });
}

// Puntero: un destello de cuatro puntas que reemplaza al cursor del sistema, con una estela de luz detrás.
// Solo con mouse y sin movimiento reducido; en táctil queda el comportamiento normal.
if (fine && !still) {
  const star = document.createElement("div");
  star.className = "star-cursor";
  star.setAttribute("aria-hidden", "true");
  star.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12 6.6-.6 11.4-5.4 12-12z"/></svg>`;
  document.body.append(star);
  root.classList.add("has-star");
  addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse") return;
    star.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    star.classList.add("is-visible");
    star.classList.toggle("is-hover", !!(event.target as Element).closest("a, button, [data-cover], video[data-fullscreen]"));
  }, { passive: true });
  addEventListener("pointerdown", () => star.classList.add("is-down"));
  addEventListener("pointerup", () => star.classList.remove("is-down"));
  document.documentElement.addEventListener("pointerleave", () => star.classList.remove("is-visible"));

  // Estela: tres hilos de luz (crema, ámbar y cobre) que siguen al destello con distinto retraso. Se afinan
  // hacia la cola y, con el mouse quieto, se juntan en la punta y el canvas deja de dibujar.
  const canvas = document.createElement("canvas");
  canvas.className = "trail";
  canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  const ctx = canvas.getContext("2d");
  const LENGTH = 34;
  const strands = [
    { color: "242, 236, 226", width: 2.4, ease: 0.4, halo: 0 },
    { color: "228, 168, 83", width: 3.6, ease: 0.26, halo: 14 },
    { color: "196, 98, 45", width: 3, ease: 0.15, halo: 0 },
  ].map(s => ({ ...s, points: [] as { x: number; y: number }[] }));
  let px = -1, py = -1, drawing = false, movedAt = 0;
  const size = () => {
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  addEventListener("resize", size);
  const draw = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    let moving = performance.now() - movedAt < 120;
    for (const s of strands) {
      const pts = s.points;
      const head = pts[0] ?? { x: px, y: py };
      const next = { x: head.x + (px - head.x) * s.ease * 2.2, y: head.y + (py - head.y) * s.ease * 2.2 };
      pts.unshift(next);
      if (pts.length > LENGTH) pts.pop();
      // Cada punto se acerca al anterior: la cola se recoge sola cuando el mouse para.
      for (let i = 1; i < pts.length; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * s.ease;
        pts[i].y += (pts[i - 1].y - pts[i].y) * s.ease;
      }
      const tail = pts[pts.length - 1];
      if (Math.abs(tail.x - px) + Math.abs(tail.y - py) > 0.6) moving = true;
      ctx.lineCap = "round";
      for (let i = 1; i < pts.length - 1; i++) {
        const t = 1 - i / pts.length;
        const a = pts[i - 1], b = pts[i], c = pts[i + 1];
        ctx.beginPath();
        ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
        if (s.halo) {
          ctx.strokeStyle = `rgba(${s.color}, ${(0.09 * t).toFixed(3)})`;
          ctx.lineWidth = s.halo * t;
          ctx.stroke();
        }
        ctx.strokeStyle = `rgba(${s.color}, ${(0.85 * t * t).toFixed(3)})`;
        ctx.lineWidth = s.width * t;
        ctx.stroke();
      }
    }
    if (moving) requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, innerWidth, innerHeight); for (const s of strands) s.points.length = 0; drawing = false; }
  };
  addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse") return;
    px = event.clientX; py = event.clientY; movedAt = performance.now();
    if (!drawing) { drawing = true; requestAnimationFrame(draw); }
  }, { passive: true });
}

// Animaciones en bucle (brillos, orbe, cinta del stack): se pausan mientras no están en pantalla.
const loops = document.querySelectorAll<HTMLElement>(".glow, .orb, .marquee");
if (loops.length) {
  const looper = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) target.classList.toggle("is-paused", !isIntersecting);
  });
  loops.forEach(el => looper.observe(el));
}

// Scroll suave y animaciones, después del primer pintado.
if (!still) {
  const boot = () => void import("./motion").then(m => { scrollTo = m.start() ?? scrollTo; }).catch(() => root.classList.remove("motion"));
  const idle = () => ("requestIdleCallback" in window ? requestIdleCallback(boot, { timeout: 800 }) : setTimeout(boot, 60));
  if (document.readyState === "complete") idle(); else addEventListener("load", idle, { once: true });
}
