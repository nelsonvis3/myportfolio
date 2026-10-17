import * as THREE from "three";

/** Carrusel de proyectos: paneles curvos con la captura real de cada proyecto,
 * repartidos en un anillo que gira. El texto se muestra en HTML, no en WebGL. */

export interface ProjectInfo { id: string; name: string; sub: string; img: string; video: string | null; poster: string | null }

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
  uniform vec3 uAccent, uBase;
  varying vec2 vUv;
  float roundBox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
  void main() {
    vec2 q = (vUv - 0.5) * vec2(uPanelAspect, 1.0);
    float d = roundBox(q, vec2(uPanelAspect, 1.0) * 0.5, 0.035);
    float mask = 1.0 - smoothstep(-0.003, 0.002, d);
    if (mask < 0.01) discard;
    // Ajuste "cover" de la captura al panel.
    vec2 uv = vUv - 0.5;
    if (uImageAspect > uPanelAspect) uv.x *= uPanelAspect / uImageAspect; else uv.y *= uImageAspect / uPanelAspect;
    uv += 0.5;
    vec3 image = texture2D(uMap, uv).rgb;
    vec3 base = mix(uBase, image, uReady);
    float light = mix(0.42, 1.0, uFocus) + uHover * 0.08;
    // Fuera de foco el panel se funde con el fondo: oscurece en tema oscuro y aclara en el claro.
    vec3 color = mix(uBase, base, light);
    float sheen = smoothstep(0.35, 0.0, abs(vUv.y + vUv.x * 0.35 - 0.8 - sin(uTime * 0.3) * 0.15)) * 0.06 * uFocus;
    float edge = smoothstep(0.012, 0.0, abs(d + 0.004));
    color += uAccent * edge * mix(0.25, 0.9, uFocus) + sheen;
    if (!gl_FrontFacing) color = uBase + uAccent * edge * 0.3;
    gl_FragColor = vec4(color, mask * uOpacity);
  }
