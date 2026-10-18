import type { Content, Lang } from "./types.js";
import { es } from "./es.js";
import { en } from "./en.js";

export const content: Record<Lang, Content> = { es, en };
export const langs: Lang[] = ["es", "en"];

export const socials = {
  website: "https://nelsonvis-portfolio.vercel.app",
  github: "https://github.com/nelsonvis3",
  linkedin: "https://www.linkedin.com/in/nelson-sivisstum-4777a32b4",
  email: "nelsonsivisstum3@gmail.com",
  cv: { es: "/cv.pdf", en: "/cv-en.pdf" },
} as const;

// Formulario de contacto: Web3Forms reenvía cada mensaje al correo registrado con la clave. La clave es pública
// (va en el HTML) y se pide gratis en web3forms.com. Vacía, el contacto queda solo con el botón de correo.
export const contactForm = { endpoint: "https://api.web3forms.com/submit", accessKey: "" } as const;

// Dominio público; SITE_URL permite compilar para otro dominio.
const configuredUrl = process.env.SITE_URL?.trim() || socials.website;
if (!/^https?:\/\//.test(configuredUrl)) throw new Error("SITE_URL debe ser una URL absoluta http(s).");
export const siteUrl = new URL(configuredUrl).origin;

export const homePath = (lang: Lang) => (lang === "es" ? "/" : "/en/");
export const casePath = (lang: Lang, id: string) => (lang === "es" ? `/proyectos/${id}/` : `/en/projects/${id}/`);
export const other = (lang: Lang): Lang => (lang === "es" ? "en" : "es");
