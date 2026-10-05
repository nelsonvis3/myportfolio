export interface Project {
  id: string;
  name: string;
  subtitle: string;
  desc: string;
  stack: string[];
  repo: string;
  demo: string;
  img: string[];
  solved: string[];
  problema: string | null;
  objetivo: string | null;
  solucion: string | null;
  arquitectura: string | null;
  funcionalidades: string[];
  desafios: string[];
  decisiones: string[];
  resultado: string | null;
}

export interface SkillGroup { title: string; items: string[]; learning: boolean }
export interface Course { name: string; detail: string; status: string }
export interface TimelineItem { period: string; text: string }
