export const socials = {
  "website": "https://nelsonvis-portfolio.vercel.app",
  "github": "https://github.com/nelsonvis3",
  "linkedin": "https://linkedin.com/in/nelson-sivisstum-4777a32b4",
  "email": "nelsonsivisstum3@gmail.com",
  "cv": "/cv.pdf"
} as const;

// Dominio público proporcionado por el propietario; SITE_URL permite reemplazarlo.
const configuredUrl = process.env.SITE_URL?.trim() || socials.website;
if (configuredUrl && !/^https?:\/\//.test(configuredUrl)) {
  throw new Error("SITE_URL debe ser una URL absoluta http(s).");
}
export const siteUrl = configuredUrl ? new URL(configuredUrl).origin : "";
