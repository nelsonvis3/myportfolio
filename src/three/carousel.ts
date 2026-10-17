import * as THREE from "three";

/** Carrusel de proyectos: cada proyecto es la captura de escritorio en un panel curvo con la de celular
 * flotando delante, con profundidad real (al girar se ve el paralaje entre las dos). Los paneles se arman
 * desde las partículas al entrar, se inclinan con la velocidad del giro y se reflejan en el piso.
 * El texto se muestra en HTML, no en WebGL. */

export interface ProjectInfo { id: string; name: string; sub: string; img: string; phone: string }

const vertexShader = /* glsl */ `
  uniform float uBend;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.z -= p.x * p.x * uBend;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uImageAspect, uPanelAspect, uOpacity, uFocus, uHover, uReady, uTime;
  uniform float uRadius, uFrame, uTop, uReveal, uSweep, uReflect, uSeed;
  uniform vec3 uAccent, uBase;
  varying vec2 vUv;
  float roundBox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  void main() {
    vec2 q = (vUv - 0.5) * vec2(uPanelAspect, 1.0);
    float d = roundBox(q, vec2(uPanelAspect, 1.0) * 0.5, uRadius);
    float mask = 1.0 - smoothstep(-0.003, 0.002, d);
    if (mask < 0.01) discard;
    // Entrada: el panel se arma desde un ruido, con un borde de luz donde está apareciendo.
    float n = noise(q * 14.0 + uSeed) * 0.6 + noise(q * 42.0 - uSeed) * 0.4;
    float cut = uReveal * 1.25 - 0.12;
    if (n > cut) discard;
    float rim = smoothstep(0.05, 0.0, cut - n) * step(uReveal, 0.999);
    // Ajuste "cover" de la captura; en el celular, anclada arriba (la captura es la página entera).
    vec2 uv = vUv - 0.5;
    if (uImageAspect > uPanelAspect) uv.x *= uPanelAspect / uImageAspect;
    else { uv.y *= uImageAspect / uPanelAspect; uv.y += uTop * (0.5 - 0.5 * uImageAspect / uPanelAspect); }
    uv += 0.5;
    vec3 image = texture2D(uMap, uv).rgb;
    vec3 color = mix(uBase, mix(uBase, image, uReady), mix(0.42, 1.0, uFocus) + uHover * 0.08);
    // Marco del celular.
    float bezel = smoothstep(-uFrame - 0.002, -uFrame, d) * step(0.0001, uFrame);
    color = mix(color, vec3(0.04), bezel);
    // Barrido de luz cuando el proyecto llega al frente, y un brillo suave que se mueve.
    float diag = (vUv.x + vUv.y * 0.45) / 1.45;
    float sweep = smoothstep(0.11, 0.0, abs(diag - (uSweep * 1.5 - 0.25))) * step(0.0, uSweep) * step(uSweep, 1.0);
    float sheen = smoothstep(0.35, 0.0, abs(vUv.y + vUv.x * 0.35 - 0.8 - sin(uTime * 0.3) * 0.15)) * 0.05 * uFocus;
    float edge = smoothstep(0.012, 0.0, abs(d + 0.004));
    color += uAccent * (edge * mix(0.2, 0.8, uFocus) + rim * 2.2) + sheen + sweep * 0.32;
    float alpha = mask * uOpacity;
    // Reflejo en el piso: más fuerte cerca del borde que toca el piso y se apaga hacia abajo.
    alpha *= mix(1.0, 0.14 * (1.0 - smoothstep(0.0, 0.42, vUv.y)), uReflect);
    gl_FragColor = vec4(color, alpha);
  }
`;

type Panel = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
interface Item { pivot: THREE.Group; desk: Panel; phone: Panel; mirrors: Panel[]; sweepStart: number; wasFront: boolean }

function material(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader, fragmentShader, transparent: true, side: THREE.DoubleSide, depthWrite: false,
    uniforms: {
      uMap: { value: null }, uImageAspect: { value: 1.6 }, uPanelAspect: { value: 1.6 }, uOpacity: { value: 0 },
      uFocus: { value: 0 }, uHover: { value: 0 }, uReady: { value: 0 }, uTime: { value: 0 }, uBend: { value: 0 },
      uRadius: { value: 0.035 }, uFrame: { value: 0 }, uTop: { value: 0 }, uReveal: { value: 0 }, uSweep: { value: -1 },
      uReflect: { value: 0 }, uSeed: { value: Math.random() * 50 },
      uAccent: { value: new THREE.Color("#ffffff") }, uBase: { value: new THREE.Color("#0a0a0a") },
    },
  });
}

export class Carousel {
  readonly group = new THREE.Group();
  /** Lo que se puede tocar o señalar: panel de escritorio y celular de cada proyecto. */
  readonly targets: Panel[] = [];
  readonly step: number;
  private readonly items: Item[] = [];
  width = 2.4;
  height = 1.5;
  radius = 2.2;

