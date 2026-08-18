"use client";

import { useEffect, useRef, useState } from "react";

// El burst del mockup, reconstruido alrededor de la idea correcta (de
// Lawrence): EL DEGRADÉ ES LA OBRA. Un espectro de 5 paradas (editable en el
// panel) se indexa con un campo de distancia DISTORSIONADO — anisotropía
// horizontal + lóbulos angulares — y la coordenada del espectro lleva ondas
// que viajan HACIA AFUERA del eje central, a izquierda y derecha. Eso es lo
// que "crea la forma": las bandas del degradé curvándose por el campo.
//
// El espejo del plano de suelo sigue siendo un abs() en la vertical con
// compresión + oscurecido leve. El scroll acelera la fase igual que antes
// (integrada en CPU, subida rápida / decaimiento lento). Render a media
// resolución con DPR capado (el contenido es blur puro), pausa fuera de
// viewport, y con reduced-motion pinta un solo frame.

const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_phase;    // fase integrada → las ondas del espectro
uniform float u_time;
uniform float u_horizon;
uniform float u_squash;   // anisotropía: <1 estira el campo a lo ancho
uniform float u_beamFreq; // lóbulos angulares que distorsionan los contornos
uniform float u_beamAmp;
uniform float u_spread;   // cuánto campo cubre el espectro completo
uniform float u_flowFreq; // frecuencia de las ondas viajeras
uniform float u_flowAmp;
uniform float u_contrast; // curva sobre la coordenada del espectro
uniform float u_groundDim;
uniform float u_grain;
uniform vec3 u_c0; // centro (blanco)
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;
uniform vec3 u_c4; // borde

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec3 ramp(float t){
  t = clamp(t, 0., 1.);
  if (t < .25) return mix(u_c0, u_c1, t / .25);
  if (t < .5)  return mix(u_c1, u_c2, (t - .25) / .25);
  if (t < .75) return mix(u_c2, u_c3, (t - .5) / .25);
  return mix(u_c3, u_c4, (t - .75) / .25);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2((uv.x - .5) * aspect, uv.y - u_horizon);

  float below = step(p.y, 0.);
  float y = abs(p.y);
  y = mix(y, y * 1.2, below);            // reflejo apenas comprimido

  // Campo base: distancia anisotrópica — la x comprimida hace que los
  // contornos se ESTIREN a lo ancho del horizonte.
  float x = p.x * u_squash;
  float rA = length(vec2(x, y));

  // Distorsión angular: lóbulos suaves que ondulan los contornos (las alas).
  float a = atan(abs(p.x), y + .04);     // simétrico izq/der
  float lobes = cos(a * u_beamFreq + .35 * sin(u_time * .1));
  float s = rA * (1. + u_beamAmp * lobes * exp(-rA * .8));

  // Las ONDAS del espectro viajando hacia afuera: la coordenada del degradé
  // se modula con senoidales cuya fase crece — las bandas fluyen del centro
  // a los costados, deformadas por el mismo campo.
  s += u_flowAmp * sin(s * u_flowFreq - u_phase * 3.5)
     + u_flowAmp * .6 * sin(s * u_flowFreq * 1.9 - u_phase * 5.2 + 1.3);

  // Banda de horizonte: tira la coordenada a 0 (= la parada blanca) en una
  // franja fina que se abre desde el centro.
  float band = exp(-y * 13.) * exp(-abs(p.x) * .8);
  float t = s * u_spread - band * .55;

  // Curva de contraste sobre la coordenada (no sobre el color): aprieta las
  // transiciones sin ensuciar las paradas elegidas.
  t = pow(clamp(t, 0., 1.), u_contrast);

  vec3 col = ramp(t);

  col *= 1. - below * u_groundDim * smoothstep(0., .45, y);
  col += (hash(gl_FragCoord.xy + u_time) - .5) * u_grain;

  gl_FragColor = vec4(col, 1.);
}
`;

type Params = {
  baseSpeed: number;
  scrollBoost: number;
  maxBoost: number;
  squash: number;
  beamFreq: number;
  beamAmp: number;
  spread: number;
  flowFreq: number;
  flowAmp: number;
  contrast: number;
  groundDim: number;
  horizon: number;
  grain: number;
  paused: boolean;
  colors: [string, string, string, string, string];
};

const DEFAULTS: Params = {
  baseSpeed: 0.18,
  scrollBoost: 1.6,
  maxBoost: 3.5,
  squash: 0.5,
  beamFreq: 5,
  beamAmp: 0.35,
  spread: 1.1,
  flowFreq: 7,
  flowAmp: 0.09,
  contrast: 1.0,
  groundDim: 0.18,
  horizon: 0.5,
  grain: 0.02,
  paused: false,
  // El espectro del mock: blanco → mint → verde → teal profundo → aqua pálido.
  colors: ["#fbfffd", "#a9f2cd", "#2fd39b", "#2aa79e", "#bfe3dc"],
};

const SLIDERS: [keyof Params, string, number, number, number][] = [
  ["baseSpeed", "base speed", 0, 0.6, 0.01],
  ["scrollBoost", "scroll boost", 0, 6, 0.1],
  ["maxBoost", "max boost", 0.5, 10, 0.1],
  ["squash", "h-stretch", 0.2, 1.2, 0.02],
  ["beamFreq", "lobes", 1, 12, 0.5],
  ["beamAmp", "lobe amp", 0, 0.9, 0.02],
  ["spread", "spread", 0.4, 2.5, 0.05],
  ["flowFreq", "wave freq", 1, 18, 0.5],
  ["flowAmp", "wave amp", 0, 0.3, 0.005],
  ["contrast", "contrast", 0.4, 2.6, 0.05],
  ["groundDim", "ground dim", 0, 0.8, 0.02],
  ["horizon", "horizon", 0.35, 0.65, 0.01],
  ["grain", "grain", 0, 0.08, 0.005],
];

const hexToRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
];

export default function HeroBurstGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef<Params>({ ...DEFAULTS });
  const [params, setParams] = useState<Params>({ ...DEFAULTS });
  const [showPanel, setShowPanel] = useState(true);

  const set = (patch: Partial<Params>) => {
    const next = { ...paramsRef.current, ...patch } as Params;
    paramsRef.current = next;
    setParams(next);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, depth: false });
    if (!gl) return; // sin WebGL queda el degradé estático del div de atrás

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("u_res"), uPhase = U("u_phase"), uTime = U("u_time"),
      uHorizon = U("u_horizon"), uSquash = U("u_squash"), uBeamFreq = U("u_beamFreq"),
      uBeamAmp = U("u_beamAmp"), uSpread = U("u_spread"), uFlowFreq = U("u_flowFreq"),
      uFlowAmp = U("u_flowAmp"), uContrast = U("u_contrast"),
      uGroundDim = U("u_groundDim"), uGrain = U("u_grain"),
      uC = [U("u_c0"), U("u_c1"), U("u_c2"), U("u_c3"), U("u_c4")];

    // Media resolución + DPR capado: contenido borroso, nadie ve la
    // diferencia y el fill-rate cae a ~un cuarto.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr * 0.5);
      canvas.height = Math.round(canvas.clientHeight * dpr * 0.5);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let phase = 0;
    let boost = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;
    let visible = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frame = (now: number) => {
      const dt = Math.min((now - lastT) / 1000, 0.1);
      lastT = now;
      const p = paramsRef.current;

      // Velocidad de scroll → boost: sube casi instantáneo, decae suave.
      const y = window.scrollY;
      const v = Math.abs(y - lastY) / Math.max(dt, 1e-4); // px/s
      lastY = y;
      const target = Math.min((v / 1200) * p.scrollBoost, p.maxBoost);
      boost += (target - boost) * (target > boost ? 0.5 : 0.06);

      if (!p.paused) phase += dt * (p.baseSpeed + boost);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uPhase, phase);
      gl.uniform1f(uTime, now / 1000);
      gl.uniform1f(uHorizon, p.horizon);
      gl.uniform1f(uSquash, p.squash);
      gl.uniform1f(uBeamFreq, p.beamFreq);
      gl.uniform1f(uBeamAmp, p.beamAmp);
      gl.uniform1f(uSpread, p.spread);
      gl.uniform1f(uFlowFreq, p.flowFreq);
      gl.uniform1f(uFlowAmp, p.flowAmp);
      gl.uniform1f(uContrast, p.contrast);
      gl.uniform1f(uGroundDim, p.groundDim);
      gl.uniform1f(uGrain, p.grain);
      p.colors.forEach((c, i) => gl.uniform3f(uC[i], ...hexToRgb(c)));
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reduced && visible) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (!reduced && visible && !was) {
        lastT = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <>
      {/* Fallback/SSR: degradé quieto en la misma familia para el primer
          paint y el mundo sin WebGL. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, #f4fbf7 0%, #a9ecd2 30%, #7fdcc4 55%, #bfe6dc 100%)",
        }}
      />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />

      {/* Panel de tuning (solo del prototipo). No usa la escala del DS y no
          debería: es instrumental, vive fuera del sitio y su tamaño está elegido
          para estorbar lo menos posible encima del canvas, no para leerse.
          ds-exempt: panel de debug del prototipo, no UI del sitio */}
      <div className="fixed right-4 top-24 z-50 w-60 rounded-xl bg-black/85 p-3 font-mono text-[11px] text-white/85 backdrop-blur">
        <button
          type="button"
          // ds-exempt: ídem, panel de debug
          className="mb-1 w-full text-left font-bold"
          onClick={() => setShowPanel((s) => !s)}
        >
          burst tuning {showPanel ? "▾" : "▸"}
        </button>
        {showPanel && (
          <div className="flex flex-col gap-1.5">
            {/* El espectro: 5 paradas, del CENTRO (izq) al BORDE (der). Este
                degradé es literalmente el que dibuja el fondo. */}
            <div className="flex items-center gap-1">
              <span className="w-20 shrink-0">spectrum</span>
              {params.colors.map((c, i) => (
                <input
                  key={i}
                  type="color"
                  value={c}
                  onChange={(e) => {
                    const colors = [...paramsRef.current.colors] as Params["colors"];
                    colors[i] = e.target.value;
                    set({ colors });
                  }}
                  className="h-6 w-full cursor-pointer border-0 bg-transparent p-0"
                />
              ))}
            </div>
            <div
              className="h-2 rounded"
              style={{ background: `linear-gradient(to right, ${params.colors.join(", ")})` }}
            />
            {SLIDERS.map(([k, label, min, max, step]) => (
              <label key={k} className="flex items-center justify-between gap-2">
                <span className="w-20 shrink-0">{label}</span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={params[k] as number}
                  onChange={(e) => set({ [k]: parseFloat(e.target.value) } as Partial<Params>)}
                  className="w-full"
                />
                <span className="w-8 text-right">{(params[k] as number).toFixed(2)}</span>
              </label>
            ))}
            <label className="mt-1 flex items-center gap-2">
              <input
                type="checkbox"
                checked={params.paused}
                onChange={(e) => set({ paused: e.target.checked })}
              />
              pause flow
            </label>
          </div>
        )}
      </div>
    </>
  );
}
