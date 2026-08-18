"use client";

import { useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";
import { gsap, ScrollTrigger } from "@/components/primitives/motion/gsapClient";
import { MQ } from "@/components/primitives/motion/motionTokens";
import { onViewportToggle } from "@/components/primitives/motion/pauseOffscreen";
import { createVideoScrub } from "@/components/primitives/motion/videoScrub";

// El motor de la versión 06 · Cutout. Canvas 2D + el clip de v5.
//
// ── Qué hace distinto del hero de v5 ────────────────────────────────────────
//
// v5 pone el video a pantalla completa y el titular encima. Acá el video se ve
// SOLO DENTRO de los glifos: el canvas dibuja el frame, y después borra todo lo
// que cae fuera del texto con `destination-in`. El resultado es un titular de
// vidrio con el descenso pasando por dentro, sobre crema liso.
//
// Es el mismo asset, el mismo scrub y el mismo `fps` medido. Lo que cambia es
// dónde vive la imagen — y de paso resuelve la queja de peso: el clip ya no
// tiene que verse nítido a pantalla completa, porque nunca se ve a pantalla
// completa.
//
// ── El recorte, en cuatro pasos ─────────────────────────────────────────────
//
//   1. se pinta un gradiente de respaldo,
//   2. encima el frame del video, en modo cover, SI ya hay uno decodificado,
//   3. `globalCompositeOperation = "destination-in"`,
//   4. se dibuja el texto (o las columnas): lo que queda es la intersección.
//
// El paso 1 es lo que evita el modo de fallo obvio: sin él, mientras el video
// no ha decodificado su primer frame el titular es un agujero — y con el clip
// de 19MB ese "mientras" es largo. Con el respaldo, el titular está siempre
// lleno y lo que llega después es la imagen.

export type CutoutTarget = "text" | "bars";

export type CutoutCanvasProps = {
  /** Las líneas del titular a recortar. Solo para `target="text"`. */
  lines?: readonly string[];
  target?: CutoutTarget;
  /** Alto de la tipografía como fracción del alto del host. */
  fontScale?: number;
  /** Cuántas columnas recorta el modo "bars". */
  cols?: number;
  src: string;
  poster: string;
  /** fps del asset, medido con ffprobe. No hay forma de leerlo del navegador. */
  fps: number;
  /** Gradiente que llena el recorte hasta que el video decodifica. */
  fill: string;
  /**
   * Tinte multiplicado sobre el frame, para asentar los valores claros del
   * clip. `null` deja el video tal cual.
   */
  tint?: string | null;
};

// El clip de v5 es un descenso continuo de 8s. Los mismos valores de
// persecución que usa `home-ab7/HeroVideo`, y por la misma razón: están
// calibrados contra ESTE clip, no son un default genérico.
const CHASE = 0.14;
const CHASE_DOCKING = 0.09;

export default function CutoutCanvas({
  lines = [],
  target = "text",
  fontScale = 0.19,
  cols = 7,
  src,
  poster,
  fps,
  fill,
  tint = null,
}: CutoutCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!host || !canvas || !video) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    // El gradiente de respaldo se construye una vez por resize, no por frame:
    // `createLinearGradient` asigna un objeto y esto corre 60 veces por segundo.
    let backdrop: CanvasGradient | string = fill;

    const buildBackdrop = (h: number) => {
      // `fill` llega como una lista de paradas "offset color, offset color".
      // Un `background-image` de CSS no se puede pasar a un canvas, así que el
      // formato es propio y mínimo — dos o tres paradas, que es lo único que
      // este respaldo necesita.
      const stops = fill.split(",").map((s) => s.trim().split(/\s+/));
      const g = ctx2d.createLinearGradient(0, 0, 0, h);
      for (const [offset, color] of stops) g.addColorStop(parseFloat(offset), color);
      backdrop = g;
    };

    // ── La máscara, en UN canvas aparte ──────────────────────────────────
    //
    // Esto no es una optimización: es el único orden que funciona, y la primera
    // versión lo tenía mal.
    //
    // `destination-in` es una operación de composición COMPLETA sobre el canvas
    // — conserva el destino solo donde la fuente es opaca, y borra todo lo
    // demás. Aplicada por cada primitiva, se encadena: el primer `fillText`
    // recorta a "Own your", y el segundo recorta ESE RESULTADO a "world.". Como
    // las dos líneas no se solapan, la intersección es vacía y el canvas queda
    // transparente. En modo "bars" pasaba igual con las siete columnas.
    //
    // El síntoma era exactamente "el hero se ve en blanco": el respaldo y el
    // video se pintaban bien y el recorte los borraba enteros.
    //
    // La máscara se arma entonces en su propio canvas, con todas sus primitivas
    // en `source-over` —donde sí se suman— y el recorte es UN solo `drawImage`.
    //
    // Efecto lateral bueno: la máscara solo depende del tamaño y de la fuente,
    // así que se construye en el resize y NO en cada frame. El texto deja de
    // rasterizarse 60 veces por segundo.
    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d");

    const buildMask = (w: number, h: number) => {
      if (!maskCtx) return;
      maskCanvas.width = w;
      maskCanvas.height = h;
      maskCtx.clearRect(0, 0, w, h);
      maskCtx.fillStyle = "#000";

      if (target === "bars") {
        // Las siete columnas, con la silueta en V invertida — la misma de las
        // versiones 01 y 05, y por lo mismo: el centro despejado es donde va el
        // texto de la sección.
        const colW = w / cols;
        for (let i = 0; i < cols; i++) {
          const fromCenter = Math.abs(i - (cols - 1) / 2) / ((cols - 1) / 2);
          const barH = h * (0.16 + 0.6 * fromCenter * fromCenter);
          maskCtx.fillRect(i * colW, h - barH, colW, barH);
        }
        return;
      }

      const style = getComputedStyle(host);
      const size = h * fontScale;
      // La familia y el peso salen del computed del host, que hereda del design
      // system. Hardcodear "Montreal" sería una segunda fuente para la
      // tipografía y caería a Helvetica en silencio el día que el DS cambie.
      maskCtx.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
      maskCtx.textAlign = "center";
      maskCtx.textBaseline = "middle";
      const lh = size * 1.05;
      const top = h / 2 - ((lines.length - 1) * lh) / 2;
      lines.forEach((line, i) => maskCtx.fillText(line, w / 2, top + i * lh));
    };

    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx2d.setTransform(1, 0, 0, 1, 0, 0);
      ctx2d.globalCompositeOperation = "source-over";
      ctx2d.clearRect(0, 0, w, h);

      // 1 · respaldo
      ctx2d.fillStyle = backdrop;
      ctx2d.fillRect(0, 0, w, h);

      // 2 · el frame, en cover. `readyState >= 2` es HAVE_CURRENT_DATA: por
      // debajo de eso `drawImage` no lanza pero pinta el frame anterior, o nada.
      if (video.readyState >= 2 && video.videoWidth > 0) {
        const scale = Math.max(w / video.videoWidth, h / video.videoHeight);
        const dw = video.videoWidth * scale;
        const dh = video.videoHeight * scale;
        ctx2d.drawImage(video, (w - dw) / 2, (h - dh) / 2, dw, dh);
      }

      // 2b · el tinte
      //
      // El clip son slabs de vidrio muy claros: recortado a los glifos sobre
      // crema, el titular queda en 1.2:1 de contraste y "Own your" —el tramo
      // más brillante— desaparece. Este `multiply` baja los valores altos sin
      // tocar los oscuros, así que el descenso sigue leyéndose como imagen y no
      // como un texto teñido de un color plano.
      //
      // Va antes del recorte y no después: aplicado después teñiría también los
      // bordes antialiaseados de la máscara, y el glifo quedaría con un halo.
      if (tint) {
        ctx2d.globalCompositeOperation = "multiply";
        ctx2d.fillStyle = tint;
        ctx2d.fillRect(0, 0, w, h);
      }

      // 3 + 4 · el recorte, en UNA sola operación
      ctx2d.globalCompositeOperation = "destination-in";
      ctx2d.drawImage(maskCanvas, 0, 0);
      ctx2d.globalCompositeOperation = "source-over";
    };

    const resize = () => {
      const dpr = deviceRatio();
      const w = Math.max(1, Math.round(host.clientWidth * dpr));
      const h = Math.max(1, Math.round(host.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      buildBackdrop(h);
      buildMask(w, h);
    };

    resize();
    draw();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const scrub = createVideoScrub(video, { fps, chase: CHASE, chaseDocking: CHASE_DOCKING });
        const tick = () => draw();
        let running = false;

        const gate = onViewportToggle(host, (visible) => {
          if (visible === running) return;
          running = visible;
          if (visible) gsap.ticker.add(tick);
          else gsap.ticker.remove(tick);
        }, 1);

        // Solo LEE el progreso y se lo pasa al scrub, que administra sus propios
        // seeks. Sin scrub de GSAP y sin pin: dos suavizados encadenados sobre
        // el mismo valor se pelean, y el de `videoScrub` ya está calibrado
        // contra este clip.
        const st = ScrollTrigger.create({
          trigger: host,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => scrub.setProgress(self.progress),
        });

        // Un frame apenas hay imagen: sin esto, el titular se queda con el
        // respaldo hasta que el lector scrollee, aunque el video ya esté listo.
        const onReady = () => draw();
        video.addEventListener("loadeddata", onReady);

        return () => {
          video.removeEventListener("loadeddata", onReady);
          gsap.ticker.remove(tick);
          st.kill();
          gate.kill();
          scrub.destroy();
        };
      });

      // Con reduced-motion no hay scrub ni ticker: queda el póster, que el
      // <video> ya muestra, y un frame dibujado. El titular se ve recortado y
      // quieto — que es exactamente lo que se pidió al pedir menos movimiento.
      mm.add(MQ.reduce, () => {
        draw();
      });

      return () => mm.revert();
    }, host);

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(host);

    // La máscara se remuestrea cuando llega la fuente real. `draw()` solo no
    // alcanza: la máscara es una imagen ya rasterizada, así que redibujar sin
    // reconstruirla conserva la silueta de la fuente de sistema hasta el
    // próximo resize.
    document.fonts.ready.then(() => {
      buildMask(canvas.width, canvas.height);
      draw();
    });

    return () => {
      ro.disconnect();
      ctx.revert();
    };
  }, [lines, target, fontScale, cols, src, poster, fps, fill, tint]);

  return (
    <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* El <video> NO se muestra: es la fuente de píxeles del canvas. Va con
          `sr-only`-como-posición (1px fuera de vista) y no con `display: none`,
          porque un elemento sin caja no decodifica en todos los navegadores y
          `drawImage` sobre él devuelve un frame vacío.

          `preload="metadata"` y no `auto`: son 19MB. Con `metadata` baja la
          cabecera —suficiente para armar el scrub— y el resto lo pide por
          rangos HTTP a medida que hace seek. */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0"
      />
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
