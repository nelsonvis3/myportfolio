// Decorative motion follows the existing tabs. Manual selection always wins.
export function mountPipelineMotion(root: HTMLElement, select: (index: number) => void): void {
  const rail = root.querySelector<HTMLElement>(".pipeline-nodes")!;
  const tabs = [...rail.querySelectorAll<HTMLButtonElement>("[data-tab]")];
  const panels = [...root.querySelectorAll<HTMLElement>("[data-panel]")];
  const svg = rail.querySelector<SVGSVGElement>(".pipeline-route")!;
  const track = svg.querySelector<SVGPathElement>(".route-track")!;
  const progress = svg.querySelector<SVGPathElement>(".route-progress")!;
  const particle = svg.querySelector<SVGCircleElement>(".route-particle")!;
  const controls = root.querySelector<HTMLElement>(".flow-playback")!;
  const toggle = root.querySelector<HTMLButtonElement>("[data-flow-toggle]")!;
  const label = root.querySelector<HTMLElement>("[data-flow-label]")!;
  const details = root.closest("details");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const dwell = 2600, travel = 1400, finish = 3200, reset = 500;
  let active = Math.max(0, tabs.findIndex(tab => tab.getAttribute("aria-selected") === "true"));
  let elapsed = 0, frame = 0, previous = 0, visible = false, userPaused = false, focused = false;
  let phase: "dwell" | "travel" | "reset" = "dwell";
  let lengths: number[] = [], total = 0;

  function paint(): void {
    if (!total) return;
    const fraction = phase === "travel" ? Math.min(1, elapsed / travel) : 0;
    const distance = phase === "travel" ? lengths[active] + (lengths[active + 1] - lengths[active]) * fraction : lengths[active];
    progress.style.strokeDasharray = `${distance} ${total}`;
    const point = track.getPointAtLength(distance);
    particle.setAttribute("cx", String(point.x)); particle.setAttribute("cy", String(point.y));
    svg.style.opacity = phase === "reset" ? String(1 - elapsed / reset) : "1";
    tabs.forEach((tab, index) => tab.classList.toggle("flow-visited", index < active));
    root.dataset.flowStage = String(active);
    root.dataset.flowPhase = phase;
  }

  function measure(): void {
    const bounds = rail.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const points = tabs.map(tab => {
      const icon = tab.querySelector(".pipeline-shape")!.getBoundingClientRect();
      return { x: icon.x + icon.width / 2 - bounds.x, y: icon.y + icon.height / 2 - bounds.y };
    });
    svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
    const path = points.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");
    track.setAttribute("d", path); progress.setAttribute("d", path);
    lengths = [0];
    for (let i = 1; i < points.length; i++) lengths.push(lengths[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
    total = lengths[lengths.length - 1];
    // Reserve the tallest panel so changing stages does not move the page.
    root.style.removeProperty("--flow-panel-height");
    let height = 0;
    for (const panel of panels) {
      const hidden = panel.hidden;
      panel.hidden = false;
      height = Math.max(height, panel.getBoundingClientRect().height);
      panel.hidden = hidden;
    }
    root.style.setProperty("--flow-panel-height", `${Math.ceil(height)}px`);
    root.classList.add("flow-motion-ready");
    paint();
  }

  function canRun(): boolean {
    return visible && (!details || details.open) && !document.hidden && !reduced.matches && !userPaused && !focused;
  }

  function sync(): void {
    const running = canRun();
    root.dataset.flowRunning = String(running);
    toggle.hidden = reduced.matches;
    toggle.textContent = userPaused ? "Reanudar recorrido ▷" : "Pausar recorrido Ⅱ";
    const state = reduced.matches ? "Movimiento reducido · navegación manual" : userPaused ? "Recorrido en pausa" : "Recorrido automático";
    label.textContent = `${state} · ${String(active + 1).padStart(2, "0")} / 05`;
    if (running && !frame) { previous = 0; frame = requestAnimationFrame(tick); }
    if (!running && frame) { cancelAnimationFrame(frame); frame = 0; previous = 0; }
  }

  function arrive(index: number): void {
    active = index; phase = "dwell"; elapsed = 0;
    select(active);
    if (!reduced.matches) panels[active].animate([{ opacity: .45, transform: "translateY(3px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 280, easing: "ease-out" });
    sync();
  }

  function tick(now: number): void {
    frame = 0;
    if (!canRun()) { sync(); return; }
    if (previous) elapsed += Math.min(now - previous, 64);
    previous = now;
    if (phase === "dwell" && elapsed >= (active === tabs.length - 1 ? finish : dwell)) {
      phase = active === tabs.length - 1 ? "reset" : "travel"; elapsed = 0;
    } else if (phase === "travel" && elapsed >= travel) arrive(active + 1);
    else if (phase === "reset" && elapsed >= reset) arrive(0);
    paint();
    // arrive() may schedule the next frame while updating the controls.
    if (!frame) frame = requestAnimationFrame(tick);
  }

  root.addEventListener("portfolio:tabchange", event => {
    const change = (event as CustomEvent<{ index: number; manual: boolean }>).detail;
    if (!change.manual) return;
    active = change.index; phase = "dwell"; elapsed = 0; userPaused = true;
    paint(); sync();
  });
  toggle.addEventListener("click", () => { userPaused = !userPaused; sync(); });
  root.addEventListener("focusin", () => { focused = rail.contains(document.activeElement) || panels.some(panel => panel.contains(document.activeElement)); sync(); });
  root.addEventListener("focusout", () => { queueMicrotask(() => { focused = rail.contains(document.activeElement) || panels.some(panel => panel.contains(document.activeElement)); sync(); }); });
  details?.addEventListener("toggle", () => { if (details.open) measure(); sync(); });
  document.addEventListener("visibilitychange", sync);
  reduced.addEventListener("change", () => { phase = "dwell"; elapsed = 0; paint(); sync(); });
  new ResizeObserver(measure).observe(rail);
  const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) measure(); sync(); }, { threshold: .2 });
  observer.observe(rail);
  controls.hidden = false;
  measure(); sync();
}

export function mountToolMotion(): void {
  const group = document.querySelector<HTMLElement>("[data-tool-motion]");
  if (!group) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false;
  const sync = () => { group.dataset.motionVisible = String(visible && !document.hidden && !reduced.matches); };
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .15 }).observe(group);
  document.addEventListener("visibilitychange", sync);
  reduced.addEventListener("change", sync);
  sync();
}
