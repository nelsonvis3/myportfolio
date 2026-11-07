export type Lang = "es" | "en";
export type Section = "about" | "projects" | "journey" | "contact";
export type ProjectId = "ragnar-suplementos";
export type Route = { lang: Lang; section: Section; projectId?: ProjectId };
export type Project = {
  id: ProjectId;
  name: string;
  category: string;
  period: string;
  development: string;
  problem: string;
  solution: string;
  stack: { label: string; icon?: string }[];
  image: string;
  imageAlt: string;
  repo: string;
  demo?: string;
  details?: string[];
  status?: string;
};

export const links = {
  github: "https://github.com/nelsonvis3",
  linkedin: "https://www.linkedin.com/in/nelsonsivisstum1/",
  email: "nelsonsivisstum3@gmail.com",
  cv: { es: "/cv.pdf", en: "/cv-en.pdf" }
} as const;

const projects: Record<Lang, Project[]> = {
  es: [
    {
      id: "ragnar-suplementos", name: "Ragnar Suplementos", category: "Cliente · E-commerce", period: "Ago 2026 – Sep 2026",
      development: "Desarrollé una tienda online con catálogo, combos, carrito, pedidos y un panel para gestionar productos, imágenes, precios y stock.",
      problem: "El cliente necesitaba administrar su catálogo sin depender de un desarrollador y evitar inconsistencias de inventario al recibir compras.",
      solution: "Implementé la tienda con Next.js y una API Django. El panel protegido permite actualizar el catálogo y el backend valida precios, disponibilidad y reservas de stock. Preparé una demostración con Docker Compose y Nginx en Ubuntu Server.",
      stack: [{label:"Next.js",icon:"nextjs"},{label:"React",icon:"react"},{label:"TypeScript",icon:"typescript"},{label:"Django",icon:"django"},{label:"PostgreSQL",icon:"postgresql"},{label:"Docker",icon:"docker"},{label:"Nginx"}],
      image: "/img/ragnar.webp", imageAlt: "Página de Ragnar Suplementos",
      repo: "https://github.com/nelsonvis3/ragnarsuplementosfsa",
      details: [
        "El backend recalcula precios y totales desde la base de datos; el navegador no define los importes.",
        "Los combos descuentan stock de los productos que los componen, y el bloqueo de filas evita que dos compras simultáneas reserven la última unidad.",
        "Los pagos con Mercado Pago se confirman en el servidor: se valida la firma del webhook y se consulta el pago antes de aprobar el pedido.",
        "Un panel protegido permite al comercio gestionar productos, combos, imágenes, precios y pedidos."
      ],
      status: "Encargo de un comercio local. Pre-lanzamiento: probada en entorno local."
    }
  ],
  en: [
    {
      id: "ragnar-suplementos", name: "Ragnar Suplementos", category: "Client project · E-commerce", period: "Aug 2026 – Sep 2026",
      development: "I developed an online store with products, bundles, a shopping cart, orders, and a dashboard to manage catalog images, prices, and stock.",
      problem: "The client needed to manage the catalog without developer assistance while keeping inventory accurate when customers placed orders.",
      solution: "I built the storefront with Next.js and a Django API. A protected dashboard controls the catalog, while the backend validates prices, availability, and stock reservations. I also deployed a demo with Docker Compose and Nginx on Ubuntu Server.",
      stack: [{label:"Next.js",icon:"nextjs"},{label:"React",icon:"react"},{label:"TypeScript",icon:"typescript"},{label:"Django",icon:"django"},{label:"PostgreSQL",icon:"postgresql"},{label:"Docker",icon:"docker"},{label:"Nginx"}],
      image: "/img/ragnar.webp", imageAlt: "Ragnar Suplementos storefront",
      repo: "https://github.com/nelsonvis3/ragnarsuplementosfsa",
      details: [
        "The backend recalculates prices and totals from the database; the browser never sets the amounts.",
        "Bundles consume stock from their component products, and row locks stop two simultaneous purchases from reserving the last unit.",
        "Mercado Pago payments are confirmed on the server: the webhook signature is validated and the payment is checked before the order is approved.",
        "A protected dashboard lets the business manage products, bundles, images, prices, and orders."
      ],
      status: "Built for a local business. Pre-launch: tested locally."
    },
  ]
};

