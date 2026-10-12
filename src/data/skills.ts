import type { SkillGroup } from "./types.js";
export const skills: SkillGroup[] = [
  { title: "Frontend", description: "Interfaces, formularios y estados que se entienden.", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML / CSS"], learning: false },
  { title: "Backend", description: "La lógica de negocio y sus límites viven en el servidor.", items: ["Python", "Django", "Django REST Framework", "APIs REST"], learning: false },
  { title: "Databases", description: "Modelado de datos y persistencia con reglas explícitas.", items: ["PostgreSQL", "SQLite", "Transacciones", "Restricciones"], learning: false },
  { title: "SaaS Architecture", description: "Aislamiento de aplicación sobre datos compartidos.", items: ["Multi-tenancy", "Membresías / roles", "Sesiones / CSRF", "Auditoría"], learning: false },
  { title: "AI Development Tools", description: "Asistentes de desarrollo dentro de un proceso revisable.", items: ["OpenAI Codex", "Claude Code", "Análisis", "Implementación / revisión"], learning: false },
  { title: "Automation", description: "Scripts y APIs en la práctica. Integración de agentes en exploración.", items: ["Scripts", "Integración de APIs", "Flujos de validación", "Agentes · exploración"], learning: true },
  { title: "Development & Deployment", description: "Herramientas para construir, comprobar y preparar la entrega.", items: ["Git / GitHub", "Linux", "Docker Compose", "Playwright", "Ruff"], learning: false }
];
