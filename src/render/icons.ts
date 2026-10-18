import type { Icon } from "../content/types.js";
import { logos, type Logo } from "./logos.js";

// Íconos de línea (24×24, trazo de 1.6) dibujados para el sitio. Heredan el color del texto.
const paths: Record<Icon | "arrow" | "mail" | "pin" | "download" | "linkedin" | "check" | "alert", string> = {
  shield: "M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z M9 12l2 2 4-4",
  users: "M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20 M10 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.4 M15.5 4.6a3.5 3.5 0 0 1 0 6.8",
  file: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z M14 3v5h5 M9 13h6 M9 17h4",
  coins: "M9 10.5c3.3 0 6-1.1 6-2.5s-2.7-2.5-6-2.5S3 6.6 3 8s2.7 2.5 6 2.5z M3 8v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5 M3 12v4c0 1.4 2.7 2.5 6 2.5 M15 13.5c3.3 0 6 1.1 6 2.5s-2.7 2.5-6 2.5-6-1.1-6-2.5 M21 16v2.5c0 1.4-2.7 2.5-6 2.5s-6-1.1-6-2.5V16",
  box: "M21 8l-9-5-9 5 9 5 9-5z M3 8v8l9 5 9-5V8 M12 13v8",
  chart: "M4 20V4 M4 20h16 M8 16v-4 M12 16V8 M16 16v-6",
  cart: "M3 4h2l2.2 10.5a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6 M9.5 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  truck: "M3 6h11v10H3z M14 10h4l3 3v3h-7 M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M17.5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  card: "M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11z M3 10h18 M7 15h3",
  layers: "M12 3l9 5-9 5-9-5 9-5z M3 12.5l9 5 9-5 M3 16.5l9 5 9-5",
  map: "M9 4L3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4z M9 4v13.5 M15 6.5V20",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M8 17h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2",
  printer: "M7 9V3h10v6 M7 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M7 14h10v7H7z",
  refresh: "M20 11a8 8 0 0 0-14.7-4.3L4 8 M4 4v4h4 M4 13a8 8 0 0 0 14.7 4.3L20 16 M20 20v-4h-4",
  arrow: "M7 17L17 7 M8 7h9v9",
  mail: "M4 6h16v12H4z M4 7l8 6 8-6",
  pin: "M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  download: "M12 4v11 M7.5 10.5L12 15l4.5-4.5 M5 20h14",
  linkedin: "M5 9.5V19 M5 5.5v.01 M10 19v-9.5 M10 13.5c0-2.2 1.3-4 3.5-4s3.5 1.5 3.5 4V19",
  check: "M5 12.5l4.5 4.5L19 7.5",
  alert: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7.5v5.5 M12 16.5v.01",
};

export type IconName = keyof typeof paths;

export const icon = (name: IconName, cls = "icon") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]}"/></svg>`;

export const logo = (name: Logo, cls = "logo") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${logos[name]}"/></svg>`;
