// Scroll suave (Lenis) y animaciones atadas al scroll (GSAP ScrollTrigger). Lo carga client.ts después del
// primer pintado y solo sin movimiento reducido. Nada de esto esconde contenido: lo que ya está en pantalla
// al cargar no se anima, y sin este archivo la página se ve completa.
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ScrollTo } from "./client";

gsap.registerPlugin(ScrollTrigger);

// Saltos por links: arrancan y frenan suave, y duran más cuanto más lejos van (entre 0,9 y 1,8 s).
const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);
const jumpDuration = (distance: number) => Math.min(1.8, Math.max(0.9, 0.7 + Math.abs(distance) / 3500));

/** casesTop: posición de scroll que deja las pestañas de los casos arriba de todo (la calcula client.ts). */
export function start(casesTop: () => number): ScrollTo {
  const root = document.documentElement;
  root.classList.add("motion");

  // lerp más bajo = la rueda se desliza con más inercia. En táctil queda el scroll nativo.
  const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  reveals();
  words();
  hero();
  work();

  document.addEventListener("case-change", () => requestAnimationFrame(() => ScrollTrigger.refresh()));
  addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

  // Al llegar con #caso-<id> (por ejemplo, desde "← Proyectos" en un caso), el pin de proyectos agrega
  // espacio arriba después del primer salto: se vuelve a ubicar el caso con el pin ya armado.
  const cases = document.querySelector<HTMLElement>("[data-cases]");
  if (cases && location.hash.startsWith("#caso-")) {
    ScrollTrigger.refresh();
    lenis.scrollTo(casesTop(), { immediate: true, force: true });
  }

  // Con un elemento, Lenis ya descuenta el scroll-padding-top de html (styles.css): no se suma otro margen.
  return target => {
    const distance = (typeof target === "number" ? target : target.getBoundingClientRect().top + scrollY) - scrollY;
    lenis.scrollTo(target, { duration: jumpDuration(distance), easing: easeInOutQuart });
  };
}

/** [data-reveal]: sube y se enfoca al entrar en pantalla. --i escalona los de una misma fila. */
function reveals(): void {
  const watcher = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove("reveal-pending");
      watcher.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -8% 0px" });
  for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
    const top = el.getBoundingClientRect().top;
    if (top <= innerHeight || !el.offsetParent) continue;
    el.classList.add("reveal-pending");
    watcher.observe(el);
  }
}

/** [data-words]: las palabras se encienden de a una a medida que el párrafo sube por la pantalla.
 * Solo opacidad: un filtro por palabra en cada cuadro trababa el scroll. */
function words(): void {
  for (const el of document.querySelectorAll<HTMLElement>("[data-words]")) {
    const parts = (el.textContent ?? "").split(/(\s+)/);
    el.replaceChildren(...parts.map(part => {
      if (!part.trim()) return part;
      const span = document.createElement("span");
      span.className = "w";
      span.textContent = part;
      return span;
    }));
    gsap.fromTo(el.querySelectorAll(".w"), { opacity: 0.16 }, {
      opacity: 1, ease: "none", stagger: 0.06,
      scrollTrigger: { trigger: el, start: "top 88%", end: "bottom 55%", scrub: 0.6 },
    });
  }
}

/** Hero: al bajar, la tarjeta se achica un poco y la imagen sube más despacio que el texto. */
function hero(): void {
  const section = document.querySelector<HTMLElement>("[data-hero]");
  const card = section?.querySelector<HTMLElement>(".hero-card");
  if (!section || !card) return;
  const trigger = { trigger: section, start: "top top", end: "bottom top", scrub: true };
  gsap.to(card, { scale: 0.94, ease: "none", scrollTrigger: trigger });
  const image = section.querySelector<HTMLElement>("[data-hero-img]");
  if (image) gsap.to(image, { yPercent: 8, ease: "none", scrollTrigger: trigger });
}

/** Proyectos: en escritorio la sección queda fija y las tarjetas pasan de derecha a izquierda con el scroll.
 * En pantallas chicas es una fila que se desliza con el dedo (CSS). */
function work(): void {
  const section = document.querySelector<HTMLElement>("[data-work]");
  const track = section?.querySelector<HTMLElement>("[data-work-track]");
  if (!section || !track) return;
  gsap.matchMedia().add("(min-width: 900px)", () => {
    section.classList.add("is-pinned");
    const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
    gsap.to(track, {
      x: () => -distance(), ease: "none",
      scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
    });
    return () => section.classList.remove("is-pinned");
  });
}
