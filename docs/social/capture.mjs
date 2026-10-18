// Captura card.html con Brave headless (por CDP) y guarda las imágenes para compartir el portfolio.
// Uso: node docs/social/capture.mjs        → public/img/social-preview(-en).png y docs/social/banner-linkedin.png
//      OUT=/tmp/prueba node docs/social/... → todas en esa carpeta, para revisarlas antes.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const out = process.env.OUT;
const browser = process.env.CARD_BROWSER ?? "/usr/bin/brave";
const shots = [
  { query: "kind=og&lang=es", width: 1200, height: 630, file: out ? join(out, "social-preview.png") : join(root, "public/img/social-preview.png") },
  { query: "kind=og&lang=en", width: 1200, height: 630, file: out ? join(out, "social-preview-en.png") : join(root, "public/img/social-preview-en.png") },
  { query: "kind=banner", width: 1584, height: 396, file: out ? join(out, "banner-linkedin.png") : join(here, "banner-linkedin.png") },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
const port = 9400 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), "social-card-"));
const child = spawn(browser, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });

try {
  let targets;
  for (let i = 0; i < 60 && !targets; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(200); }
  }
  const ws = new WebSocket(targets.find(t => t.type === "page").webSocketDebuggerUrl);
  await new Promise(r => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); pending.get(m.id)?.(m.result); pending.delete(m.id); };
  const send = (method, params = {}) => new Promise(r => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });

  await send("Page.enable");
  for (const s of shots) {
    await send("Emulation.setDeviceMetricsOverride", { width: s.width, height: s.height, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: `${pathToFileURL(join(here, "card.html"))}?${s.query}` });
    await sleep(500);
    await send("Runtime.evaluate", { expression: "Promise.all([document.fonts.ready, ...[...document.images].map(i => i.decode().catch(() => {}))])", awaitPromise: true });
    await sleep(300);
    const { data } = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: s.width, height: s.height, scale: 1 } });
    writeFileSync(s.file, Buffer.from(data, "base64"));
    console.log(s.file);
  }
  ws.close();
} finally {
  child.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
}
