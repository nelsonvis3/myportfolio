import * as THREE from "three";

/** Sección de IA: partículas que llegan en corrientes curvas y forman dos símbolos
 * genéricos de programación (">_" y "</>"). Son formas propias, no logos de marcas. */

function random(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Puntos dentro del contorno de un texto, normalizados a ancho 1 y centrados. */
function sampleGlyph(text: string, count: number, rand: () => number): Float32Array {
  const canvas = document.createElement("canvas");
  canvas.width = 640; canvas.height = 320;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const out = new Float32Array(count * 3);
  if (!ctx) return out;
  ctx.fillStyle = "#fff";
  ctx.font = "700 230px 'Martian Mono Variable', monospace";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(text, 320, 165);
  const data = ctx.getImageData(0, 0, 640, 320).data;
  const filled: number[] = [];
  let minX = 640, maxX = 0, minY = 320, maxY = 0;
  for (let y = 0; y < 320; y += 2) for (let x = 0; x < 640; x += 2) {
    if (data[(y * 640 + x) * 4 + 3] > 140) { filled.push(x, y); minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  }
  if (!filled.length) return out;
  const w = maxX - minX || 1, cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  for (let i = 0; i < count; i++) {
    const k = Math.floor(rand() * (filled.length / 2)) * 2;
    out[i * 3] = (filled[k] - cx + (rand() - 0.5) * 2.2) / w;
    out[i * 3 + 1] = -(filled[k + 1] - cy + (rand() - 0.5) * 2.2) / w;
    out[i * 3 + 2] = (rand() - 0.5) * 0.09;
  }
  return out;
}

const vertexShader = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aControl;
  attribute float aSeed;
  attribute float aOrbit;
  uniform float uTime, uForm, uSize, uPixelRatio, uOpacity, uLight;
  uniform vec3 uColorA, uColorB;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float t = clamp(uForm * 1.6 - aSeed * 0.6, 0.0, 1.0);
    float k = 1.0 - pow(1.0 - t, 3.0);
    vec3 a = mix(aStart, aControl, k), b = mix(aControl, position, k);
    vec3 p = mix(a, b, k);
    // Partículas en órbita: una vez formado el símbolo, giran a su alrededor.
    float orbit = aOrbit * smoothstep(0.7, 1.0, t);
    float ang = uTime * (0.6 + aSeed * 0.5) + aSeed * 30.0;
    vec3 ring = vec3(cos(ang) * 0.62, sin(ang) * 0.24, sin(ang) * 0.3) * (0.92 + aSeed * 0.2);
    p = mix(p, ring, orbit);
    p += vec3(sin(uTime * 2.0 + aSeed * 90.0), cos(uTime * 1.7 + aSeed * 70.0), 0.0) * 0.006 * t;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aSeed * 0.7) * mix(1.6, 1.0, t) * uPixelRatio / -mv.z;
    float current = pow(0.5 + 0.5 * sin(position.x * 9.0 - uTime * 2.4 + position.y * 3.0), 10.0);
    vColor = mix(uColorA, uColorB, clamp(0.55 + aSeed * 0.3 + current * t, 0.0, 1.0));
    vAlpha = uOpacity * mix(0.25, 1.0, t) * (aOrbit > 0.5 ? 0.45 : 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = (pow(smoothstep(0.5, 0.0, d), 2.0) * 0.6 + smoothstep(0.15, 0.0, d) * 0.5) * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

export class EnergyGlyph {
  readonly points: THREE.Points;
  readonly material: THREE.ShaderMaterial;

  constructor(text: string, count: number, seed: number, side: number) {
    const rand = random(seed);
    const orbitCount = Math.round(count * 0.08);
    const shape = sampleGlyph(text, count - orbitCount, rand);
    const position = new Float32Array(count * 3), start = new Float32Array(count * 3), control = new Float32Array(count * 3);
    const seeds = new Float32Array(count), orbit = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      if (i < count - orbitCount) position.set(shape.subarray(i * 3, i * 3 + 3), i * 3);
      orbit[i] = i < count - orbitCount ? 0 : 1;
      seeds[i] = rand();
      // Corrientes que vienen de los bordes de la pantalla, en espiral hacia el símbolo.
      const angle = rand() * Math.PI * 2, r = 2.6 + rand() * 2.5;
      start[i * 3] = Math.cos(angle) * r + side * 1.4;
      start[i * 3 + 1] = Math.sin(angle) * r * 0.7;
      start[i * 3 + 2] = -2 - rand() * 4;
      const swirl = angle + Math.PI * 0.6;
      control[i * 3] = position[i * 3] + Math.cos(swirl) * 1.1;
      control[i * 3 + 1] = position[i * 3 + 1] + Math.sin(swirl) * 0.8;
      control[i * 3 + 2] = 0.6;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
    geometry.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
    geometry.setAttribute("aControl", new THREE.BufferAttribute(control, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute("aOrbit", new THREE.BufferAttribute(orbit, 1));
    this.material = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 }, uForm: { value: 0 }, uSize: { value: 16 }, uPixelRatio: { value: 1 }, uOpacity: { value: 0 },
        uColorA: { value: new THREE.Color("#8f8f8f") }, uColorB: { value: new THREE.Color("#ffffff") }, uLight: { value: 0 },
      },
    });
    this.points = new THREE.Points(geometry, this.material);
    this.points.frustumCulled = false;
  }
}
