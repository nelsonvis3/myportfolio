# Nelson Sivisstum — Portfolio

Personal portfolio in Spanish and English: [nelsonsivisstum.vercel.app](https://nelsonsivisstum.vercel.app/).

Built with React, TypeScript and Vite. Every page (both languages and each case study) is prerendered to static HTML for search engines and fast first load, then hydrated on the client.

```bash
npm install
npm run dev      # local server at 127.0.0.1:5173
npm run build    # typecheck, build and prerender into dist/
```

Content lives in `src/data.ts`; the downloadable CVs are `public/cv.pdf` and `public/cv-en.pdf`.
