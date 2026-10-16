import * as THREE from "three";

/** Cerebro de partículas a partir de la malla cortical fsaverage5 (ver /models/README.txt).
 * Cada partícula tiene dos destinos: su lugar en el cerebro y su lugar en el túnel
 * que se forma cuando el cerebro se expande al hacer scroll. */

async function bin(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`No se pudo cargar ${url}`);
  return response.arrayBuffer();
}

interface Cortex { vertices: Float32Array; indices: Uint16Array; folds: Float32Array }

async function loadCortex(): Promise<Cortex> {
  const [data, foldData] = await Promise.all([bin("/models/cortex.bin"), bin("/models/folds.bin")]);
  const view = new DataView(data);
  const count = view.getUint32(0, true), indexCount = view.getUint32(4, true);
  const packed = new Int16Array(data, 8, count * 6);
  const vertices = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let k = 0; k < 3; k++) vertices[i * 3 + k] = packed[i * 6 + k] / 20000;
  const indices = new Uint16Array(data, 8 + count * 12, indexCount);
  const foldCount = new DataView(foldData).getUint32(0, true);
  const foldPacked = new Int16Array(foldData, 4, foldCount * 6);
  const folds = new Float32Array(foldCount * 3);
  for (let i = 0; i < foldCount; i++) for (let k = 0; k < 3; k++) folds[i * 3 + k] = foldPacked[i * 6 + k] / 20000;
  return { vertices, indices, folds };
}

