"use client";

import { useState } from "react";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import FoliageCanvas from "./FoliageCanvas";
import type { FoliageVariant } from "./gl/foliage";
import {
  PRESETS,
  VARIANT_LABEL,
  VARIANT_NOTE,
  VARIANT_COST,
  type FoliageParams,
} from "./gl/params";

const VARIANTS: FoliageVariant[] = ["stretch", "sweep", "zoom"];

// Ruta del frame de referencia para el overlay de comparación. No viene con el
// repo (es una captura); si no está, el toggle lo dice en vez de mostrar un
// hueco roto.
const REFERENCE = "/prototype/ab9/hero-reference.png";

// Rango y paso de cada slider. Los topes NO son genéricos: están puestos donde
// el parámetro deja de tener sentido, para que arrastrar hasta el extremo siga
// dando una imagen y no un cuadro plano.
const SLIDERS: {
  key: keyof FoliageParams;
  label: string;
  min: number;
  max: number;
  step: number;
  hint: string;
}[] = [
  { key: "blur", label: "blur", min: 0, max: 8, step: 0.05, hint: "longitud del barrido — significa algo distinto en cada variante" },
  { key: "scale", label: "scale", min: 0.5, max: 8, step: 0.05, hint: "frecuencia del campo: cuánta hoja entra en pantalla" },
  { key: "curl", label: "curl", min: 0, max: 4, step: 0.02, hint: "cuánto se doblan las estrías respecto del radial recto" },
  { key: "curlScale", label: "curlScale", min: 0.2, max: 4, step: 0.02, hint: "tamaño de esa curvatura" },
  { key: "detail", label: "detail", min: 0, max: 1.5, step: 0.01, hint: "capa fina: las hojas legibles del borde derecho" },
  { key: "detailFall", label: "detailFall", min: 0.2, max: 5, step: 0.02, hint: "a qué distancia del foco muere el detalle" },
  { key: "focusX", label: "focusX", min: 0.5, max: 2.2, step: 0.01, hint: "centro de fuga en X (>1 = fuera del canvas)" },
  { key: "focusY", label: "focusY", min: -0.5, max: 1.5, step: 0.01, hint: "centro de fuga en Y" },
  { key: "contrast", label: "contrast", min: 0.2, max: 6, step: 0.02, hint: "relieve de las estrías (actúa sobre la desviación del campo)" },
  { key: "lift", label: "lift", min: -0.3, max: 0.3, step: 0.005, hint: "nivel medio del campo" },
  { key: "gradAngle", label: "gradAngle", min: -3.14, max: 3.14, step: 0.01, hint: "de dónde entra la luz, en radianes" },
  { key: "gradSpread", label: "gradSpread", min: 0.2, max: 3, step: 0.01, hint: "cuánto campo cubre el degradé maestro" },
  { key: "gradGamma", label: "gradGamma", min: 0.25, max: 4, step: 0.02, hint: "curva del degradé: <1 abre las luces, >1 las aprieta contra la esquina" },
  { key: "gradMix", label: "gradMix", min: 0, max: 1.6, step: 0.01, hint: "amplitud con la que el follaje abolla el degradé" },
  { key: "grain", label: "grain", min: 0, max: 0.2, step: 0.002, hint: "grano de película" },
  { key: "drift", label: "drift", min: 0, max: 4, step: 0.02, hint: "deriva temporal — 0 congela el cuadro" },
];

const SWATCHES: { key: keyof FoliageParams; label: string }[] = [
  { key: "c0", label: "luz" },
  { key: "c1", label: "salvia" },
  { key: "c2", label: "medio" },
  { key: "c3", label: "bosque" },
  { key: "c4", label: "sombra" },
];

// La copy del hero real de ab9. Va encima de las tres pruebas porque el shader
// es un FONDO: juzgarlo sin el texto que tiene que sostener es juzgar otra cosa.
function HeroCopy({ compact = false }: { compact?: boolean }) {
  return (
    <Container
      className={`relative z-[2] flex flex-col items-center justify-center text-center ${
        compact ? "gap-3" : "gap-6"
      }`}
    >
      <h1
        className={`text-pretty text-white ${compact ? "text-h3" : "text-display"}`}
        style={{ textShadow: "0 1px 30px rgba(0,0,0,.25)" }}
      >
        Own your <Accent display>world.</Accent>
      </h1>
      {!compact && (
        <p className="max-w-xl text-pretty text-body-lg text-white/85">
          Move cross-chain, trade perps, hold RWAs, stay confidential, and access
          all of DeFi from your own wallet.
        </p>
      )}
    </Container>
  );
}

