export const aiTools = [
  { name: "OpenAI Codex", label: "Repository → Implementation → Validation", description: "Exploración de repositorios, implementación por iteraciones y revisión de cambios. Contrasto las propuestas con el código y las comprobaciones del proyecto.", tasks: "Análisis · Implementación · Revisión · Documentación" },
  { name: "Claude Code", label: "Analysis → Implementation → Review", description: "Lo uso para comprender proyectos, implementar funcionalidades y revisar código. Evalúo cada propuesta dentro de su contexto antes de incorporarla.", tasks: "Análisis · Implementación · Revisión" }
];

export const workflow = [
  { id: "plan", name: "Plan", title: "Entender. Diseñar. Delimitar.", text: "Defino el problema, el alcance y los criterios de aceptación. Diseño las responsabilidades de interfaz, API y datos antes de implementar.", owner: "Criterio del desarrollador", output: "Plan + diseño del sistema" },
  { id: "build", name: "Build", title: "La IA asiste. Yo conduzco.", text: "Codex y Claude Code asisten en el análisis y la implementación. Trabajo con cambios pequeños; una sugerencia generada todavía necesita revisión.", owner: "Desarrollador + asistentes", output: "Implementación asistida por IA" },
  { id: "review", name: "Review", title: "Leer también lo que puede fallar.", text: "Reviso el diff, los permisos y los casos límite. Acepto, corrijo o descarto lo propuesto según las reglas del sistema.", owner: "Responsabilidad técnica", output: "Cambios revisados" },
  { id: "test", name: "Test", title: "Pasar del supuesto a la evidencia.", text: "Compruebo tipos, build y comportamiento. Las pruebas de reglas críticas incluyen los accesos y operaciones que deben rechazarse.", owner: "Controles verificables", output: "Pruebas + límites documentados" },
  { id: "ship", name: "Ship", title: "Entregar con un estado claro.", text: "Reviso configuración, migraciones y arranque. Distingo lo validado localmente de lo que está publicado y verificado en producción.", owner: "Decisión del desarrollador", output: "Entrega con verificación explícita" }
];

// Estudio conceptual: no simula una integración desplegada ni ejecuta servicios.
export const automation = [
  { id: "input", name: "Input", subtitle: "Receive", title: "Todo empieza con una entrada clara.", text: "En este diseño, una solicitud inicia el flujo. Antes de avanzar se define su origen, formato y datos necesarios.", example: "Ejemplo: una solicitud de soporte", output: "Entrada identificada" },
  { id: "api", name: "API", subtitle: "Validate", title: "Conectar también implica validar.", text: "Una capa de integración comprobaría el formato y los permisos, normalizaría los datos y controlaría errores o reintentos.", example: "Ejemplo: validar campos obligatorios", output: "Datos consistentes" },
  { id: "intelligence", name: "Intelligence", subtitle: "Assist", title: "Una sugerencia, con contexto.", text: "Una herramienta de IA podría sugerir una categoría o resumir la solicitud. Su salida seguiría siendo una propuesta que necesita controles.", example: "Ejemplo: sugerir prioridad y categoría", output: "Propuesta para revisar" },
  { id: "action", name: "Action", subtitle: "Approve", title: "La acción pasa por una decisión.", text: "La persona responsable revisaría la propuesta antes de autorizar un cambio. El diseño contempla detener el flujo cuando no hay aprobación.", example: "Ejemplo: aprobar la creación de una tarea", output: "Acción autorizada" },
  { id: "result", name: "Result", subtitle: "Trace", title: "Un resultado que se pueda seguir.", text: "El flujo conservaría el resultado de la operación, su estado y el contexto necesario para revisar lo ocurrido o resolver un fallo.", example: "Ejemplo: tarea registrada con historial", output: "Resultado trazable" }
];