export const getProjects = (lang: Lang) => projects[lang];
export function caseUrl(lang: Lang, id: ProjectId) {
  return lang === "es" ? `/proyectos/${id}/` : `/en/projects/${id}/`;
}
export function sectionUrl(lang: Lang, section: Section) {
  const prefix = lang === "es" ? "/" : "/en/";
  return section === "about" ? prefix : `${prefix}#${section}`;
}
export function readRoute(pathname: string): Route {
  const lang: Lang = /^\/en(?:\/|$)/.test(pathname) ? "en" : "es";
  const match = pathname.match(/^\/(?:en\/projects|proyectos)\/(ragnar-suplementos)\/?$/);
  return match ? {lang,section:"projects",projectId:match[1] as ProjectId} : {lang,section:"about"};
}
export function readBrowserRoute(pathname: string, hash: string): Route {
  const base = readRoute(pathname);
  if (base.projectId) return base;
  const section = hash.replace(/^#/, "");
  // Backward compatibility with links shared from the previous homepage.
  const oldProject = section.match(/^caso-(ragnar-suplementos)$/);
  if (oldProject) return {...base,section:"projects",projectId:oldProject[1] as ProjectId};
  return ["about","projects","journey","contact"].includes(section)
    ? {...base,section:section as Section}
    : base;
}

export const copy = {
  es: {
    role: "Desarrollador Backend Junior",
    menu: { about:"Sobre mí", projects:"Proyectos", journey:"Formación", contact:"Contacto" },
    kicker: "SOBRE MÍ", heading: "Backends donde los datos se mantienen correctos",
    intro: "Aprendí desarrollo web por mi cuenta y lo fui aplicando en proyectos cada vez más completos.",
    intro2: "Me interesa lo que pasa detrás de la interfaz: cómo se guardan los datos, quién puede hacer qué y qué ocurre cuando algo falla. Con Django REST Framework y PostgreSQL trabajo permisos por rol y concurrencia, y me gusta escribir código fácil de mantener.",
    intro3: "Busco mi primera oportunidad en un equipo donde aportar, aprender de otros desarrolladores y seguir creciendo.",
    location:"Formosa, Argentina", sidebarDescription:"Desarrollo aplicaciones web completas, desde la interfaz hasta la base de datos.", explore:"Ver proyectos", download:"Descargar CV", social:"Perfiles",
    projectsEyebrow:"PROYECTOS", projectsTitle:"Proyecto destacado", projectsIntro:"Qué desarrollé, qué problema resolví y cómo lo hice.", open:"Ver proyecto", back:"Volver a proyectos", development:"Desarrollo", problem:"Problema", solution:"Solución", technologies:"Tecnologías", repository:"Ver código en GitHub", demo:"Ver demo", details:"Detalles técnicos", status:"Estado",
    journeyEyebrow:"FORMACIÓN", journeyTitle:"Estudios y certificaciones",
    studies:[
      {date:"Sep 2026 — actualidad",iso:"2026-09",name:"CS50's Web Programming with Python and JavaScript",info:"HarvardX / edX · En curso"},
      {date:"2023",iso:"2023",name:"Bachiller",info:"E. P. E. P. Nº 179 - Dr. Juan Bautista Alberdi, Formosa"}
    ],
    skillsTitle:"Stack técnico",
    contactEyebrow:"CONTACTO", contactTitle:"Trabajemos juntos.", contactIntro:"Estoy disponible para mi primera oportunidad como desarrollador Backend Junior y para proyectos freelance.", contactEmail:"Escribirme por correo", contactCv:"Descargar CV", contactGithub:"GitHub", contactLinkedin:"LinkedIn"
  },
  en: {
    role:"Junior Backend Developer",
    menu:{about:"About me",projects:"Projects",journey:"Education",contact:"Contact"},
    kicker:"ABOUT ME",heading:"Backends where data stays correct",
    intro:"I learned web development on my own and applied it to increasingly complex projects.",
    intro2:"I'm interested in what happens behind the interface: how data is stored, who can do what, and what happens when something fails. With Django REST Framework and PostgreSQL I work on role-based permissions and concurrency, and I like writing maintainable code.",
    intro3:"I'm looking for my first opportunity on a team where I can contribute, learn from other developers, and keep growing.",
    location:"Formosa, Argentina",sidebarDescription:"I build complete web applications, from the interface to the database.", explore:"View projects",download:"Download CV",social:"Profiles",
    projectsEyebrow:"PROJECTS", projectsTitle:"Featured project", projectsIntro:"What I built, the problem it addressed, and how I solved it.",open:"View project",back:"Back to projects",development:"Development",problem:"Problem",solution:"Solution",technologies:"Technologies",repository:"View code on GitHub",demo:"View live demo",details:"Technical details",status:"Status",
    journeyEyebrow:"EDUCATION",journeyTitle:"Studies & certifications",
    studies:[
      {date:"Sep 2026 — present",iso:"2026-09",name:"CS50's Web Programming with Python and JavaScript",info:"HarvardX / edX · In progress"},
      {date:"2023",iso:"2023",name:"High School Diploma",info:"E. P. E. P. Nº 179 - Dr. Juan Bautista Alberdi, Formosa"}
    ],
    skillsTitle:"Technical stack",
    contactEyebrow:"CONTACT",contactTitle:"Let's work together.",contactIntro:"I'm open to my first Junior Backend Developer role and to freelance projects.",contactEmail:"Send an email",contactCv:"Download CV",contactGithub:"GitHub",contactLinkedin:"LinkedIn"
  }
} as const;
