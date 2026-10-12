// Groups shown in the hero; these describe actual work, not proficiency scores.
export const constellation = [
  { id: "frontend", name: "Frontend", tools: "React · Next.js · TypeScript", detail: "Interfaces que convierten complejidad en una experiencia clara.", coordinate: "01 / INTERFACE" },
  { id: "backend", name: "Backend", tools: "Python · Django · REST APIs", detail: "APIs, modelos de datos y reglas que sostienen cada operación.", coordinate: "02 / LOGIC & DATA" },
  { id: "data", name: "Data Engineering", tools: "SQL · PostgreSQL · Modelado de datos", detail: "Estructuras, consultas y transacciones que preservan la consistencia.", coordinate: "03 / DATA ENGINEERING" },
  { id: "ai", name: "AI Engineering", tools: "Codex · Claude Code · Revisión", detail: "Desarrollo asistido por IA, guiado por decisiones y comprobaciones.", coordinate: "04 / INTELLIGENCE" },
] as const;
