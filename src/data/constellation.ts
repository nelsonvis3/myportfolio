// Groups shown in the hero; these describe actual work, not proficiency scores.
export const constellation = [
  { id: "frontend", name: "Frontend", tools: "React · Next.js · TypeScript", detail: "Interfaces que convierten complejidad en una experiencia clara.", coordinate: "01 / INTERFACE" },
  { id: "backend", name: "Backend", tools: "Python · Django · REST APIs", detail: "APIs, modelos de datos y reglas que sostienen cada operación.", coordinate: "02 / LOGIC & DATA" },
  { id: "data", name: "Data Engineering", tools: "SQL · PostgreSQL · Modelado de datos", detail: "Modelos, consultas y transacciones para conservar los datos de cada operación.", coordinate: "03 / DATA ENGINEERING" },
  { id: "ai", name: "AI Engineering", tools: "Codex · Claude Code · Revisión", detail: "Asistentes para analizar y escribir código, con revisión de los cambios y pruebas.", coordinate: "04 / INTELLIGENCE" },
] as const;
