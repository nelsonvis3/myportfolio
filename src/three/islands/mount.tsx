import { createRoot } from "react-dom/client";
import VariableProximity from "./reactbits/VariableProximity";
import TextType from "./reactbits/TextType";
import TextPressure from "./reactbits/TextPressure";

/** Monta los efectos de texto de React Bits sobre el HTML que ya existe.
 * El texto original queda para lectores de pantalla y para quien no carga JS. */
export function mountIslands(): void {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const fine = matchMedia("(pointer: fine)").matches;

  // Depende del puntero: en táctil queda el título estático. Se monta con el primer movimiento del mouse
  // porque reemplaza las letras del h1, y ese re-render al cargar pasaba a contar como el LCP de la página.
  const proximity = [...document.querySelectorAll<HTMLElement>('[data-island="proximity"]')];
  if (fine && proximity.length) addEventListener("pointermove", () => proximity.forEach(mountProximity), { once: true, passive: true });

  for (const el of document.querySelectorAll<HTMLElement>('[data-island="type"]')) {
    const texts = JSON.parse(el.dataset.texts ?? "[]") as string[];
    if (!texts.length) continue;
    createRoot(el).render(
      <TextType
        text={texts}
        prefix={el.dataset.prefix ?? ""}
        typingSpeed={38}
        deletingSpeed={22}
        pauseDuration={2200}
        cursorStyle="block"
        loop
        startOnVisible
      />,
    );
  }

  for (const el of document.querySelectorAll<HTMLElement>('[data-island="pressure"]')) {
    if (!fine) continue;
    const label = el.dataset.label ?? "";
    el.classList.add("is-pressure");
    const holder = document.createElement("span");
    holder.className = "pressure-holder";
    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = label;
    el.replaceChildren(sr, holder);
    createRoot(holder).render(
      <TextPressure text={label} fontFamily="Anybody Variable" fontUrl="" italic={false} flex={false} textColor="currentColor" minFontSize={48} />,
    );
  }
}

function mountProximity(el: HTMLElement): void {
  const label = el.dataset.label ?? el.textContent ?? "";
  createRoot(el).render(
    <VariableProximity
      label={label}
      className="proximity"
      fromFontVariationSettings="'wght' 760, 'wdth' 62"
      toFontVariationSettings="'wght' 900, 'wdth' 150"
      radius={190}
      falloff="gaussian"
      smoothing={0.25}
    />,
  );
}
