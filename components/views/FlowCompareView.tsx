"use client";

import { useEffect, useRef, useState } from "react";
import UnicornScene from "unicornstudio-react/next";
import Container from "@/components/primitives/Container";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { subscribePointer } from "@/components/primitives/motion/pointer";
import { createFlowField, type FlowFieldColors } from "@/components/primitives/motion/flowField";

// Sandbox de comparación: el campo de flujo de este repo contra el mismo efecto
// servido por el SDK de Unicorn Studio, al lado.
//
// Vive en /prototype/flow-compare y no en la homepage a propósito: carga un
// script de terceros, y así queda contenido en una ruta noindex en vez de
// entrar al bundle de todas las páginas.

// Espeja las paletas de components/sections/LatestUpdates.tsx. Está duplicado
// porque es un sandbox — si divergen no rompe nada de producción.
const PALETTES: { label: string; colors: FlowFieldColors }[] = [
  {
    label: "cyan · verde · amarillo",
    colors: [
      [0.498, 0.878, 0.816],
      [0.302, 0.91, 0.561],
      [0.91, 0.91, 0.533],
      [0.659, 0.659, 0.627],
    ],
  },
  {
    label: "azules",
    colors: [
      [0.498, 0.816, 0.961],
      [0.373, 0.722, 0.961],
      [0.647, 0.863, 0.976],
      [0.804, 0.816, 0.855],
    ],
  },
  {
    label: "verdes",
    colors: [
      [0.525, 0.898, 0.71],
      [0.278, 0.902, 0.541],
      [0.859, 0.906, 0.518],
      [0.616, 0.647, 0.616],
    ],
  },
];

// ── Un panel con el efecto de este repo ──────────────────────────────────────
// useEffect plano y no useGsapContext: acá no se crean tweens que dejen estilos
// inline pegados, solo un contexto WebGL y un callback del ticker. Un
// gsap.context no aportaría nada que este cleanup no haga.
function OwnPane({ colors, className }: { colors: FlowFieldColors; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const field = createFlowField(canvas, { colors });
    setOk(field !== null);
    if (!field) return;

    const state = { hover: 0, x: 0.5, y: 0.5 };
    const push = () => {
      field.setHover(state.hover);
      field.setMouse(state.x, state.y);
    };

    const tick = (t: number) => {
      field.setTime(t);
      field.render();
    };
    gsap.ticker.add(tick);

    let unsubscribe: (() => void) | null = null;
    const onEnter = () => {
      gsap.to(state, { hover: 1, duration: 0.5, ease: "power2.out", overwrite: "auto", onUpdate: push });
      unsubscribe?.();
      unsubscribe = subscribePointer((px, py) => {
        const r = canvas.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        state.x = (px * window.innerWidth - r.left) / r.width;
        state.y = (py * window.innerHeight - r.top) / r.height;
        push();
      });
    };
    const onLeave = () => {
      unsubscribe?.();
      unsubscribe = null;
      gsap.to(state, {
        hover: 0, x: 0.5, y: 0.5,
        duration: 0.9, ease: "power2.out", overwrite: "auto", onUpdate: push,
      });
    };

    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
      unsubscribe?.();
      gsap.killTweensOf(state);
      gsap.ticker.remove(tick);
      field.destroy();
    };
  }, [colors]);

  // El texto de estado va FUERA de la caja con aspect-ratio: adentro le sumaría
  // su alto al ratio y los dos paneles dejarían de medir lo mismo.
  return (
    <div className="flex flex-col">
      <div className={className}>
        <canvas ref={ref} className="h-full w-full rounded-2xl" />
      </div>
      {ok === false && (
        <p className="mt-2 text-caption text-red-600">
          Sin WebGL2 utilizable — en la sección real acá se vería el fallback CSS.
        </p>
      )}
    </div>
  );
}

