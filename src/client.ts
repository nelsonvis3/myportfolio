// Todas las páginas: menú mobile y cambio de tema claro/oscuro. Casos de estudio: clips y portada 3D.
const root = document.documentElement;
document.body.classList.add("js");

const toggle = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
function label(): void {
  if (!toggle) return;
  const dark = root.dataset.theme !== "light";
  toggle.setAttribute("aria-label", (dark ? toggle.dataset.labelLight : toggle.dataset.labelDark) ?? "");
  toggle.setAttribute("aria-pressed", String(!dark));
}
label();
toggle?.addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch { /* el tema igual cambia en esta visita */ }
  label();
  document.dispatchEvent(new CustomEvent("themechange", { detail: next }));
});

const menu = document.querySelector<HTMLButtonElement>(".menu-toggle");
const links = document.querySelector<HTMLUListElement>("#nav-links");
const close = (focus = false) => { links?.classList.remove("open"); menu?.setAttribute("aria-expanded", "false"); if (focus) menu?.focus(); };
menu?.addEventListener("click", () => menu.setAttribute("aria-expanded", String(links?.classList.toggle("open") ?? false)));
links?.addEventListener("click", event => { if ((event.target as Element).closest("a")) close(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && menu?.getAttribute("aria-expanded") === "true") close(true); });

// Clips de escritorio en el celular: se ven chicos; tocarlos los abre en pantalla completa. iPhone no tiene
// requestFullscreen en elementos, solo webkitEnterFullscreen en el video.
for (const video of document.querySelectorAll<HTMLVideoElement & { webkitEnterFullscreen?: () => void }>("[data-fullscreen]")) {
  video.addEventListener("click", () => {
    if (!matchMedia("(max-width: 760px)").matches) return;
    if (video.requestFullscreen) void video.requestFullscreen().catch(() => video.webkitEnterFullscreen?.());
    else video.webkitEnterFullscreen?.();
  });
}

const small = matchMedia("(max-width: 760px)").matches;
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

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

// Portada 3D: con mouse se inclina hacia el puntero; en táctil gira apenas mientras pasa por la pantalla.
for (const figure of still ? [] : document.querySelectorAll<HTMLElement>("[data-cover]")) {
  const scene = figure.querySelector<HTMLElement>(".cover3d-scene");
  if (!scene) continue;
  const tilt = (rx: number, ry: number) => { scene.style.setProperty("--rx", `${rx.toFixed(2)}deg`); scene.style.setProperty("--ry", `${ry.toFixed(2)}deg`); };
  if (matchMedia("(pointer: fine)").matches) {
    figure.addEventListener("pointermove", event => {
      const r = figure.getBoundingClientRect();
      tilt(7 - ((event.clientY - r.top) / r.height - 0.5) * 8, -13 + ((event.clientX - r.left) / r.width - 0.5) * 14);
    });
    figure.addEventListener("pointerleave", () => tilt(7, -13));
  } else {
    let queued = false;
    const onScroll = () => {
      queued = false;
      const r = figure.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, 1 - (r.top + r.height / 2) / innerHeight));
      tilt(9 - t * 6, -18 + t * 12);
    };
    addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }
}

// "Volver al inicio": la home lo maneja con Lenis (scene.ts); en el resto, scroll nativo.
for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-to-top]")) {
  link.addEventListener("click", event => {
    event.preventDefault();
    if (document.dispatchEvent(new CustomEvent("scroll-to-top", { cancelable: true }))) scrollTo({ top: 0, behavior: still ? "auto" : "smooth" });
  });
}

// Home: mientras el encabezado está escondido (.nav-auto), aparece al acercar el mouse arriba o al scrollear hacia arriba.
if (document.body.classList.contains("home")) {
  const body = document.body;
  let lastY = scrollY;
  addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse") return;
    const header = document.querySelector(".header");
    body.classList.toggle("nav-peek", event.clientY < 90 || !!header?.matches(":hover"));
  }, { passive: true });
  addEventListener("scroll", () => {
    const y = scrollY;
    if (Math.abs(y - lastY) > 8) { body.classList.toggle("nav-peek", y < lastY); lastY = y; }
  }, { passive: true });
}
