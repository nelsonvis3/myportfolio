import type { Logo } from "../render/logos.js";

export type Lang = "es" | "en";

export interface Challenge { title: string; problem: string; solution: string; source: string; sourceUrl?: string }
export interface Part { name: string; detail: string }
// Íconos de línea propios (render/icons.ts) para las tarjetas de funciones.
export type Icon = "shield" | "users" | "file" | "coins" | "box" | "chart" | "cart" | "truck" | "card" | "layers" | "map" | "route" | "clock" | "printer" | "refresh";
export interface Card { icon: Icon; title: string; text: string }

export interface Project {
  id: string;            // también es el slug de la URL
  name: string;
  kind: string;
  tagline: string;
  summary: string;
  // images[0]: portada. images[1]: va con "La solución". phone: captura de celular (se muestra a tamaño de celular);
  // mobileSrc: recorte legible para pantallas chicas de una captura de escritorio.
  images: { src: string; alt: string; phone?: boolean; mobileSrc?: string }[];
  phoneShot: string;     // captura de celular que acompaña a la de escritorio en las portadas
  repo: string;
  demo: string;          // vacío: se muestra "Demo en preparación"
  demoLabel: string;
  video: string;         // video externo (presentación, recorrido); vacío si no hay
  videoLabel: string;
  stack: string[];
  role: string;
  highlights: string[];
  problem: string[];
  solution: string[];
  features: string[];
  cards: Card[];         // funciones en tarjetas para el caso de la home
  featuredCards: number[]; // 3 tarjetas destacadas en la home
  architecture: { text: string; parts: Part[] };
  flow: { title: string; steps: Part[] };
  challenges: Challenge[];
  decisions: Part[];
  verification: string;
}

export interface Content {
  lang: Lang;
  locale: string;
  meta: { title: string; description: string; ogAlt: string };
  ids: { projects: string; about: string; stack: string; contact: string };
  ui: {
    skip: string; menu: string; close: string; nav: { projects: string; about: string; stack: string; contact: string };
    switchLang: string; switchLangLabel: string; email: string;
    role: string; readCase: string; viewCode: string; demoSoon: string; backToTop: string;
    caseEyebrow: string; caseBack: string; caseStack: string; caseRole: string; caseProblem: string; caseSolution: string; caseFeatures: string;
    caseImageFull: string; caseBackHome: string;
    caseArchitecture: string; caseChallenges: string; caseDecisions: string; caseVerification: string;
    caseNext: string; caseProblemLabel: string; caseSolutionLabel: string; caseCode: string;
  };
  hero: { eyebrow: string; title: string[]; lines: string[]; note: string; primary: string; secondary: string };
  intro: { eyebrow: string; title: string[]; text: string };
  work: { eyebrow: string; title: string; lead: string; open: string };
  // Caso de estudio de la home: muestra un proyecto por vez; las tarjetas de proyectos y las pestañas lo cambian.
  cases: { eyebrow: string; tabsLabel: string; challengesTitle: string; full: string };
  about: { eyebrow: string; title: string; paragraphs: string[]; photoAlt: string; timelineTitle: string; timeline: Part[]; educationTitle: string; education: { name: string; detail: string; status: string }[]; nowTitle: string; now: string[] };
  stack: { eyebrow: string; title: string; lead: string; tools: { name: string; logo: Logo }[]; aiEyebrow: string; ai: { name: string; logo: Logo }[] };
  availability: { eyebrow: string; title: string; text: string; note: string; cv: string; cvOther: string };
  contact: {
    title: string; text: string; button: string; location: string;
    form: { subject: string; name: string; email: string; message: string; send: string; sending: string; sent: string; error: string };
  };
  footer: { line: string };
  projects: Project[];
}