// ── El panel del SDK de Unicorn Studio ───────────────────────────────────────
//
// El SDK viene adentro de `unicornstudio-react`, un wrapper de la comunidad
// (MIT) que empaqueta el runtime propietario de Unicorn. Es la única vía que
// funciona con esta escena: el CDN suelto de Unicorn
// (cdn.unicorn.studio/vX/unicornStudio.umd.js) llega hasta v1.4.2, y este export
// es formato 2.2.8 — la versión del paquete de npm coincide exactamente con la
// del JSON.
//
// Es la misma escena que pinta el primer cover de LatestUpdates, y a propósito:
// esta página compara el material propio contra lo que está de verdad en la
// home, no contra un export suelto. La genera scripts/unicorn-scenes.mjs.
const SCENE = "/unicorn-scene-green.json";

function UnicornPane({ className }: { className?: string }) {
  const [status, setStatus] = useState("cargando…");
  const [detail, setDetail] = useState<string | null>(null);
  const [hasScene, setHasScene] = useState<boolean | null>(null);

  useEffect(() => {
    // Se chequea antes de montar el componente para poder dar un mensaje útil
    // en vez del error genérico del SDK.
    fetch(SCENE, { method: "HEAD" })
      .then((r) => setHasScene(r.ok))
      .catch(() => setHasScene(false));
  }, []);

  if (hasScene === null) {
    return <div className={`rounded-2xl bg-neutral-200 ${className ?? ""}`} />;
  }

  if (!hasScene) {
    return (
      <div className={`overflow-hidden rounded-2xl bg-neutral-200 ${className ?? ""}`}>
        <div className="flex h-full w-full items-center justify-center p-6">
          <p className="text-body-sm text-pretty text-center text-muted-foreground">
            Falta <code className="font-mono">public/unicorn-scene-green.json</code>.
            Corré <code className="font-mono">node scripts/unicorn-scenes.mjs</code>{" "}
            para generarla.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className={`relative overflow-hidden rounded-2xl bg-neutral-200 ${className ?? ""}`}>
        {/* El `absolute inset-0` no es decorativo: es lo que corta la
            realimentación de tamaño. El runtime de Unicorn mide su contenedor y
            dimensiona el canvas a partir de eso; con el canvas EN FLUJO dentro
            de una caja cuya altura sale del contenido, cada medición agranda la
            caja y la siguiente lee la caja ya crecida — la página se estira sin
            parar, que es exactamente lo que pasaba. Sacado del flujo, el canvas
            no puede empujar a su padre y el aspect-ratio manda. */}
        <div className="absolute inset-0">
          <UnicornScene
            jsonFilePath={SCENE}
            width="100%"
            height="100%"
            dpi={1.5}
            scale={1}
            fps={60}
            onLoad={() => {
              setStatus("ok");
              setDetail(null);
            }}
            onError={(e: Error) => {
              setStatus("falló");
              setDetail(e.message);
            }}
          />
        </div>
      </div>
      <p className="mt-2 text-caption text-muted-foreground">
        SDK:{" "}
        <span className={status === "ok" ? "text-near-green-dark" : "text-foreground"}>
          {status}
        </span>
        {detail && <span className="block text-red-600">{detail}</span>}
      </p>
    </div>
  );
}

// ── La página ────────────────────────────────────────────────────────────────

export default function FlowCompareView() {
  return (
    <main className="bg-cream text-foreground">
      <Container className="flex flex-col gap-12 py-16">
        <header className="flex flex-col gap-3">
          <h1 className="text-h2">Flow field · comparación</h1>
          <p className="text-body max-w-3xl text-pretty text-muted-foreground">
            Izquierda: el campo de flujo reimplementado en este repo (WebGL2 crudo, sin
            dependencias, base de color procedural). Derecha: el mismo efecto servido por el
            SDK de Unicorn Studio, cuya base de color es un JPG de su CDN. Pasá el mouse por
            encima de los dos.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col">
            <h2 className="mb-3 text-h4">Este repo</h2>
            <OwnPane colors={PALETTES[0]!.colors} className="aspect-[16/10] w-full" />
          </div>
          <div className="flex flex-col">
            <h2 className="mb-3 text-h4">Unicorn Studio</h2>
            <UnicornPane className="aspect-[16/10] w-full" />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-h4">Las 3 paletas, al tamaño real de las cards</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PALETTES.map((p) => (
              <div key={p.label} className="flex flex-col">
                <OwnPane colors={p.colors} className="aspect-[7/6] w-full" />
                <p className="mt-2 text-caption text-muted-foreground">{p.label}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
