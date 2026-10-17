import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { createBrain, type BrainPoints } from "./brain";
import { Carousel, type ProjectInfo } from "./carousel";
import { EnergyGlyph } from "./energy";

/** Home 3D. Mejora progresiva: sin WebGL o con movimiento reducido, la página queda
 * en su versión 2D (hero con imagen y lista de proyectos), que ya está en el HTML. */

const root = document.documentElement;
const journeyEl = document.querySelector<HTMLElement>("[data-journey]");
const aiEl = document.querySelector<HTMLElement>("[data-ai]");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

function webglAvailable(): boolean {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

export async function start(): Promise<void> {
  if (!journeyEl || !aiEl || reduced || !webglAvailable()) return;
  const projects = JSON.parse(document.querySelector("#journey-data")?.textContent ?? "[]") as ProjectInfo[];
  if (!projects.length) return;

  const mobile = matchMedia("(max-width: 760px), (pointer: coarse)").matches;
  const canvas = document.createElement("canvas");
  canvas.className = "scene-canvas";
  canvas.setAttribute("aria-hidden", "true");
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: "high-performance" });
  } catch { return; }
  renderer.setClearColor(0x000000, 0);
  const pixelRatio = Math.min(devicePixelRatio || 1, mobile ? 1.5 : 1.75);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  const FOV = 35;
  const camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, 0.05, 80);

  let brain: BrainPoints;
  try { brain = await createBrain(mobile); } catch { renderer.dispose(); return; }
  brain.material.uniforms.uPixelRatio.value = pixelRatio;
  const brainGroup = new THREE.Group();
  brainGroup.add(brain.points);
  scene.add(brainGroup);

  // Sin reflejo en el piso en el celular: son el doble de paneles para dibujar.
  const carousel = new Carousel(projects, renderer.capabilities.getMaxAnisotropy(), !mobile);
  scene.add(carousel.group);

  await document.fonts.load("700 230px 'Martian Mono Variable'").catch(() => []);
  const glyphCount = mobile ? 3200 : 7000;
  const glyphs = [
    new EnergyGlyph(">_", glyphCount, 11, -1),
    new EnergyGlyph("</>", glyphCount, 23, 1),
  ];
  const energyGroup = new THREE.Group();
  glyphs.forEach(g => { g.material.uniforms.uPixelRatio.value = pixelRatio; energyGroup.add(g.points); });
  scene.add(energyGroup);

  // Tema: partículas blancas que suman luz sobre negro, o negras sobre blanco.
  function applyTheme(): void {
    const light = root.dataset.theme === "light";
    const ink = new THREE.Color(light ? "#000000" : "#ffffff");
    const soft = new THREE.Color(light ? "#1c1c1c" : "#8f8f8f");
    for (const material of [brain.material, ...glyphs.map(g => g.material)]) {
      material.uniforms.uColorA.value.copy(soft);
      material.uniforms.uColorB.value.copy(ink);
      material.uniforms.uLight.value = light ? 1 : 0;
      material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      material.needsUpdate = true;
    }
    carousel.setTheme(light);
  }
  applyTheme();
  document.addEventListener("themechange", applyTheme);

  // A partir de acá la página pasa a su versión 3D.
  document.body.prepend(canvas);
  root.classList.add("is-3d");

  // ---------- Layout ----------
  const HERO_Z = 6.5, INSIDE_Z = -1.0;
  const layout = { heroX: 0, heroY: 0, heroScale: 1, carouselZ: -7, carouselY: 0, viewDistance: 4, narrow: false, unitsPerPx: 0.01 };
  const heroCopy = document.querySelector<HTMLElement>("[data-hero]")!;
  const glyphSlot = document.querySelector<HTMLElement>("[data-ai-glyphs]");
  const halfAt = (distance: number) => {
    const h = distance * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    return { h, w: h * camera.aspect };
  };
  function resize(): void {
    // El canvas mide 100lvh: en mobile no cambia cuando aparece o se esconde la barra del navegador,
    // y el dibujo no se estira (antes usaba innerHeight, que sí cambia).
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    layout.narrow = camera.aspect < 0.9;
    const hero = halfAt(HERO_Z);
    layout.unitsPerPx = (hero.h * 2) / h;
    if (layout.narrow) {
      // Mobile: el cerebro ocupa el espacio libre entre el encabezado y el texto del hero.
      const header = document.querySelector<HTMLElement>(".header")?.offsetHeight ?? 72;
      const room = Math.max(60, heroCopy.offsetTop - header - 20);
      layout.heroX = 0; layout.heroY = hero.h - (header + 10 + room / 2) * layout.unitsPerPx;
      layout.heroScale = Math.min(hero.w * 0.78, (room / 2) * layout.unitsPerPx / 0.72);
    } else {
      layout.heroX = hero.w * 0.42; layout.heroY = -hero.h * 0.02;
      layout.heroScale = hero.h * 0.72;
    }
    // El panel del frente ocupa casi todo el ancho (o el alto, si la pantalla es angosta).
    const panelW = 2.4, panelH = panelW / 1.6;
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const fillW = layout.narrow ? 0.84 : 0.56, fillH = layout.narrow ? 0.36 : 0.56;
    const distance = Math.max(panelW / (fillW * 2 * tan * camera.aspect), panelH / (fillH * 2 * tan));
    const radius = layout.narrow ? 2.1 : 2.6;
    carousel.resize(panelW, panelH, radius);
    layout.viewDistance = distance;
    // Subir el panel para dejar lugar al título y los controles de abajo.
    layout.carouselY = distance * tan * (layout.narrow ? 0.2 : 0.12);
    layout.carouselZ = INSIDE_Z - distance - radius;
    // Símbolos de energía: arriba de las tarjetas.
    const ai = halfAt(HERO_Z);
    const glyphWidth = layout.narrow ? ai.w * 0.6 : ai.w * 0.34;
    glyphs.forEach((g, i) => {
      const side = i === 0 ? -1 : 1;
      // Desktop: a la derecha del título; mobile: uno al lado del otro, en su lugar dentro del texto (ver frame).
      if (layout.narrow) g.points.position.set(side * ai.w * 0.44, 0, 0);
      else g.points.position.set(ai.w * (side < 0 ? 0.22 : 0.64), ai.h * 0.3, 0);
      g.points.scale.setScalar(glyphWidth);
      g.material.uniforms.uSize.value = mobile ? 24 : 22;
    });
  }
  resize();
  void document.fonts.ready.then(resize);
  let lastWidth = innerWidth;
  addEventListener("resize", () => {
    resize();
    if (mobile && innerWidth === lastWidth) return;
    lastWidth = innerWidth;
    ScrollTrigger.refresh();
  });

  // ---------- Scroll ----------
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ autoRaf: false, lerp: 0.09 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const state = { p: 0, q: 0, zoom: 0 };
  gsap.to(state, { p: 1, ease: "none", scrollTrigger: { trigger: journeyEl, start: "top top", end: "bottom bottom", scrub: 0.9 } });
  gsap.to(state, { q: 1, ease: "none", scrollTrigger: { trigger: aiEl, start: "top 85%", end: () => layout.narrow ? "top -20%" : "top -60%", scrub: 0.9 } });

  // "Volver al inicio" del pie: con Lenis, para que el recorrido vuelva hacia atrás suave.
  document.addEventListener("scroll-to-top", event => { event.preventDefault(); lenis.scrollTo(0, { duration: 2.4 }); });

  // Posición de scroll donde el carrusel queda completo; la usan los links a #proyectos.
  const carouselScrollY = () => journeyEl.offsetTop + (journeyEl.offsetHeight - innerHeight) * 0.53;
  const anchorId = document.querySelector<HTMLElement>(".journey-anchor")?.id ?? "";
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
    const id = link.getAttribute("href")!.slice(1);
    if (id && id === anchorId) {
      link.addEventListener("click", event => { event.preventDefault(); lenis.scrollTo(carouselScrollY(), { duration: 2.2 }); history.replaceState(null, "", `#${id}`); });
      continue;
    }
    const target = id && id !== "main" ? document.getElementById(id) : null;
    if (target) link.addEventListener("click", event => { event.preventDefault(); lenis.scrollTo(target, { offset: -80 }); });
  }
  if (anchorId && location.hash === `#${anchorId}`) requestAnimationFrame(() => lenis.scrollTo(carouselScrollY(), { immediate: true }));

  // ---------- UI del hero y del carrusel ----------
  const cue = document.querySelector<HTMLElement>("[data-scroll-cue]")!;
  const stage = document.querySelector<HTMLElement>("[data-stage]")!;
  const ui = document.querySelector<HTMLElement>("[data-carousel-ui]")!;
  const nameEl = ui.querySelector<HTMLElement>("[data-carousel-name]")!;
  const subEl = ui.querySelector<HTMLElement>("[data-carousel-sub]")!;
  const countEl = ui.querySelector<HTMLElement>("[data-carousel-count]")!;
  const openButton = ui.querySelector<HTMLButtonElement>("[data-carousel-open]")!;
  const dialog = document.querySelector<HTMLDialogElement>("#project-detail")!;
  ui.inert = true;

  let rotTarget = 0, spin = 0, spinVel = 0, swirl = 0, brainSpin = 0, lastInteraction = -10, hovered = -1, front = 0, uiVisible = false;
  const AUTO_STEP = 6; // segundos que cada proyecto queda al frente antes de girar
  let lastAdvance = 0, lastScrollRotation = 0;
  const touch = () => { lastInteraction = performance.now() / 1000; };
  // El scroll avanza de a un proyecto, con pausas en las que cada panel queda centrado.
  const scrollRotation = () => {
    const s = smooth(0.5, 0.92, state.p) * (projects.length - 1);
    const whole = Math.min(Math.floor(s), projects.length - 2);
    return -(whole + smooth(0.25, 0.75, s - whole)) * carousel.step;
  };
  const goTo = (index: number) => { touch(); rotTarget += carousel.deltaTo(index, rotTarget + scrollRotation()); };

  ui.querySelector("[data-carousel-prev]")!.addEventListener("click", () => goTo((front - 1 + projects.length) % projects.length));
  ui.querySelector("[data-carousel-next]")!.addEventListener("click", () => goTo((front + 1) % projects.length));
  ui.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") { event.preventDefault(); goTo((front - 1 + projects.length) % projects.length); }
    if (event.key === "ArrowRight") { event.preventDefault(); goTo((front + 1) % projects.length); }
  });
  ui.addEventListener("focusin", touch);

  // Vista 2D del proyecto.
  const articles = [...dialog.querySelectorAll<HTMLElement>("[data-project-detail]")];
  function openDetail(index: number): void {
    goTo(index);
    lenis.stop();
    gsap.to(state, { zoom: 1, duration: 0.7, ease: "power3.inOut", onComplete: () => {
      articles.forEach(a => {
        a.hidden = a.dataset.projectDetail !== projects[index].id;
        const video = a.querySelector("video");
        if (video) { if (a.hidden) video.pause(); else void video.play().catch(() => {}); }
      });
      dialog.showModal();
      dialog.scrollTop = 0;
    } });
  }
  function closeDetail(): void { if (dialog.open) dialog.close(); }
  dialog.addEventListener("close", () => {
    dialog.querySelectorAll("video").forEach(v => v.pause());
    gsap.to(state, { zoom: 0, duration: 0.8, ease: "power3.out" });
    lenis.start(); touch(); openButton.focus({ preventScroll: true });
  });
  dialog.querySelector("[data-detail-close]")!.addEventListener("click", closeDetail);
  dialog.addEventListener("click", event => { if (event.target === dialog) closeDetail(); });
  openButton.addEventListener("click", () => openDetail(front));

  // Arrastre, hover y click sobre los paneles.
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(), parallax = new THREE.Vector2(), parallaxTarget = new THREE.Vector2();
  let dragging = false, dragStartX = 0, dragLastX = 0, dragMoved = 0, pointerInside = false;
  const pick = (clientX: number, clientY: number): number => {
    pointer.set((clientX / canvas.clientWidth) * 2 - 1, -(clientY / canvas.clientHeight) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(carousel.targets, false)[0];
    return hit ? (hit.object.userData.index as number) : -1;
  };
  stage.addEventListener("pointerdown", event => {
    if (!uiVisible || (event.target as Element).closest("button, a")) return;
    dragging = true; dragStartX = dragLastX = event.clientX; dragMoved = 0; touch();
  });
  addEventListener("pointermove", event => {
    parallaxTarget.set(event.clientX / innerWidth - 0.5, event.clientY / innerHeight - 0.5);
    if (dragging) {
      const dx = event.clientX - dragLastX; dragLastX = event.clientX;
      dragMoved = Math.max(dragMoved, Math.abs(event.clientX - dragStartX));
      rotTarget += (dx / innerWidth) * 2.6; touch();
    } else if (uiVisible && !mobile) {
      hovered = pick(event.clientX, event.clientY);
      pointerInside = hovered >= 0;
      stage.style.cursor = hovered >= 0 ? "pointer" : "grab";
    }
  });
  addEventListener("pointerup", event => {
    if (!dragging) return;
    dragging = false;
    if (dragMoved < 6) {
      const index = pick(event.clientX, event.clientY);
      if (index >= 0) { if (index === front) openDetail(index); else goTo(index); }
    }
  });

  // Tarjetas de IA con inclinación 3D según el puntero.
  if (!mobile) for (const card of document.querySelectorAll<HTMLElement>("[data-tilt]")) {
    card.addEventListener("pointermove", event => {
      const r = card.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - 0.5, y = (event.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`); card.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
      card.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`); card.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
    });
    card.addEventListener("pointerleave", () => { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
  }

  // ---------- Render ----------
  const timer = new THREE.Timer();
  let visible = true;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) (entry.target as HTMLElement).dataset.inView = String(entry.isIntersecting);
    visible = journeyEl.dataset.inView === "true" || aiEl.dataset.inView === "true";
    // También acá: si se llega directo más abajo (link a #contacto) el loop no corre y el encabezado quedaba transparente.
    const past = journeyEl.getBoundingClientRect().bottom <= innerHeight;
    document.body.classList.toggle("past-journey", past);
    if (past) document.body.classList.remove("nav-auto");
    canvas.classList.toggle("is-hidden", !visible);
    renderer.setAnimationLoop(visible && !document.hidden ? frame : null);
  });
  observer.observe(journeyEl); observer.observe(aiEl);
  document.addEventListener("visibilitychange", () => renderer.setAnimationLoop(visible && !document.hidden ? frame : null));

  function frame(): void {
    timer.update(); const dt = Math.min(timer.getDelta(), 0.05), time = timer.getElapsed();
    const p = state.p;
    const enter = smooth(0.03, 0.34, p);
    const expand = smooth(0.12, 0.36, p);
    const show = smooth(0.38, 0.5, p);
    const exit = smooth(0.94, 1, p);
    const inJourney = p < 0.999;
    document.body.classList.toggle("past-journey", !inJourney);
    document.body.classList.toggle("nav-auto", inJourney && p > 0.06);

    // Hero → interior del cerebro.
    const heroFade = 1 - smooth(0.02, 0.13, p);
    heroCopy.style.opacity = String(heroFade);
    heroCopy.style.transform = `translate3d(${-(1 - heroFade) * 60}px,0,0)`;
    heroCopy.inert = heroFade < 0.1;
    cue.style.opacity = String(1 - smooth(0.0, 0.05, p));

    // Giro del carrusel: automático, por scroll y por arrastre. Mientras el scroll lo está girando
    // (incluida la cola del scrub) no corre el automático, si no los dos giros se suman.
    const scrollTurn = scrollRotation();
    if (Math.abs(scrollTurn - lastScrollRotation) > 1e-4) touch();
    lastScrollRotation = scrollTurn;
    const idle = time - lastInteraction > 3.5 && !dragging && !pointerInside && !dialog.open;
    if (!idle || show < 0.9) lastAdvance = time;
    else if (time - lastAdvance > AUTO_STEP) { lastAdvance = time; rotTarget += carousel.deltaTo((front + 1) % projects.length, rotTarget + scrollRotation()); }
    // Giro con resorte: sigue al objetivo (scroll, flechas, arrastre y automático) y se asienta con un rebote leve.
    const K = 38, damping = 2 * Math.sqrt(K) * 0.7;
    spinVel += ((rotTarget + scrollTurn - spin) * K - spinVel * damping) * dt;
    spin += spinVel * dt;
    const rotation = spin;
    const newFront = carousel.frontIndex(rotation);
    if (newFront !== front) {
      front = newFront;
      nameEl.textContent = projects[front].name; subEl.textContent = projects[front].sub;
      countEl.textContent = (ui.dataset.count ?? "{n} / {total}").replace("{n}", String(front + 1)).replace("{total}", String(projects.length));
    }
    const shouldShowUi = show > 0.85 && exit < 0.5 && inJourney;
    if (shouldShowUi !== uiVisible) {
      uiVisible = shouldShowUi; ui.classList.toggle("is-visible", uiVisible); ui.inert = !uiVisible;
      stage.classList.toggle("is-carousel", uiVisible);
      if (!uiVisible) { hovered = -1; pointerInside = false; stage.style.cursor = ""; }
    }

    parallax.lerp(parallaxTarget, 0.05);
    if (inJourney) {
      const z = mix(HERO_Z, INSIDE_Z, enter) - state.zoom * layout.viewDistance * 0.35;
      camera.position.set(parallax.x * 0.25 * (1 - enter), -parallax.y * 0.18 * (1 - enter), z);
      camera.lookAt(camera.position.x * 0.4, camera.position.y * 0.4, z - 10);
    } else {
      camera.position.set(parallax.x * 0.2, -parallax.y * 0.15, HERO_Z);
      camera.lookAt(0, 0, 0);
    }

    brainGroup.position.set(mix(layout.heroX, 0, enter), mix(layout.heroY, 0, enter), 0);
    brainGroup.scale.setScalar(mix(layout.heroScale, 1.25, enter));
    // Los giros se acumulan y se escalan por la transición, así el cerebro vuelve derecho al hero y el túnel
    // queda alineado. Se normalizan solo cuando una vuelta entera no se nota, y se deshacen por el camino corto.
    brainSpin += 0.12 * (1 - expand) * dt;
    if (expand < 0.001) brainSpin = wrapAngle(brainSpin);
    brainGroup.rotation.y = brainSpin * (1 - expand) - 0.35;
    // El túnel de partículas gira con el carrusel: da sensación de velocidad.
    swirl += (0.02 * expand + spinVel * 0.45 * show) * dt;
    if (expand > 0.999) swirl = wrapAngle(swirl);
    else if (expand < 0.001) swirl = 0;
    brainGroup.rotation.z = swirl * expand;
    const u = brain.material.uniforms;
    u.uTime.value = time; u.uExpand.value = expand;
    u.uOpacity.value = inJourney ? (1 - exit) * mix(1, 0.75, show) : 0;
    brain.points.visible = inJourney;

    carousel.group.position.set(0, layout.carouselY, layout.carouselZ);
    // Los paneles se arman desde las partículas al entrar y se deshacen al salir.
    carousel.update(rotation, spinVel, show * (1 - exit), smooth(0.37, 0.49, p) * (1 - exit), hovered, time);
    // Durante el giro la lente se abre un poco.
    const fov = FOV + Math.min(7, Math.abs(spinVel) * 2.4) * show;
    if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
    carousel.group.visible = show > 0.001 && inJourney;

    // Sección de IA.
    const form = smooth(0.0, 0.75, state.q);
    energyGroup.visible = !inJourney;
    // Mobile: la sección no queda fija, así que los símbolos siguen su lugar en el texto en vez de taparlo.
    if (layout.narrow && glyphSlot) {
      const slot = glyphSlot.getBoundingClientRect();
      energyGroup.position.y = halfAt(HERO_Z).h - (slot.top + slot.height / 2) * layout.unitsPerPx;
    } else energyGroup.position.y = smooth(0.8, 1, state.q) * 0.15;
    aiEl!.style.setProperty("--reveal", layout.narrow ? "1" : smooth(0.5, 0.85, state.q).toFixed(3));
    glyphs.forEach(g => {
      g.material.uniforms.uTime.value = time;
      g.material.uniforms.uForm.value = form;
      g.material.uniforms.uOpacity.value = smooth(0.0, 0.2, state.q);
    });

    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(frame);
  ScrollTrigger.refresh();
}