// Generador determinista: el cerebro se ve igual en cada visita.
function random(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const vertexShader = /* glsl */ `
  attribute vec3 aScatter;
  attribute float aSeed;
  attribute float aFold;
  uniform float uTime, uExpand, uSize, uPixelRatio, uOpacity, uLight;
  uniform vec3 uColorA, uColorB;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 brain = position * (1.0 + sin(uTime * 0.9 + aSeed * 6.2831 + position.y * 4.0) * 0.008);
    float e = clamp(uExpand * 1.35 - aSeed * 0.35, 0.0, 1.0);
    e = e * e * (3.0 - 2.0 * e);
    // Túnel: después de la expansión las partículas avanzan hacia la cámara y vuelven al fondo.
    vec3 tunnel = aScatter;
    tunnel.z = -1.6 - mod(-aScatter.z - 1.6 - uTime * 0.7, 17.0);
    vec3 p = mix(brain, tunnel, e);
    float swirl = e * (1.0 - e) * (aSeed - 0.5) * 5.0;
    p.xy = mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl)) * p.xy;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    float burst = e * (1.0 - e) * 4.0;
    float size = (1.0 + burst * 1.4) * uSize * mix(0.55, 1.05, aFold) * (0.6 + aSeed * 0.8) * mix(1.0, 2.1, e);
    gl_PointSize = clamp(size * mix(1.0, 0.7, uLight) * uPixelRatio / max(depth, 0.05), 0.0, mix(42.0, 18.0, uLight) * uPixelRatio);
    float pulse = pow(0.5 + 0.5 * sin(position.y * 6.0 - position.z * 3.0 - uTime * 1.1), 12.0);
    vColor = mix(uColorA, uColorB, clamp(aFold * 0.7 + pulse * aFold, 0.0, 1.0));
    vAlpha = uOpacity * mix(0.38, 0.95, aFold) * smoothstep(0.15, 0.9, depth) * (1.0 - smoothstep(13.0, 18.0, depth) * e) * (1.0 + burst * 0.8) * (1.0 + pulse * aFold * 0.6) * mix(1.0, 0.85, uLight);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.18, 0.0, d);
    float a = (glow * glow * 0.55 + core * 0.6) * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

export interface BrainPoints { points: THREE.Points; material: THREE.ShaderMaterial }

export async function createBrain(mobile: boolean): Promise<BrainPoints> {
  const { vertices, indices, folds } = await loadCortex();
  const rand = random(17);

  // Centrar y normalizar a radio 1.
  const box = new THREE.Box3().setFromArray(vertices);
  const center = box.getCenter(new THREE.Vector3());
  let radius = 0;
  for (let i = 0; i < vertices.length; i += 3) {
    radius = Math.max(radius, Math.hypot(vertices[i] - center.x, vertices[i + 1] - center.y, vertices[i + 2] - center.z));
  }

  const surfaceSamples = mobile ? 7000 : 20000;
  const foldStride = mobile ? 2 : 1;
  const foldTotal = Math.ceil(folds.length / 3 / foldStride);
  const vertexStride = mobile ? 2 : 1;
  const vertexTotal = Math.ceil(vertices.length / 3 / vertexStride);
  const total = surfaceSamples + foldTotal + vertexTotal;

  const position = new Float32Array(total * 3), scatter = new Float32Array(total * 3);
  const seed = new Float32Array(total), fold = new Float32Array(total);
  let n = 0;
  const push = (x: number, y: number, z: number, isFold: number) => {
    position[n * 3] = (x - center.x) / radius; position[n * 3 + 1] = (y - center.y) / radius; position[n * 3 + 2] = (z - center.z) / radius;
    seed[n] = rand(); fold[n] = isFold; n++;
  };

  // Muestras sobre la superficie, proporcionales al área de cada triángulo.
  const triangles = indices.length / 3, areas = new Float32Array(triangles);
  let areaSum = 0;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let t = 0; t < triangles; t++) {
    a.fromArray(vertices, indices[t * 3] * 3); b.fromArray(vertices, indices[t * 3 + 1] * 3); c.fromArray(vertices, indices[t * 3 + 2] * 3);
    areaSum += b.sub(a).cross(c.sub(a)).length() / 2; areas[t] = areaSum;
  }
  for (let s = 0; s < surfaceSamples; s++) {
    const target = rand() * areaSum;
    let lo = 0, hi = triangles - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (areas[mid] < target) lo = mid + 1; else hi = mid; }
    let u = rand(), v = rand(); if (u + v > 1) { u = 1 - u; v = 1 - v; }
    const i0 = indices[lo * 3] * 3, i1 = indices[lo * 3 + 1] * 3, i2 = indices[lo * 3 + 2] * 3;
    const w = 1 - u - v;
    push(vertices[i0] * w + vertices[i1] * u + vertices[i2] * v, vertices[i0 + 1] * w + vertices[i1 + 1] * u + vertices[i2 + 1] * v, vertices[i0 + 2] * w + vertices[i1 + 2] * u + vertices[i2 + 2] * v, 0);
  }
  for (let i = 0; i < folds.length / 3; i += foldStride) push(folds[i * 3], folds[i * 3 + 1], folds[i * 3 + 2], 1);
  for (let i = 0; i < vertices.length / 3; i += vertexStride) push(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2], 0.45);

  // Destino del túnel: cada partícula sale en la dirección de su posición y se reparte
  // alrededor del eje de la cámara, por delante de ella.
  for (let i = 0; i < n; i++) {
    const x = position[i * 3], y = position[i * 3 + 1];
    const angle = Math.atan2(y, x) + (rand() - 0.5) * 0.9;
    const r = 1.1 + Math.pow(rand(), 1.5) * 4.2;
    scatter[i * 3] = Math.cos(angle) * r;
    scatter[i * 3 + 1] = Math.sin(angle) * r * 0.72;
    scatter[i * 3 + 2] = -1.6 - rand() * 17;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position.subarray(0, n * 3), 3));
  geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatter.subarray(0, n * 3), 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed.subarray(0, n), 1));
  geometry.setAttribute("aFold", new THREE.BufferAttribute(fold.subarray(0, n), 1));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40);

  const material = new THREE.ShaderMaterial({
    vertexShader, fragmentShader, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uExpand: { value: 0 }, uSize: { value: mobile ? 26 : 22 }, uPixelRatio: { value: 1 }, uOpacity: { value: 1 },
      uColorA: { value: new THREE.Color("#8f8f8f") }, uColorB: { value: new THREE.Color("#ffffff") }, uLight: { value: 0 },
    },
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return { points, material };
}
