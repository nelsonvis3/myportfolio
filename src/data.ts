export type Lang = "es" | "en";
export type Section = "about" | "projects" | "journey" | "contact";
export type ProjectId = "ragnar-suplementos" | "whodesk";
export type Route = { lang: Lang; section: Section; projectId?: ProjectId };
export type Project = {
  id: ProjectId;
  name: string;
  category: string;
  period: string;
  subtitle?: string;
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
      id: "whodesk", name: "Whodesk", category: "Proyecto personal · Help desk", period: "Nov 2026",
      subtitle: "Sistema de tickets de soporte con asistente de IA",
      development: "Aplicación de soporte estilo Freshdesk con roles, historial de auditoría, base de conocimiento y un asistente que responde con fuentes. Un único servicio Django sirve la API y el frontend.",
      problem: "Las consultas de soporte llegan dispersas y se pierde quién las atiende, en qué estado están y qué se respondió.",
      solution: "API REST en Django con tres roles (cliente, agente y administrador), máquina de estados, notas privadas e historial inmutable de cada cambio. Un asistente busca en la base de conocimiento y responde con fuentes, o se abstiene si no tiene información.",
      stack: [{label:"Python",icon:"python"},{label:"Django",icon:"django"},{label:"Django REST Framework",icon:"django"},{label:"PostgreSQL",icon:"postgresql"},{label:"Docker",icon:"docker"},{label:"GitHub Actions"},{label:"pytest",icon:"python"},{label:"HTML"},{label:"CSS"},{label:"JavaScript",icon:"javascript"}],
      image: "/img/whodesk.png", imageAlt: "Interfaz de Whodesk con la bandeja de tickets y el asistente de IA",
      repo: "https://github.com/nelsonvis3/Whodesk", demo: "https://helpdesk-ea50.onrender.com",
      details: [
        "Tres roles con permisos por objeto, máquina de estados y notas privadas; cada cambio y su auditoría se guardan juntos.",
        "Un servicio Django con reglas atómicas, PostgreSQL y frontend HTML/CSS/ES modules.",
        "El asistente responde con fuentes a clientes y sugiere respuestas a agentes. Solo consulta artículos públicos y notas de resolución; el código arma las fuentes y el LLM por API es opcional.",
        "Sesión con CSRF para el frontend y JWT para clientes externos. BM25 evita descargar modelos, pero no entiende paráfrasis.",
        "El umbral de abstención se calibró tras un criterio inicial con 64 % de falsas abstenciones.",
      ],
      status: "Demo pública en Render; tests con pytest y CI en GitHub Actions. Evaluación propia (30 preguntas: 22 respondibles y 8 sin respuesta; 10 fragmentos): Hit@1 95 %, Hit@3/4 100 %. Con umbral 2,5: 88 % de abstenciones correctas, 9 % falsas abstenciones y 86 % Top-1 correcto y respondido. Recuperación: mediana 0,01 ms, máximo 0,03 ms. Corpus pequeño; resultado inicial, no garantía.",
    },
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
      id: "whodesk", name: "Whodesk", category: "Personal project · Help desk", period: "Nov 2026",
      subtitle: "Support ticketing system with an AI assistant",
      development: "A Freshdesk-style support application with roles, an audit trail, a knowledge base, and an assistant that answers with sources. One Django service serves both the API and frontend.",
      problem: "Support requests arrive across separate channels, making it hard to see who owns each one, its current status, or what has already been answered.",
      solution: "A Django REST API with three roles (customer, agent, and administrator), a state machine, private notes, and an immutable history of every change. An assistant searches the knowledge base and answers with sources, or abstains when it lacks information.",
      stack: [{label:"Python",icon:"python"},{label:"Django",icon:"django"},{label:"Django REST Framework",icon:"django"},{label:"PostgreSQL",icon:"postgresql"},{label:"Docker",icon:"docker"},{label:"GitHub Actions"},{label:"pytest",icon:"python"},{label:"HTML"},{label:"CSS"},{label:"JavaScript",icon:"javascript"}],
      image: "/img/whodesk.png", imageAlt: "Whodesk interface showing the ticket inbox and AI assistant",
      repo: "https://github.com/nelsonvis3/Whodesk", demo: "https://helpdesk-ea50.onrender.com",
      details: [
        "Three roles with object-level permissions, a state machine, and private notes; each change and its audit event are saved together.",
        "One Django service with atomic rules, PostgreSQL, and an HTML/CSS/ES modules frontend.",
        "The assistant answers customers with sources and suggests replies for agents. It only uses public articles and resolution notes; application code assembles sources, with an optional LLM API.",
        "CSRF-protected sessions for the frontend and JWT for external clients. BM25 avoids model downloads but does not understand paraphrases.",
        "The abstention threshold was calibrated after an initial criterion produced 64% false abstentions.",
      ],
      status: "Public demo on Render; pytest tests and GitHub Actions CI. Evaluation (30 questions: 22 answerable, 8 unanswerable; 10 chunks): 95% Hit@1, 100% Hit@3/4. At threshold 2.5: 88% correct abstentions, 9% false abstentions, and 86% correct and answered top-1 responses. Retrieval: 0.01 ms median, 0.03 ms max. Small corpus; initial result, not a guarantee.",
    },
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
  const match = pathname.match(/^\/(?:en\/projects|proyectos)\/([^/]+)\/?$/);
  const projectId = match?.[1];
  return projectId && projects[lang].some(project => project.id === projectId)
    ? {lang,section:"projects",projectId:projectId as ProjectId}
    : {lang,section:"about"};
}
export function readBrowserRoute(pathname: string, hash: string): Route {
  const base = readRoute(pathname);
  if (base.projectId) return base;
  const section = hash.replace(/^#/, "");
  // Backward compatibility with links shared from the previous homepage.
  const oldProject = section.match(/^caso-(.+)$/);
  if (oldProject && projects[base.lang].some(project => project.id === oldProject[1]))
    return {...base,section:"projects",projectId:oldProject[1] as ProjectId};
  return ["about","projects","journey","contact"].includes(section)
    ? {...base,section:section as Section}
    : base;
}

export const copy = {
  es: {
    role: "Fullstack Junior",
    menu: { about:"Sobre mí", projects:"Proyectos", journey:"Formación", contact:"Contacto" },
    intro: "Soy Nelson, desarrollador Fullstack Junior con foco en backend. Desarrollo aplicaciones web de principio a fin: frontend, backend, modelado de datos y despliegue.",
    intro2: "Automatizo tareas repetitivas para simplificar el desarrollo y mantenimiento de mis proyectos.",
    location:"Formosa, Argentina", sidebarDescription:"Desarrollo aplicaciones web completas, desde la interfaz hasta la base de datos.", explore:"Ver proyectos", download:"Descargar CV", social:"Perfiles",
    projectsEyebrow:"PROYECTOS", projectsTitle:"Proyectos", projectsIntro:"Qué desarrollé, qué problema resolví y cómo lo hice.", open:"Ver proyecto", back:"Volver a proyectos", development:"Desarrollo", problem:"Problema", solution:"Solución", technologies:"Tecnologías", repository:"Ver código en GitHub", demo:"Ver demo", details:"Detalles técnicos", status:"Estado",
    journeyEyebrow:"FORMACIÓN", journeyTitle:"Estudios y certificaciones",
    studies:[
      {date:"Sep 2026 — actualidad",iso:"2026-09",name:"CS50's Web Programming with Python and JavaScript",info:"HarvardX / edX · En curso"},
      {date:"2023",iso:"2023",name:"Bachiller",info:"E. P. E. P. Nº 179 - Dr. Juan Bautista Alberdi, Formosa"}
    ],
    skillsTitle:"Stack técnico",
    contactEyebrow:"CONTACTO", contactTitle:"Trabajemos juntos.", contactIntro:"Estoy buscando mi primera oportunidad como desarrollador Fullstack Junior y proyectos freelance.", contactEmail:"Escribirme por correo", contactCv:"Descargar CV", contactGithub:"GitHub", contactLinkedin:"LinkedIn"
  },
  en: {
    role:"Junior Full Stack Developer",
    menu:{about:"About me",projects:"Projects",journey:"Education",contact:"Contact"},
    intro:"I'm Nelson, a Junior Full Stack Developer focused on backend development. I build web applications from start to finish: frontend, backend, data modeling, and deployment.",
    intro2:"I automate repetitive tasks to simplify the development and maintenance of my projects.",
    location:"Formosa, Argentina",sidebarDescription:"I build complete web applications, from the interface to the database.", explore:"View projects",download:"Download CV",social:"Profiles",
    projectsEyebrow:"PROJECTS", projectsTitle:"Projects", projectsIntro:"What I built, the problem it addressed, and how I solved it.",open:"View project",back:"Back to projects",development:"Development",problem:"Problem",solution:"Solution",technologies:"Technologies",repository:"View code on GitHub",demo:"View live demo",details:"Technical details",status:"Status",
    journeyEyebrow:"EDUCATION",journeyTitle:"Studies & certifications",
    studies:[
      {date:"Sep 2026 — present",iso:"2026-09",name:"CS50's Web Programming with Python and JavaScript",info:"HarvardX / edX · In progress"},
      {date:"2023",iso:"2023",name:"High School Diploma",info:"E. P. E. P. Nº 179 - Dr. Juan Bautista Alberdi, Formosa"}
    ],
    skillsTitle:"Technical stack",
    contactEyebrow:"CONTACT",contactTitle:"Let's work together.",contactIntro:"I'm looking for my first Junior Full Stack Developer role and freelance projects.",contactEmail:"Send an email",contactCv:"Download CV",contactGithub:"GitHub",contactLinkedin:"LinkedIn"
  }
} as const;
