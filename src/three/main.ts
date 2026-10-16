// Entrada de la home. El HTML ya trae la versión 2D completa; la escena 3D (three.js, GSAP, Lenis) y los
// efectos de texto (React Bits) se cargan con import() después del primer pintado, para que su código no
// demore el render del hero. Sin WebGL o con movimiento reducido, scene.ts no hace nada y queda el 2D.

const root = document.documentElement;
const whenIdle = (fn: () => void) => ("requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 150));

function boot(): void {
  void import("./islands/mount").then(m => m.mountIslands());
  void import("./scene")
    .then(m => m.start())
    .catch(() => { root.classList.remove("is-3d"); document.querySelector(".scene-canvas")?.remove(); });
}

if (document.readyState === "complete") whenIdle(boot);
else addEventListener("load", () => whenIdle(boot), { once: true });
