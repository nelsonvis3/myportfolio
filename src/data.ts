export type Lang = "es" | "en";
export type Section = "about" | "projects" | "journey" | "contact";
export type ProjectId = "fracxion" | "ragnar-suplementos" | "roadledger";
export type Route = { lang: Lang; section: Section; projectId?: ProjectId };
export type Project = {
  id: ProjectId;
  name: string;
  category: string;
  development: string;
  problem: string;
  solution: string;
  stack: { label: string; icon?: string }[];
  image: string;
  imageAlt: string;
  repo: string;
  details?: string[];
  status?: string;
};

export const links = {
  github: "https://github.com/nelsonvis3",
  linkedin: "https://www.linkedin.com/in/nelson-sivisstum-4777a32b4/",
  email: "nelsonsivisstum3@gmail.com",
  cv: { es: "/cv.pdf", en: "/cv-en.pdf" }
} as const;

const projects: Record<Lang, Project[]> = {
  es: [
    {
      id: "fracxion", name: "Fracxion", category: "SaaS · Gestión comercial",
      development: "Desarrollé un sistema full stack para administrar clientes, productos, facturas internas, cobros e inventario de varias empresas.",
      problem: "Cada empresa necesitaba trabajar con sus propios datos y permisos, sin duplicar comprobantes ni perder el historial de operaciones.",
      solution: "Construí la interfaz en Next.js y una API en Django REST Framework. Implementé aislamiento por empresa, permisos por rol, operaciones transaccionales y restricciones en PostgreSQL para mantener la integridad de los datos.",
      stack: [{label:"Next.js",icon:"nextjs"},{label:"TypeScript",icon:"typescript"},{label:"Django REST",icon:"django"},{label:"PostgreSQL",icon:"postgresql"},{label:"Docker",icon:"docker"}],
      image: "/img/fracxion-overview.png", imageAlt: "Panel principal de Fracxion",
      repo: "https://github.com/nelsonvis3/fracxion-facturador",
      details: [
        "Cada consulta se filtra en el backend según la empresa activa y el rol del usuario.",
        "La emisión de facturas y los cobros usan transacciones y bloqueo de filas en PostgreSQL para evitar números repetidos y cobros mayores al saldo.",
        "Los totales se calculan en el servidor con los precios del catálogo, no con los valores que envía el navegador.",
        "Pruebas de permisos y concurrencia en Django, y flujos de navegador con Playwright, ejecutados en GitHub Actions."
      ],
      status: "Proyecto propio. Se ejecuta en local con Docker Compose."
    },
    {
      id: "ragnar-suplementos", name: "Ragnar Suplementos", category: "Cliente · E-commerce",
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
      status: "Encargo de un comercio local. Está probada en entorno local y todavía no se publicó."
    },
    {
      id: "roadledger", name: "RoadLedger", category: "Proyecto personal · Planificador de rutas",
      development: "Creé un prototipo para planificar viajes en camión, con rutas en el mapa, cronología de paradas y registros diarios imprimibles.",
      problem: "Una ruta geográfica no alcanza para planificar un viaje: también hay que considerar tiempos de conducción, descansos y eventos del recorrido.",
      solution: "Integré React y MapLibre con una API Django REST Framework. El servidor obtiene coordenadas y rutas, calcula una planificación estimada y divide los eventos en registros diarios. Es un prototipo educativo, no un ELD certificado.",
      stack: [{label:"React",icon:"react"},{label:"Python",icon:"python"},{label:"Django REST",icon:"django"},{label:"MapLibre"},{label:"OSRM"}],
      image: "/img/roadledger.webp", imageAlt: "Plan de viaje en RoadLedger",
      repo: "https://github.com/nelsonvis3/ELD-trip-planner"
    }
  ],
  en: [
    {
      id: "fracxion", name: "Fracxion", category: "SaaS · Business management",
      development: "I built a full-stack system to manage customers, products, internal invoices, payments, and inventory for multiple companies.",
      problem: "Each company needed its own data and access permissions, with reliable invoice numbering and auditable transactions.",
      solution: "I developed a Next.js interface and a Django REST Framework API, implementing tenant isolation, role-based permissions, database transactions, and PostgreSQL constraints to protect data integrity.",
      stack: [{label:"Next.js",icon:"nextjs"},{label:"TypeScript",icon:"typescript"},{label:"Django REST",icon:"django"},{label:"PostgreSQL",icon:"postgresql"},{label:"Docker",icon:"docker"}],
      image: "/img/fracxion-overview.png", imageAlt: "Fracxion business management dashboard",
      repo: "https://github.com/nelsonvis3/fracxion-facturador",
      details: [
        "Every query is filtered on the backend by the active company and the user's role.",
        "Issuing invoices and recording payments use PostgreSQL transactions and row locks to prevent duplicate numbers and payments above the balance.",
        "Totals are calculated on the server from catalog prices, not from values sent by the browser.",
        "Permission and concurrency tests in Django, plus Playwright browser flows, run on GitHub Actions."
      ],
      status: "Personal project. Runs locally with Docker Compose."
    },
    {
      id: "ragnar-suplementos", name: "Ragnar Suplementos", category: "Client project · E-commerce",
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
      status: "Built for a local business. Tested locally and not yet launched."
    },
    {
      id: "roadledger", name: "RoadLedger", category: "Personal project · Route planning",
      development: "I built a truck trip-planning prototype with route maps, a timeline of stops, and printable daily logs.",
      problem: "A route on a map alone cannot account for driving hours, rest periods, and other events needed to plan a trip.",
      solution: "I integrated React and MapLibre with a Django REST Framework API. The backend geocodes locations, calculates routes and estimated schedules, and splits events into daily logs. This is an educational prototype, not a certified ELD.",
      stack: [{label:"React",icon:"react"},{label:"Python",icon:"python"},{label:"Django REST",icon:"django"},{label:"MapLibre"},{label:"OSRM"}],
      image: "/img/roadledger.webp", imageAlt: "RoadLedger trip planning map",
      repo: "https://github.com/nelsonvis3/ELD-trip-planner"
    }
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
  const match = pathname.match(/^\/(?:en\/projects|proyectos)\/(fracxion|ragnar-suplementos|roadledger)\/?$/);
  return match ? {lang,section:"projects",projectId:match[1] as ProjectId} : {lang,section:"about"};
}
export function readBrowserRoute(pathname: string, hash: string): Route {
  const base = readRoute(pathname);
  if (base.projectId) return base;
  const section = hash.replace(/^#/, "");
  // Backward compatibility with links shared from the previous homepage.
  const oldProject = section.match(/^caso-(fracxion|ragnar-suplementos|roadledger)$/);
  if (oldProject) return {...base,section:"projects",projectId:oldProject[1] as ProjectId};
  return ["about","projects","journey","contact"].includes(section)
    ? {...base,section:section as Section}
    : base;
}

export const copy = {
  es: {
    role: "Desarrollador Full Stack Junior",
    menu: { about:"Sobre mí", projects:"Proyectos", journey:"Formación", contact:"Contacto" },
    kicker: "SOBRE MÍ", heading: "Desarrollador full stack junior",
    intro: "Soy Nelson, de Formosa, Argentina. Empecé a aprender desarrollo web por mi cuenta y fui aplicando lo aprendido en proyectos cada vez más completos.",
    intro2: "Lo que más me interesa es entender cómo funciona una aplicación más allá de su interfaz: cómo se gestionan los datos, cómo se controlan los permisos y qué ocurre cuando algo falla. Disfruto resolver esos problemas, escribir código fácil de mantener y crear experiencias simples para quienes utilizan el sistema.",
    intro3: "Sigo profundizando mis conocimientos en desarrollo de software, pruebas y despliegue. Busco mi primera oportunidad profesional para aportar en un equipo, aprender de otros desarrolladores y continuar creciendo.",
    location:"Formosa, Argentina", sidebarDescription:"Desarrollo aplicaciones web completas, desde la interfaz hasta la base de datos.", explore:"Ver proyectos", download:"Descargar CV", social:"Perfiles",
    projectsEyebrow:"PROYECTOS", projectsTitle:"Proyectos seleccionados", projectsIntro:"Qué desarrollé, qué problema resolví y cómo lo hice.", open:"Ver proyecto", back:"Volver a proyectos", development:"Desarrollo", problem:"Problema", solution:"Solución", technologies:"Tecnologías", repository:"Ver código en GitHub", details:"Detalles técnicos", status:"Estado",
    journeyEyebrow:"FORMACIÓN", journeyTitle:"Estudios y certificaciones",
    studies:[
      {date:"Sep 2026 — actualidad",iso:"2026-09",name:"Harvard CS50 Web Programming",info:"Python, JavaScript y desarrollo de aplicaciones web · En curso"},
      {date:"Sep 2026 — actualidad",iso:"2026-09",name:"The Odin Project",info:"Full Stack JavaScript · En curso"},
      {date:"Ago 2026",iso:"2026-08",name:"freeCodeCamp",info:"Front End Development Libraries · Certificación obtenida"},
      {date:"2023",iso:"2023",name:"Bachiller",info:"E.P.E.P. N.º 179, Formosa"}
    ],
    skillsTitle:"Stack técnico",
    contactEyebrow:"CONTACTO", contactTitle:"Trabajemos juntos.", contactIntro:"Estoy disponible para mi primera oportunidad como desarrollador Full Stack Junior y para proyectos freelance.", contactEmail:"Escribirme por correo", contactCv:"Descargar CV", contactGithub:"GitHub", contactLinkedin:"LinkedIn"
  },
  en: {
    role:"Junior Full Stack Developer",
    menu:{about:"About me",projects:"Projects",journey:"Education",contact:"Contact"},
    kicker:"ABOUT ME",heading:"Junior full stack developer",
    intro:"I'm Nelson, from Formosa, Argentina. I started learning web development on my own and gradually applied what I learned to increasingly complex projects.",
    intro2:"What interests me most is understanding how an application works beyond its interface: how data is handled, how permissions are enforced, and what happens when something goes wrong. I enjoy solving these problems, writing maintainable code, and creating experiences that feel simple to the people using them.",
    intro3:"I'm constantly improving my skills in software development, testing, and deployment. I'm looking for my first professional opportunity where I can contribute to a team, learn from other developers, and continue growing.",
    location:"Formosa, Argentina",sidebarDescription:"I build complete web applications, from the interface to the database.", explore:"View projects",download:"Download CV",social:"Profiles",
    projectsEyebrow:"PROJECTS", projectsTitle:"Selected projects", projectsIntro:"What I built, the problem it addressed, and how I solved it.",open:"View project",back:"Back to projects",development:"Development",problem:"Problem",solution:"Solution",technologies:"Technologies",repository:"View code on GitHub",details:"Technical details",status:"Status",
    journeyEyebrow:"EDUCATION",journeyTitle:"Studies & certifications",
    studies:[
      {date:"Sep 2026 — present",iso:"2026-09",name:"Harvard CS50 Web Programming",info:"Python, JavaScript, and web applications · In progress"},
      {date:"Sep 2026 — present",iso:"2026-09",name:"The Odin Project",info:"Full Stack JavaScript · In progress"},
      {date:"Aug 2026",iso:"2026-08",name:"freeCodeCamp",info:"Front End Development Libraries · Certified"},
      {date:"2023",iso:"2023",name:"High School Diploma",info:"E.P.E.P. No. 179, Formosa"}
    ],
    skillsTitle:"Technical stack",
    contactEyebrow:"CONTACT",contactTitle:"Let's work together.",contactIntro:"I'm open to my first Junior Full Stack Developer role and to freelance projects.",contactEmail:"Send an email",contactCv:"Download CV",contactGithub:"GitHub",contactLinkedin:"LinkedIn"
  }
} as const;
