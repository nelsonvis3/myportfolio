import type { Project } from "./types.js";

// Editá o agregá proyectos acá. Un campo null se muestra como "Pendiente" en el case study.
export const projects: Project[] = [
  {
    "id": "formosa-empleos",
    "name": "Formosa Empleos(Actualmente en reconstruccion)",
    "subtitle": "Portal de empleos para Formosa Capital",
    "desc": "Plataforma web que conecta empresas y postulantes, con distintos roles de usuario, publicación de ofertas y gestión de postulaciones.",
    "stack": [
      "HTML",
      "CSS",
      "JavaScript",
      "Supabase",
      "PostgreSQL"
    ],
    "repo": "https://github.com/nelsonvis3/formosa-empleos",
    "demo": "https://formosa-empleos.vercel.app/",
    "img": ['/img/formosa-empleos.png'],
    "solved": [
      "Los links de confirmación apuntaban a localhost y fallaban con testers externos.",
      "Probar tres roles con un solo correo y sin dominio propio."
    ],
    "problema": "Las empresas y los postulantes de Formosa Capital no tenían un lugar propio donde encontrarse.",
    "objetivo": "Tener un portal funcional donde las empresas publiquen ofertas y los postulantes se registren y se postulen.",
    "solucion": "Una primera versión completa, hecha con HTML, CSS y JavaScript sobre Supabase para salir rápido, y publicada en GitHub Pages.",
    "arquitectura": "Frontend en HTML/CSS/JS plano. Supabase aporta autenticación, PostgreSQL con políticas RLS y almacenamiento de archivos. Los emails salen por SMTP con Resend.",
    "funcionalidades": [
      "Registro de empresas y de postulantes",
      "Autenticación",
      "Aprobación administrativa de empresas",
      "Publicación de ofertas y listado público",
      "Postulación directa o con formulario (texto libre, sí/no y opción múltiple)",
      "Gestión de estados de cada postulación",
      "Emails transaccionales",
      "Perfil de empresa con logo, web, red social y dirección"
    ],
    "desafios": [
      "Los links de confirmación iban a localhost: se corrigieron Site URL y Redirect URLs hacia GitHub Pages para que funcionen con usuarios reales.",
      "Sin dominio verificado, Resend solo envía a mi propio Gmail: probé los roles con alias +empresa, +admin y +postulante."
    ],
    "decisiones": [
      "Empezar con Supabase para entregar rápido, con la migración a un backend propio (probablemente FastAPI + PostgreSQL) ya planificada.",
      "Aprobación administrativa antes de que una empresa pueda publicar.",
      "Listado en dos paneles (lista a la izquierda, detalle a la derecha) sin recargar la página."
    ],
    "resultado": "Versión 1 funcional y publicada. Próximo paso: dominio propio y backend propio."
  },
  {
    "id": "ragnar-suplementos",
    "name": "Ragnar Suplementos",
    "subtitle": "E-commerce de suplementos deportivos",
    "desc": "E-commerce desarrollado para una marca real de suplementos deportivos, con catálogo, variantes de producto, cuentas de usuario y checkout.",
    "stack": [
      "Next.js",
      "React",
      "Django",
      "PostgreSQL"
    ],
    "repo": "https://github.com/nelsonvis3/ragnarsuplementosfsa",
    "demo": "https://lnkd.in/p/duYCgKhB",
    "img": ['/img/ragnar.png'],
    "solved": [
      "Conflictos de especificidad CSS.",
      "Productos con variantes (sabores) en un modal.",
      "Registro → confirmación → login → redirección."
    ],
    "problema": "Una marca de suplementos necesitaba vender online con un catálogo propio y un pedido simple para sus clientes.",
    "objetivo": "Un e-commerce con catálogo, cuentas de usuario y un checkout adaptado a cómo compran sus clientes.",
    "solucion": "Un frontend en Next.js y React conectado a un backend Django con PostgreSQL.",
    "arquitectura": "Migré el proyecto desde HTML/CSS/JS con Supabase a Next.js + React en el frontend y Django + PostgreSQL en el backend.",
    "funcionalidades": [
      "Catálogo y variantes de producto",
      "Registro, confirmación y login",
      "Checkout con pedido por WhatsApp",
      "Pago por transferencia bancaria"
    ],
    "desafios": [
      "Especificidad CSS: estilos que se pisaban entre sí.",
      "Rutas relativas y absolutas en una estructura de carpetas anidada.",
      "El flujo de autenticación completo: registro, confirmación, login y redirección.",
      "Modelar productos con variantes: los sabores son un arreglo de objetos que alimenta el modal."
    ],
    "decisiones": [
      "Migrar a Next.js y Django para tener una base que escale.",
      "Checkout por WhatsApp con control de login previo, además de transferencia."
    ],
    "resultado": "Tienda funcional. Pendiente: un asistente integrado conectado a la API de Claude."
  },
  {
    "id": "roadledger",
    "name": "RoadLedger",
    "subtitle": "Planificador de viajes con reglas HOS para camioneros",
    "desc": "Aplicación full-stack que recibe origen, retiro, destino y horas de ciclo usadas, y devuelve la ruta en el mapa, las paradas obligatorias y una hoja de registro diario imprimible por cada día del viaje.",
    "stack": [
      "Python",
      "Django",
      "Django REST Framework",
      "React",
      "MapLibre GL JS",
      "OSRM",
      "Render"
    ],
    "repo": "https://github.com/nelsonvis3/ELD-trip-planner",
    "demo": "https://eld-trip-planner-5as7.onrender.com/",
    "img": ['/img/roadledger.png'],
    "solved": [
      "Convertir las reglas de Hours of Service de la FMCSA en un plan de viaje concreto.",
      "Depender de servicios públicos de geocodificación y ruteo sin que la demo se caiga."
    ],
    "problema": "Planificar un viaje largo en camión no es solo trazar una ruta: las horas de conducción y descanso están limitadas por las reglas de Hours of Service de la FMCSA.",
    "objetivo": "Una herramienta donde el conductor cargue su viaje y vea la ruta, las paradas obligatorias y sus registros diarios, sin hacer las cuentas a mano.",
    "solucion": "Un backend Django que geocodifica, pide la ruta y aplica el modelo HOS, y un frontend React que dibuja el mapa y genera las hojas diarias estilo ELD listas para imprimir.",
    "arquitectura": "React 18 con MapLibre GL JS se sirve como archivo estático desde Django y llama a POST /api/plan/. Django REST Framework geocodifica con Photon, pide la ruta a OSRM (con respaldo en el servicio demo) y calcula el plan HOS. Los viajes no se guardan, así que corre como un único servicio en Render, sin base de datos propia.",
    "funcionalidades": [
      "Ruta sobre mapa interactivo con distancia e indicaciones paso a paso",
      "Eventos de retiro, entrega, combustible, pausas, descansos y reinicio de 34 horas",
      "Llegada estimada y horas de ciclo restantes",
      "Hoja de registro diario por cada día del viaje, con gráfico de 24 horas, totales y observaciones",
      "Vista de impresión de los registros",
      "Selección de zona horaria de la terminal de origen"
    ],
    "desafios": [
      "Servicios públicos sin ruteo para camiones y con límites de uso: agregué timeouts, geocodificación secuencial, caché y ruteo de respaldo.",
      "Modelar las reglas HOS: 11 horas de manejo, ventana de 14 horas, pausa de 30 minutos tras 8 horas y ciclo de 70 horas en 8 días.",
      "Manejo de zonas horarias: el plan usa un offset estándar fijo para todos los registros, aunque el viaje cruce otra zona."
    ],
    "decisiones": [
      "Calcular el tiempo de manejo con un ritmo fijo de 55 mph y usar el ETA de OSRM solo para la ruta, porque está pensado para autos.",
      "No persistir los viajes: la API devuelve todo directamente y se evita sumar una base de datos.",
      "Frontend sin paso de build separado, servido por Django."
    ],
    "resultado": "Prototipo funcional con deploy en Render. Es un prototipo educativo, no un registro ELD. Pendiente: reemplazar los servicios públicos por proveedores dedicados si se usa de forma sostenida."
  }
];
