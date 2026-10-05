// Se compila a build/client.js y build.ts lo copia a dist/. Solo interacciones mínimas.
const menu = document.querySelector<HTMLButtonElement>("#menu");
const links = document.querySelector<HTMLUListElement>("#links");

menu?.addEventListener("click", () => {
  const open = links?.classList.toggle("open") ?? false;
  menu.setAttribute("aria-expanded", String(open));
});
links?.addEventListener("click", (e) => {
  if ((e.target as HTMLElement).tagName === "A") {
    links.classList.remove("open");
    menu?.setAttribute("aria-expanded", "false");
  }
});

// Indicador de sección activa
const anchors = [...document.querySelectorAll<HTMLAnchorElement>("#links a[data-s]")];
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) anchors.forEach((a) => a.classList.toggle("on", a.dataset.s === e.target.id));
    }
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
for (const a of anchors) {
  const el = document.getElementById(a.dataset.s ?? "");
  if (el) io.observe(el);
}

// Repos recientes desde la API pública de GitHub
interface Repo { name: string; html_url: string; language: string | null; pushed_at: string }
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

async function loadRepos(): Promise<void> {
  const box = document.getElementById("repos");
  if (!box) return;
  try {
    const res = await fetch("https://api.github.com/users/nelsonvis3/repos?sort=updated&per_page=4");
    if (!res.ok) return;
    const repos: Repo[] = await res.json();
    if (!repos.length) return;
    box.innerHTML = repos
      .map((r) => {
        const date = new Date(r.pushed_at).toLocaleDateString("es-AR", { month: "short", year: "numeric" });
        return `<a class="repo" href="${esc(r.html_url)}" target="_blank" rel="noopener"><b>${esc(r.name)}</b><span class="mono">${esc(r.language ?? "—")} · ${date}</span></a>`;
      })
      .join("");
  } catch {
    /* si falla, queda el repo estático */
  }
}
loadRepos();
