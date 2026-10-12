import type { Project } from "./types.js";
import { ledgercore } from "./ledgercore.js";

// Summary data for the homepage and metadata. Long-form cases: case-studies.ts.
export const projects: Project[] = [
  ledgercore,
  {
    id: "ragnar-suplementos", name: "Ragnar Suplementos", category: "E-commerce / Full Stack",
    subtitle: "E-commerce, inventario y operación comercial",
    desc: "E-commerce para una marca real: catálogo, variantes, combos y checkout, con reservas de stock, cotización de envío y pagos gestionados desde una API Django.",
    stack: ["Next.js", "React", "Django", "PostgreSQL", "TypeScript", "Zustand"],
    repo: "https://github.com/nelsonvis3/ragnarsuplementosfsa", demo: "https://lnkd.in/p/duYCgKhB", img: ["/img/ragnar.webp"],
    problema: "Vender productos y combos sin perder el control del inventario ni confiar en precios calculados por el navegador.",
    objetivo: "Conectar una experiencia de compra simple con reglas consistentes de pedidos, reservas y pagos.",
    solucion: "Una tienda Next.js conectada a Django REST Framework, con el servidor como autoridad del catálogo y de cada operación comercial.",
    arquitectura: "Next.js, React y TypeScript consumen una API Django. Zustand persiste carrito y sesión; PostgreSQL almacena catálogo, inventario, pedidos y pagos. Las cuentas JWT son opcionales para comprar.",
    funcionalidades: ["Catálogo, sabores y combos", "Checkout invitado y cuentas opcionales", "Reserva de stock y expiración", "Cotización de envío firmada", "Mercado Pago y medios manuales configurables", "Administración de pedidos"],
    solved: ["Reintentos de checkout sin pedidos duplicados", "Inventario compartido por productos y combos", "Revisión de pagos asíncronos"],
    desafios: ["Mantener el contexto de cada compra ante reintentos", "Conciliar pagos con reservas vencidas", "Controlar inventario compartido por combos"],
    decisiones: ["Recalcular precios en el servidor", "Reservar stock en una transacción", "Conservar snapshots de los ítems", "Representar las revisiones humanas como estados"],
    resultado: "Tienda y operación administrativa implementadas en código. La disponibilidad del despliegue y los pagos reales no fueron verificados en esta revisión.",
    imageCaption: "Captura real de la portada del proyecto en desarrollo."
  },
  {
    id: "roadledger", name: "RoadLedger", category: "Route Planning / API Integration",
    subtitle: "Planificador de viajes y registros diarios · Prototipo ELD/HOS",
    desc: "Prototipo Full Stack que conecta geocodificación, ruteo y un modelo temporal para representar viajes en un mapa, una cronología y registros diarios imprimibles.",
    stack: ["Django REST Framework", "React", "MapLibre", "OSRM", "Python"],
    repo: "https://github.com/nelsonvis3/ELD-trip-planner", demo: "https://eld-trip-planner-5as7.onrender.com/", img: ["/img/roadledger.webp"],
    problema: "Convertir ubicaciones y horas disponibles en un viaje que pueda interpretarse más allá de una línea en el mapa.",
    objetivo: "Relacionar ruta, eventos y registros diarios a partir de un mismo resultado de planificación.",
    solucion: "Django valida las entradas, consulta Photon y OSRM y calcula eventos. React representa el resultado mediante MapLibre, cronología y gráficos SVG diarios.",
    arquitectura: "Django sirve el frontend React y POST /api/plan/. Photon geocodifica, proveedores OSRM calculan la carretera y el planificador transforma la distancia en eventos y segmentos diarios. No se persisten viajes.",
    funcionalidades: ["Ruta GeoJSON e indicaciones", "Modelo de conducción, retiro, entrega y descansos", "Cronología y llegada estimada", "Hojas diarias imprimibles", "Zona horaria de la terminal"],
    solved: ["Separar duración estimada y geometría de ruta", "Segmentar eventos al cruzar medianoche", "Mantener vistas útiles si falla el mapa"],
    desafios: ["Manejar dependencias externas de ruteo", "Conservar una referencia temporal", "Representar días completos y paradas aproximadas"],
    decisiones: ["Un mismo JSON para todas las vistas", "GeoJSON como contrato geométrico", "API sin persistencia de viajes", "Hipótesis de cálculo explícitas"],
    resultado: "Prototipo educativo implementado en código; no es un registro ELD certificado. La ruta con proveedores activos y el despliegue público no se verificaron durante esta revisión del portfolio.",
    imageCaption: "Captura real de la pantalla inicial, anterior al cálculo de un viaje."
  }
];
