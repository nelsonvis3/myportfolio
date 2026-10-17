export type Lang = "es" | "en";

export interface Challenge { title: string; problem: string; solution: string; source: string }
export interface Part { name: string; detail: string }

export interface Project {
  id: string;            // también es el slug de la URL
  name: string;
  kind: string;
  tagline: string;
  summary: string;
  // images[0]: portada. images[1]: va con "La solución". phone: captura de celular (se muestra a tamaño de celular);
  // mobileSrc: recorte legible para pantallas chicas de una captura de escritorio.
  images: { src: string; alt: string; phone?: boolean; mobileSrc?: string }[];
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
  architecture: { text: string; parts: Part[] };
  flow: { title: string; steps: Part[] };
  challenges: Challenge[];
  decisions: Part[];
  status: { works: string; missing: string };
  learning: string;
}

export interface Content {
  lang: Lang;
  locale: string;
  meta: { title: string; description: string; ogAlt: string };
  ids: { projects: string; ai: string; about: string; contact: string };
  ui: {
    skip: string; menu: string; nav: { projects: string; ai: string; about: string; contact: string };
    switchLang: string; switchLangLabel: string; themeToDark: string; themeToLight: string;
    role: string; heroLine: string; viewProjects: string; downloadCv: string; heroMeta: string; scrollCue: string;
    carouselLabel: string; prev: string; next: string; openProject: string; carouselHint: string; countOf: string;
    detailLabel: string; backToCarousel: string; whatItDoes: string; myPart: string;
    readCase: string; viewCode: string; demoSoon: string; projectsTitle: string; brainAlt: string;
    caseBack: string; caseStack: string; caseRole: string; caseProblem: string; caseSolution: string; caseFeatures: string; caseImageFull: string; caseVideoFull: string;
    caseArchitecture: string; caseChallenges: string; caseDecisions: string; caseStatus: string; caseWorks: string;
    caseMissing: string; caseLearning: string; caseNext: string; caseProblemLabel: string; caseSolutionLabel: string; caseCode: string;
  };
  ai: { title: string; lead: string; cards: { name: string; text: string; uses: string[] }[]; ruleTitle: string; rule: string };
  about: { title: string; paragraphs: string[]; timelineTitle: string; timeline: Part[]; educationTitle: string; education: { name: string; detail: string; status: string }[]; nowTitle: string; now: string[]; cvEs: string; cvEn: string };
  stack: { title: string; lead: string; groups: { name: string; items: string[] }[] };
  contact: { title: string; text: string; emailLabel: string };
  projects: Project[];
}
