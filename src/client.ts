// Todas las páginas: menú mobile y cambio de tema claro/oscuro.
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
