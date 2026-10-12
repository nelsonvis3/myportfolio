import type { Project } from "./types.js";

// Nombre editorial de facturador-saas-api (Fracxion en la aplicación).
// Evidencia y alcance: docs/CONTENT_EVIDENCE.md. No hay URL pública verificada.
export const ledgercore: Project = {
  id: "ledgercore",
  name: "LedgerCore",
  category: "Multi-Tenant SaaS Application",
  subtitle: "Varias empresas. Un sistema. Cada dato en su lugar.",
  desc: "Una plataforma de gestión y facturación interna donde cada empresa tiene sus clientes, catálogo, comprobantes y cobros, con permisos y trazabilidad en cada operación.",
  stack: ["Next.js", "TypeScript", "Django REST Framework", "PostgreSQL", "Docker"],
  repo: "",
  demo: "",
  img: ["/img/ledgercore-overview.png", "/img/ledgercore-invoice.png"],
  imageCaption: "Captura real del entorno local con datos sintéticos. La aplicación conserva su nombre original, Fracxion.",
  solved: ["Aislamiento de datos y permisos por empresa.", "Emisión y cobros consistentes ante operaciones concurrentes.", "Reversiones que conservan el historial de una operación."],
  problema: "Administrar varias empresas en una misma plataforma exige separar sus datos, controlar quién puede operar y conservar un historial confiable de cada comprobante y cobro.",
  objetivo: "Centralizar la gestión de clientes, productos, servicios y facturación interna de pequeñas empresas, con una experiencia web compartida y reglas de negocio propias de cada organización.",
  solucion: "Un frontend Next.js conectado a una API Django REST Framework. La cuenta se vincula a cada empresa mediante una membresía y un rol; el backend valida esa relación antes de leer o modificar sus datos.",
  arquitectura: "Next.js y React construyen la interfaz; Django REST Framework expone la API; PostgreSQL persiste usuarios, sesiones y datos comerciales. El entorno Docker Compose usa Caddy como proxy, Gunicorn para Django y Redis para compartir los límites de intentos de autenticación.",
  funcionalidades: ["Registro de cuenta y empresa, sesiones y recuperación de contraseña.", "Clientes y catálogo con búsqueda, paginación y activación/desactivación.", "Borradores, emisión con numeración por empresa e impresión.", "Pagos parciales, control de saldo y reversión con motivo.", "Historial de auditoría reservado a propietarios y administradores."],
  desafios: ["Concurrencia: la emisión bloquea la fila de la empresa dentro de una transacción antes de asignar el siguiente número. Una restricción única en PostgreSQL refuerza la regla.", "Integridad histórica: los borradores guardan snapshots del cliente y del catálogo. Cambiar esos datos después no reescribe el documento.", "Cobros consistentes: el servicio bloquea la empresa y la factura, comprueba el saldo y guarda el pago junto con la auditoría. La reversión crea un registro separado."],
  decisiones: ["Base de datos y esquema compartidos, con aislamiento por tenant en la capa de aplicación.", "Sesiones con cookies HttpOnly y validación CSRF en operaciones de escritura.", "Importes con Decimal y redondeo explícito en el backend.", "Operación comercial y evento de auditoría dentro de la misma transacción."],
  resultado: "Flujo implementado desde el registro hasta la emisión, el cobro y su reversión. El repositorio documenta validación local con PostgreSQL, pruebas de concurrencia, escenarios de navegador y un stack Docker. La puesta en producción pública sigue pendiente."
};

export const engineeringChallenges = [
  { title: "Una secuencia, incluso con concurrencia.", problem: "Dos emisiones simultáneas podrían intentar utilizar el mismo número.", solution: "Bloqueo de la empresa con select_for_update, transacción atómica y restricción única por empresa y número.", source: "billing/services.py · issue_invoice" },
  { title: "El historial tiene que seguir siendo historia.", problem: "Editar un cliente o un precio no debería cambiar un comprobante anterior.", solution: "Snapshots de cliente y producto al crear el borrador. La API impide editar o eliminar documentos emitidos.", source: "billing/services.py · create_invoice_draft" },
  { title: "Revertir sin borrar lo que pasó.", problem: "Un cobro incorrecto necesita corregirse sin perder su trazabilidad.", solution: "Un registro de reversión separado conserva el pago original y el motivo. El saldo y la auditoría se actualizan dentro de la transacción.", source: "billing/services.py · reverse_payment" }
];
