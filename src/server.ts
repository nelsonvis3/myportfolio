import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const port = Number(process.env.PORT ?? 3000);
const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".ico": "image/x-icon",
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    let file = join(dist, normalize(decodeURIComponent(url.pathname)));
    if (!file.startsWith(dist)) throw new Error("fuera de dist");
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 — no encontrado");
  }
}).listen(port, () => console.log(`Portfolio en http://localhost:${port}`));