export default function HeroAb9GLView() {
  const [mode, setMode] = useState<"compare" | "solo">("compare");
  const [active, setActive] = useState<FoliageVariant>("zoom");
  const [params, setParams] = useState<Record<FoliageVariant, FoliageParams>>(PRESETS);
  const [refOpacity, setRefOpacity] = useState(0);
  const [refMissing, setRefMissing] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  const current = params[active];

  const set = (key: keyof FoliageParams, value: number | string) =>
    setParams((prev) => ({ ...prev, [active]: { ...prev[active], [key]: value } }));

  // Aplica los valores de la variante activa a las otras dos. Sirve para
  // comparar TÉCNICA y no calibración: si cada panel diverge, la diferencia que
  // se ve deja de ser atribuible al shader.
  const syncAll = () =>
    setParams((prev) => {
      const src = prev[active];
      const out = {} as Record<FoliageVariant, FoliageParams>;
      for (const v of VARIANTS) {
        // `blur` se respeta por variante: el mismo número da tres intensidades
        // distintas, así que copiarlo desalinearía justamente lo que se compara.
        out[v] = v === active ? src : { ...src, blur: prev[v].blur };
      }
      return out;
    });

  const reset = () => setParams(PRESETS);

  const copyParams = () => {
    void navigator.clipboard?.writeText(JSON.stringify(current, null, 2));
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#07140f] pt-[var(--site-header-block)] text-white">
      {/* ── Barra de control ─────────────────────────────────────────────── */}
      <div className="z-40 flex shrink-0 flex-wrap items-center gap-3 border-b border-white/10 bg-[#07140f]/90 px-4 py-3 backdrop-blur">
        <span className="text-eyebrow-mono uppercase text-white/50">hero ab9 · gl</span>

        <div className="flex overflow-hidden rounded border border-white/15">
          {(["compare", "solo"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-caption-mono transition ${
                mode === m ? "bg-white text-[#07140f]" : "text-white/70 hover:bg-white/10"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex overflow-hidden rounded border border-white/15">
          {VARIANTS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setActive(v)}
              className={`px-3 py-1.5 text-caption-mono transition ${
                active === v ? "bg-white text-[#07140f]" : "text-white/70 hover:bg-white/10"
              }`}
            >
              {VARIANT_LABEL[v]}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-caption-mono text-white/60">
          ref
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={refOpacity}
            onChange={(e) => setRefOpacity(Number(e.target.value))}
            className="w-28 accent-white"
          />
          <span className="w-8 tabular-nums text-micro-mono">{refOpacity.toFixed(2)}</span>
        </label>

        <div className="ml-auto flex gap-2">
          <button type="button" onClick={syncAll} className="rounded border border-white/15 px-3 py-1.5 text-caption-mono text-white/70 hover:bg-white/10">
            sync→3
          </button>
          <button type="button" onClick={copyParams} className="rounded border border-white/15 px-3 py-1.5 text-caption-mono text-white/70 hover:bg-white/10">
            copy json
          </button>
          <button type="button" onClick={reset} className="rounded border border-white/15 px-3 py-1.5 text-caption-mono text-white/70 hover:bg-white/10">
            reset
          </button>
          <button type="button" onClick={() => setPanelOpen((o) => !o)} className="rounded border border-white/15 px-3 py-1.5 text-caption-mono text-white/70 hover:bg-white/10">
            {panelOpen ? "ocultar panel" : "panel"}
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="relative min-w-0 flex-1">
          {/* ── Comparación: las tres en columna, a la misma altura ──────── */}
          {mode === "compare" ? (
            <div className="grid h-full gap-px overflow-y-auto bg-white/10 md:grid-cols-3 md:overflow-visible">
              {VARIANTS.map((v) => (
                <div
                  key={v}
                  className="relative h-[42vh] min-h-[280px] cursor-pointer overflow-hidden md:h-full"
                  onClick={() => setActive(v)}
                >
                  <FoliageCanvas
                    variant={v}
                    params={params[v]}
                    className="absolute inset-0 h-full w-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <HeroCopy compact />
                  </div>
                  <div
                    className={`pointer-events-none absolute inset-0 border-2 transition ${
                      active === v ? "border-white/70" : "border-transparent"
                    }`}
                  />
                  <div className="absolute left-0 top-0 flex flex-col gap-1 p-3">
                    <span className="w-fit rounded bg-black/50 px-2 py-1 text-micro-mono backdrop-blur">
                      {VARIANT_LABEL[v]} · {VARIANT_COST[v]}
                    </span>
                    <span className="max-w-[28ch] rounded bg-black/40 px-2 py-1 text-micro-mono text-white/70 backdrop-blur">
                      {VARIANT_NOTE[v]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── Solo: la variante activa a pantalla completa ───────────── */
            <div className="relative h-full overflow-hidden">
              <FoliageCanvas
                variant={active}
                params={current}
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <HeroCopy />
              </div>
            </div>
          )}

          {/* Overlay de referencia, por encima de todo. `mix-blend-difference`
              no: para juzgar color hace falta ver el color. La comparación se
              hace subiendo y bajando la opacidad, que es como se detecta una
              diferencia de tono mucho mejor que con un diff aritmético. */}
          {refOpacity > 0 && !refMissing && (
            /* eslint-disable-next-line @next/next/no-img-element --
               next/image no aporta nada acá: el overlay es una captura local de
               un lab que no se despliega, se pinta a `object-cover` sobre el
               canvas y cambia de dimensiones con cada captura nueva — que es
               justo lo que `<Image />` obliga a declarar de antemano. */
            <img
              src={REFERENCE}
              alt=""
              onError={() => setRefMissing(true)}
              className="pointer-events-none absolute inset-0 z-30 h-full w-full object-cover"
              style={{ opacity: refOpacity }}
            />
          )}
          {refOpacity > 0 && refMissing && (
            <div className="pointer-events-none absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded bg-black/70 px-3 py-2 text-center text-xs backdrop-blur">
              Falta <code className="text-micro-mono">public{REFERENCE}</code> — guardá ahí el frame de
              referencia para superponerlo.
            </div>
          )}
        </div>

        {/* ── Panel ────────────────────────────────────────────────────────── */}
        {panelOpen && (
          <aside className="h-full w-[300px] shrink-0 overflow-y-auto border-l border-white/10 bg-[#07140f] p-4">
            <p className="mb-1 text-eyebrow-mono uppercase text-white/50">
              {VARIANT_LABEL[active]}
            </p>
            <p className="mb-4 text-micro-mono text-white/45">{VARIANT_NOTE[active]}</p>

            <div className="space-y-3">
              {SLIDERS.map((s) => (
                <label key={s.key} className="block" title={s.hint}>
                  <span className="mb-1 flex items-baseline justify-between text-micro-mono">
                    <span className="text-white/70">{s.label}</span>
                    <span className="tabular-nums text-white/45">
                      {(current[s.key] as number).toFixed(3)}
                    </span>
                  </span>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={current[s.key] as number}
                    onChange={(e) => set(s.key, Number(e.target.value))}
                    className="w-full accent-white"
                  />
                </label>
              ))}
            </div>

            <p className="mb-2 mt-6 text-eyebrow-mono uppercase text-white/50">paleta</p>
            <div className="space-y-2">
              {SWATCHES.map((sw) => (
                <label key={sw.key} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={current[sw.key] as string}
                    onChange={(e) => set(sw.key, e.target.value)}
                    className="h-7 w-10 cursor-pointer rounded border border-white/15 bg-transparent"
                  />
                  <span className="text-micro-mono text-white/60">{sw.label}</span>
                  <span className="ml-auto text-micro-mono tabular-nums text-white/35">
                    {current[sw.key] as string}
                  </span>
                </label>
              ))}
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
