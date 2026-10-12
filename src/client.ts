// Progressive enhancement: all content and links exist in the generated HTML.
document.body.classList.add("js");
const menu = document.querySelector<HTMLButtonElement>("#menu");
const navigation = document.querySelector<HTMLUListElement>("#nav-links");
const mainNav = document.querySelector<HTMLElement>(".main-nav");
mainNav?.classList.add("enhanced");
function closeMenu(restoreFocus = false): void {
  navigation?.classList.remove("open");
  menu?.setAttribute("aria-expanded", "false");
  if (restoreFocus) menu?.focus();
}
menu?.addEventListener("click", () => {
  const open = navigation?.classList.toggle("open") ?? false;
  menu.setAttribute("aria-expanded", String(open));
});
navigation?.addEventListener("click", event => {
  if ((event.target as Element).closest("a")) closeMenu();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && menu?.getAttribute("aria-expanded") === "true") closeMenu(true);
});
document.addEventListener("click", event => {
  if (!mainNav?.contains(event.target as Node)) closeMenu();
});
matchMedia("(min-width: 601px)").addEventListener("change", () => closeMenu());

// Automatic activation, arrow keys, Home/End, and native buttons for keyboard access.
for (const container of document.querySelectorAll<HTMLElement>("[data-tabs]")) {
  const tabs = [...container.querySelectorAll<HTMLButtonElement>("[data-tab]")];
  const panels = [...container.querySelectorAll<HTMLElement>("[data-panel]")];
  const tablist = container.querySelector("[data-tablist]");
  tablist?.setAttribute("role", "tablist");
  const narrow = matchMedia("(max-width: 600px)");
  const orient = () => tablist?.setAttribute("aria-orientation", tablist.hasAttribute("data-vertical-mobile") && narrow.matches ? "vertical" : "horizontal");
  orient(); narrow.addEventListener("change", orient);
  function select(index: number, focus = false): void {
    tabs.forEach((tab, i) => {
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].setAttribute("role", "tabpanel");
      panels[i].tabIndex = 0;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index]?.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index));
    tab.addEventListener("keydown", event => {
      const keys: Record<string, number> = {
        ArrowRight: (index + 1) % tabs.length,
        ArrowLeft: (index + tabs.length - 1) % tabs.length,
        ...(container.querySelector("[data-vertical-mobile]") && matchMedia("(max-width: 600px)").matches ? { ArrowDown: (index + 1) % tabs.length, ArrowUp: (index + tabs.length - 1) % tabs.length } : {}),
        Home: 0, End: tabs.length - 1,
      };
      if (event.key in keys) {
        event.preventDefault();
        select(keys[event.key], true);
      }
    });
  });
  container.classList.add("enhanced");
  select(Number(container.dataset.initial ?? 0));
}

const tenantExplanations: Record<string, string> = {
  a: "Empresa A: el rol owner puede operar sobre sus datos. Los datos de B quedan fuera de esta consulta.",
  b: "Empresa B: el rol viewer puede consultar sus datos, pero no modificarlos. Los datos de A quedan fuera de esta consulta.",
};
for (const demo of document.querySelectorAll<HTMLElement>("[data-tenant-demo]")) {
  const controls = [...demo.querySelectorAll<HTMLButtonElement>("[data-tenant]")];
  controls.forEach(button => button.addEventListener("click", () => {
    const tenant = button.dataset.tenant ?? "a";
    controls.forEach(control => control.setAttribute("aria-pressed", String(control === button)));
    demo.querySelectorAll<HTMLElement>("[data-store]").forEach(store => store.classList.toggle("selected", store.dataset.store === tenant));
    const explanation = demo.querySelector("[data-tenant-explanation]");
    if (explanation) explanation.textContent = tenantExplanations[tenant];
  }));
}

// Real screenshots use ordinary file links when JS or dialog support is absent.
const viewer = document.querySelector<HTMLDialogElement>("#image-viewer");
const viewerImage = document.querySelector<HTMLImageElement>("#viewer-image");
const viewerCaption = document.querySelector<HTMLElement>("#viewer-caption");
let imageTrigger: HTMLAnchorElement | null = null;
for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-lightbox]")) {
  link.addEventListener("click", event => {
    if (!viewer?.showModal || !viewerImage || !viewerCaption || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    imageTrigger = link;
    viewerImage.src = link.href;
    viewerImage.alt = link.querySelector("img")?.alt ?? "Captura del proyecto";
    viewerCaption.textContent = link.dataset.caption ?? "Captura real de la aplicación";
    viewer.showModal();
  });
}
viewer?.querySelector("button")?.addEventListener("click", () => viewer.close());
viewer?.addEventListener("click", event => {
  if (event.target === viewer) {
    const rect = viewer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
  }
});
viewer?.addEventListener("close", () => imageTrigger?.focus());

if ("IntersectionObserver" in window) {
  const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>("[data-section], .case-index nav a")];
  const sections = sectionLinks.map(anchor => ({ anchor, element: document.getElementById(anchor.hash.slice(1)) }));
  const activeSection = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      sections.forEach(({ anchor, element }) => {
        if (element === entry.target) anchor.setAttribute("aria-current", "location");
        else anchor.removeAttribute("aria-current");
      });
    }
  }, { rootMargin: "-15% 0px -65% 0px" });
  sections.forEach(({ element }) => { if (element) activeSection.observe(element); });
  const hero = document.querySelector("#inicio");
  if (hero) activeSection.observe(hero);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".work-heading, .engineering-grid, .automation-intro, .about-lead, .stack-intro, .project-copy, .panorama-caption").forEach(element => reveal.observe(element));
  }
}

// Progressive visual enhancements are exclusive to the homepage.
if (document.querySelector("[data-brain]")) {
  const enhance = () => {
    void import("./visual/brain.js").then(({ mountSkillBrain }) => mountSkillBrain(document.querySelector<HTMLElement>("[data-brain]")!)).catch(() => {});
    void import("./visual/projects.js").then(({ mountProjectDepth }) => mountProjectDepth()).catch(() => {});
  };
  if (document.readyState === "complete") enhance();
  else window.addEventListener("load", enhance, { once: true });
}