  constructor(readonly projects: ProjectInfo[], maxAnisotropy: number, reflections: boolean) {
    this.step = (Math.PI * 2) / projects.length;
    const loader = new THREE.TextureLoader();
    const load = (src: string, panels: Panel[]) => loader.load(src, texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = maxAnisotropy;
      const image = texture.image as { width: number; height: number };
      for (const panel of panels) {
        const u = panel.material.uniforms;
        u.uMap.value = texture; u.uImageAspect.value = image.width / image.height; u.uReady.value = 1;
      }
    });
    projects.forEach((project, index) => {
      const pivot = new THREE.Group();
      const desk: Panel = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 40, 1), material());
      const phone: Panel = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material());
      Object.assign(phone.material.uniforms, { uRadius: { value: 0.07 }, uFrame: { value: 0.022 }, uTop: { value: 1 } });
      desk.userData.index = phone.userData.index = index;
      pivot.add(desk, phone);
      // Reflejo: copias espejadas debajo del piso (solo en pantallas grandes).
      const mirrors: Panel[] = [];
      if (reflections) for (const source of [desk, phone]) {
        const mirror: Panel = new THREE.Mesh(source.geometry, material());
        Object.assign(mirror.material.uniforms, { uReflect: { value: 1 }, uRadius: source.material.uniforms.uRadius, uFrame: source.material.uniforms.uFrame, uTop: source.material.uniforms.uTop });
        mirror.scale.y = -1;
        mirror.userData.source = source;
        mirrors.push(mirror);
        pivot.add(mirror);
      }
      load(project.img, [desk, ...mirrors.slice(0, 1)]);
      load(project.phone, [phone, ...mirrors.slice(1)]);
      this.items.push({ pivot, desk, phone, mirrors, sweepStart: -10, wasFront: false });
      this.targets.push(desk, phone);
      this.group.add(pivot);
    });
  }

  resize(width: number, height: number, radius: number): void {
    this.width = width; this.height = height; this.radius = radius;
    const phoneH = height * 0.86, phoneW = phoneH * (390 / 844);
    for (const { desk, phone, mirrors } of this.items) {
      desk.geometry.dispose();
      desk.geometry = new THREE.PlaneGeometry(width, height, 40, 1);
      phone.geometry.dispose();
      phone.geometry = new THREE.PlaneGeometry(phoneW, phoneH);
      desk.material.uniforms.uPanelAspect.value = width / height;
      desk.material.uniforms.uBend.value = 0.09 / width;
      phone.material.uniforms.uPanelAspect.value = phoneW / phoneH;
      // El celular, adelante y a la derecha, un poco más abajo que la pantalla.
      phone.position.set(width * 0.38, -height * 0.16, 0.34);
      phone.rotation.y = -0.16;
      const floor = phone.position.y - phoneH / 2 - 0.05;
      for (const mirror of mirrors) {
        const source = mirror.userData.source as Panel;
        mirror.geometry = source.geometry;
        Object.assign(mirror.material.uniforms, { uPanelAspect: source.material.uniforms.uPanelAspect, uBend: source.material.uniforms.uBend });
        mirror.position.set(source.position.x, 2 * floor - source.position.y, source.position.z);
        mirror.rotation.y = source.rotation.y;
      }
    }
  }

  /** rotation: giro del anillo; velocity: rad/s (inclina los paneles); reveal: 0-1 aparición desde las partículas. */
  update(rotation: number, velocity: number, opacity: number, reveal: number, hovered: number, time: number): void {
    const lean = THREE.MathUtils.clamp(velocity, -3, 3);
    this.items.forEach((item, i) => {
      const angle = i * this.step + rotation;
      const facing = Math.cos(angle);
      item.pivot.position.set(Math.sin(angle) * this.radius, 0, Math.cos(angle) * this.radius);
      // Periódico en el ángulo (después de una vuelta entera vuelve derecho) y con inclinación según la velocidad.
      item.pivot.rotation.set(0, Math.sin(angle) * 0.4 + lean * 0.1, -lean * 0.025);
      const focus = Math.pow(Math.max(0, facing), 3);
      // Al llegar al frente: barrido de luz y el celular se adelanta.
      const front = focus > 0.92;
      if (front && !item.wasFront) item.sweepStart = time;
      item.wasFront = front;
      const sweep = (time - item.sweepStart) / 0.9;
      const zoom = this.height * 0.16 * focus;
      item.phone.position.z = 0.34 + zoom;
      const order = Math.round(facing * 100);
      item.desk.renderOrder = order;
      item.phone.renderOrder = order + 1;
      const deskOpacity = opacity * (0.55 + 0.45 * (facing * 0.5 + 0.5));
      // Los celulares de los paneles de atrás se apagan para no ensuciar el frente.
      const phoneOpacity = opacity * THREE.MathUtils.smoothstep(facing, -0.3, 0.55);
      for (const [panel, alpha] of [[item.desk, deskOpacity], [item.phone, phoneOpacity]] as const) {
        const u = panel.material.uniforms;
        u.uFocus.value = focus;
        u.uOpacity.value = alpha;
        u.uReveal.value = reveal;
        u.uSweep.value = sweep;
        u.uTime.value = time;
        u.uHover.value += ((hovered === i ? 1 : 0) - u.uHover.value) * 0.15;
      }
      for (const mirror of item.mirrors) {
        const source = mirror.userData.source as Panel, s = source.material.uniforms, u = mirror.material.uniforms;
        mirror.position.z = source.position.z;
        u.uFocus.value = s.uFocus.value; u.uOpacity.value = s.uOpacity.value; u.uReveal.value = reveal; u.uTime.value = time;
        mirror.renderOrder = order - 300;
      }
    });
  }

  setTheme(light: boolean): void {
    for (const item of this.items) for (const panel of [item.desk, item.phone, ...item.mirrors]) {
      panel.material.uniforms.uAccent.value.set(light ? "#000000" : "#ffffff");
      panel.material.uniforms.uBase.value.set(light ? "#f2f2f2" : "#0a0a0a");
    }
  }

  /** Índice del panel que mira a la cámara para un giro dado. */
  frontIndex(rotation: number): number {
    const n = this.items.length;
    return ((Math.round(-rotation / this.step) % n) + n) % n;
  }

  /** Cuánto hay que girar para traer el panel `index` al frente por el camino más corto. */
  deltaTo(index: number, rotation: number): number {
    let delta = -(index * this.step + rotation);
    delta = Math.atan2(Math.sin(delta), Math.cos(delta));
    return delta;
  }
}
