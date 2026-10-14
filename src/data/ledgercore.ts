import type { Project } from "./types.js";

// El identificador histórico conserva las URLs existentes; la marca es Fracxion.
// Evidencia y alcance: docs/CONTENT_EVIDENCE.md. No hay demo pública verificada.
export const ledgercore: Project = {
  id: "ledgercore",
  name: "Fracxion",
  category: "Gestión comercial / SaaS multi-tenant",
  subtitle: "Clientes, facturas y cobros de varias empresas en un mismo sistema.",
  desc: "Sistema de gestión comercial para administrar clientes, productos y servicios, emitir facturas internas y registrar cobros parciales o totales. Cada empresa trabaja con sus propios datos y permisos.",
  stack: ["Next.js", "TypeScript", "Django REST Framework", "PostgreSQL", "Docker"],
  repo: "https://github.com/nelsonvis3/fracxion-facturador",
  demo: "",
  img: ["/img/ledgercore-overview.png", "/img/ledgercore-invoice.png"],
  imageCaption: "Fracxion en escritorio, ejecutado localmente con empresas y operaciones de prueba.",
  solved: ["Aislamiento de datos y permisos por empresa.", "Emisión y cobros consistentes ante operaciones concurrentes.", "Reversiones que conservan el historial de una operación."],
  problema: "Administrar varias empresas en una misma plataforma exige separar sus datos, controlar quién puede operar y conservar un historial confiable de cada comprobante y cobro.",
  objetivo: "Centralizar la gestión de clientes, productos, servicios y facturación interna de pequeñas empresas, con una experiencia web compartida y reglas de negocio propias de cada organización.",
  solucion: "Un frontend Next.js conectado a una API Django REST Framework. La cuenta se vincula a cada empresa mediante una membresía y un rol; el backend valida esa relación antes de leer o modificar sus datos.",
  arquitectura: "Next.js y React construyen la interfaz; Django REST Framework expone la API; PostgreSQL persiste usuarios, sesiones y datos comerciales. El entorno Docker Compose usa Caddy como proxy, Gunicorn para Django y Redis para compartir los límites de intentos de autenticación.",
  funcionalidades: ["Crear una cuenta con su empresa, iniciar sesión, elegir un espacio de trabajo y recuperar el acceso por correo.", "Dar de alta y editar clientes, buscarlos, filtrar listados y desactivarlos sin perder sus referencias.", "Administrar productos y servicios con SKU, unidad, moneda, precio e impuesto.", "Preparar facturas internas en borrador, calcular sus importes en el servidor, emitirlas con numeración por empresa e imprimirlas.", "Registrar cobros parciales o totales con método y referencia, consultar el saldo pendiente y revertir un cobro indicando el motivo.", "Consultar quién realizó una operación, cuándo y qué cambió, con acceso a auditoría para propietarios y administradores.", "Navegar desde escritorio o móvil con estados de carga, listas vacías, errores y reintentos. Las transiciones de sesión con Hyperframes y GSAP se pueden omitir y respetan movimiento reducido."],
  highlights: ["Clientes y catálogo separados por empresa, con acceso según el rol.", "Facturas internas: borrador, emisión numerada e impresión.", "Cobros parciales, saldo pendiente y reversiones con historial."],
  contribution: "Desarrollo de la interfaz, la API, el modelo de empresas y los servicios de facturación y cobros; pruebas y documentación del recorrido comercial.",
  desafios: ["Concurrencia: la emisión bloquea la fila de la empresa dentro de una transacción antes de asignar el siguiente número. Una restricción única en PostgreSQL refuerza la regla.", "Integridad histórica: los borradores guardan snapshots del cliente y del catálogo. Cambiar esos datos después no reescribe el documento.", "Cobros consistentes: el servicio bloquea la empresa y la factura, comprueba el saldo y guarda el pago junto con la auditoría. La reversión crea un registro separado."],
  decisiones: ["Base de datos y esquema compartidos, con aislamiento por tenant en la capa de aplicación.", "Sesiones con cookies HttpOnly y validación CSRF en operaciones de escritura.", "Importes con Decimal y redondeo explícito en el backend.", "Operación comercial y evento de auditoría dentro de la misma transacción."],
  resultado: "Flujo implementado desde el registro hasta la emisión, el cobro y su reversión. El repositorio documenta validación local con PostgreSQL, pruebas de concurrencia, escenarios de navegador y un stack Docker. La puesta en producción pública sigue pendiente."
};

export const engineeringChallenges = [
  { title: "Una secuencia, incluso con concurrencia.", problem: "Dos emisiones simultáneas podrían intentar utilizar el mismo número.", solution: "Bloqueo de la empresa con select_for_update, transacción atómica y restricción única por empresa y número.", source: "billing/services.py · issue_invoice" },
  { title: "El historial tiene que seguir siendo historia.", problem: "Editar un cliente o un precio no debería cambiar un comprobante anterior.", solution: "Snapshots de cliente y producto al crear el borrador. La API impide editar o eliminar documentos emitidos.", source: "billing/services.py · create_invoice_draft" },
  { title: "Revertir sin borrar lo que pasó.", problem: "Un cobro incorrecto necesita corregirse sin perder su trazabilidad.", solution: "Un registro de reversión separado conserva el pago original y el motivo. El saldo y la auditoría se actualizan dentro de la transacción.", source: "billing/services.py · reverse_payment" }
];