`;

interface Slot { material: THREE.ShaderMaterial; video: HTMLVideoElement | null; poster: THREE.Texture | null; frames: THREE.VideoTexture | null }

export class Carousel {
  readonly group = new THREE.Group();
  readonly panels: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>[] = [];
  readonly step: number;
  private readonly slots: Slot[] = [];
  width = 2.4;
  height = 1.5;
  radius = 2.2;

  constructor(readonly projects: ProjectInfo[], maxAnisotropy: number) {
    this.step = (Math.PI * 2) / projects.length;
    const loader = new THREE.TextureLoader();
    projects.forEach(project => {
      const material = new THREE.ShaderMaterial({
        vertexShader, fragmentShader, transparent: true, side: THREE.DoubleSide, depthWrite: false,
        uniforms: {
          uMap: { value: null }, uImageAspect: { value: 1.6 }, uPanelAspect: { value: 1.6 }, uOpacity: { value: 0 },
          uFocus: { value: 0 }, uHover: { value: 0 }, uReady: { value: 0 }, uTime: { value: 0 }, uBend: { value: 0.06 },
          uAccent: { value: new THREE.Color("#ffffff") }, uBase: { value: new THREE.Color("#0a0a0a") },
        },
      });
      const slot: Slot = { material, video: null, poster: null, frames: null };
      // El póster es el primer cuadro del video: mismo encuadre y proporción, sin salto al cambiar.
      loader.load(project.poster ?? project.img, texture => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = maxAnisotropy;
        slot.poster = texture;
        if (material.uniforms.uMap.value === null) this.show(slot, texture);
      });
      // Video de Hyperframes: reemplaza al póster recién cuando el navegador entrega un cuadro.
      // Una VideoTexture sin cuadros se ve negra (al arrancar, mientras carga o si el video se traba).
      if (project.video) {
        const video = document.createElement("video");
        // preload "none": cada video se descarga recién cuando su panel llega al frente y se reproduce.
        Object.assign(video, { src: project.video, muted: true, loop: true, playsInline: true, preload: "none", crossOrigin: "anonymous" });
        const onFrame = () => {
          if (video.paused) return;
          slot.frames ??= Object.assign(new THREE.VideoTexture(video), { colorSpace: THREE.SRGBColorSpace });
          slot.frames.needsUpdate = true;
          this.show(slot, slot.frames);
        };
        video.addEventListener("playing", () => {
          if (typeof video.requestVideoFrameCallback === "function") video.requestVideoFrameCallback(onFrame);
          else video.addEventListener("timeupdate", onFrame, { once: true });
        });
        slot.video = video;
      }
      this.slots.push(slot);
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 40, 1), material);
      mesh.userData.index = this.panels.length;
      this.panels.push(mesh);
      this.group.add(mesh);
    });
  }

  private show(slot: Slot, texture: THREE.Texture): void {
    const image = texture.image as { width?: number; height?: number; videoWidth?: number; videoHeight?: number };
    const u = slot.material.uniforms;
    u.uMap.value = texture;
    u.uImageAspect.value = (image.videoWidth || image.width || 16) / (image.videoHeight || image.height || 10);
    u.uReady.value = 1;
  }

  resize(width: number, height: number, radius: number): void {
    this.width = width; this.height = height; this.radius = radius;
    for (const panel of this.panels) {
      panel.geometry.dispose();
      panel.geometry = new THREE.PlaneGeometry(width, height, 40, 1);
      panel.material.uniforms.uPanelAspect.value = width / height;
      panel.material.uniforms.uBend.value = 0.09 / width;
    }
  }

  /** rotation: giro total del anillo; opacity: 0-1; hovered: índice o -1. */
  update(rotation: number, opacity: number, hovered: number, time: number): void {
    this.panels.forEach((panel, i) => {
      const angle = i * this.step + rotation;
      const facing = Math.cos(angle);
      panel.position.set(Math.sin(angle) * this.radius, 0, Math.cos(angle) * this.radius);
      // Periódico en el ángulo: después de una vuelta entera el panel vuelve al frente derecho.
      // Con `angle * 0.38` el giro acumulado lo dejaba de espaldas y se veía un panel liso.
      panel.rotation.y = Math.sin(angle) * 0.4;
      const focus = Math.pow(Math.max(0, facing), 3);
      const u = panel.material.uniforms;
      u.uFocus.value = focus;
      u.uOpacity.value = opacity * (0.55 + 0.45 * (facing * 0.5 + 0.5));
      u.uHover.value += ((hovered === i ? 1 : 0) - u.uHover.value) * 0.15;
      u.uTime.value = time;
      panel.renderOrder = Math.round(facing * 100);
    });
  }

  /** Reproduce solo el video del panel del frente (index = -1 pausa todos). */
  play(index: number): void {
    this.slots.forEach((slot, i) => {
      const video = slot.video;
      if (!video) return;
      if (i === index) { if (video.paused) void video.play().catch(() => {}); }
      else if (!video.paused) {
        // Al salir del frente vuelve al póster (el primer cuadro) y el video al inicio:
        // la próxima vez arranca igual que el póster y no queda un cuadro viejo ni uno vacío.
        video.pause();
        video.currentTime = 0;
        if (slot.poster) this.show(slot, slot.poster);
      }
    });
  }

  setTheme(light: boolean): void {
    for (const panel of this.panels) {
      panel.material.uniforms.uAccent.value.set(light ? "#000000" : "#ffffff");
      panel.material.uniforms.uBase.value.set(light ? "#f2f2f2" : "#0a0a0a");
    }
  }

  /** Índice del panel que mira a la cámara para un giro dado. */
  frontIndex(rotation: number): number {
    const n = this.panels.length;
    return ((Math.round(-rotation / this.step) % n) + n) % n;
  }

  /** Cuánto hay que girar para traer el panel `index` al frente por el camino más corto. */
  deltaTo(index: number, rotation: number): number {
    let delta = -(index * this.step + rotation);
    delta = Math.atan2(Math.sin(delta), Math.cos(delta));
    return delta;
  }
}
