"use client";

import { buildProgram, getGl2 } from "./glContext";
import { deviceRatio } from "./dpr";
import { GLYPH_SHINE_FRAGMENT, GLYPH_SHINE_VERTEX } from "./shaders/glyphShine";

export type GlyphShineOptions = {
  /** Los char-elements de SplitText de la línea completa, en orden de lectura.
   *  El índice de cada uno se hornea en la máscara (canal G) para que el
   *  frente de luz avance en ese orden y no en el eje X — ver el comentario
   *  del fragment shader. */
  chars: HTMLElement[];
  /** Ancestro `position:relative` contra el que se posiciona el canvas. */
  host: HTMLElement;
  /** Elemento cuyo box hay que vigilar para re-medir. Debe ser el bloque de
   *  texto real (no el canvas): su box cambia exactamente cuando la máscara
   *  queda inválida. */
  observe: HTMLElement;
  tint?: [number, number, number];
  intensity?: number;
  maxDpr?: number;
  /** Aire alrededor del bloque de texto, en fracción de em: da lugar al halo
   *  del spotlight y absorbe ascendentes/descendentes fuera del line-box. */
  padEm?: number;
};

export type GlyphShine = {
  /** Scroll-driven. Dibuja SINCRÓNICAMENTE, en el mismo tick que el tween.
   *  `f` es la posición del frente en espacio de ORDEN de lectura: 0 = primera
   *  letra, 1 = última. Admite (y espera) valores fuera de [0,1] — así el
   *  frente entra desde antes de la primera letra y sale después de la
   *  última, en vez de aparecer/desaparecer clavado en los extremos. */
  setFront: (f: number) => void;
  /** Mouse-driven. Fija el objetivo y agenda frames hasta convergir. */
  setPointer: (x: number, y: number) => void;
  /** Gate de viewport: false cancela el loop y descarta pedidos de frame. */
  setVisible: (v: boolean) => void;
  /** Re-mide el cluster, re-rasteriza la máscara y reubica el canvas. */
  remeasure: () => void;
  /** Reemplaza los glifos mascarados SIN recrear el contexto WebGL.
   *
   *  Existe para texto que cambia mientras el efecto está vivo (un campo de
   *  formulario). Recrear la instancia en cada tecla significaría compilar y
   *  linkear los shaders y pedir un contexto nuevo por keystroke — y Chrome
   *  mata contextos pasados los ~16 vivos.
   *
   *  Un array vacío es válido: apaga el canvas dejándolo en 0×0. */
  setChars: (chars: HTMLElement[]) => void;
  destroy: () => void;
};

const DEV = process.env.NODE_ENV !== "production";

/** Estilo de fuente resuelto de UN char. Se lee por carácter y no una sola vez
 *  para todo el bloque: un mismo shine puede abarcar varios elementos de
 *  heading, y nada garantiza que compartan tamaño o peso. */
type CharFont = { px: number; style: string; weight: string; family: string };

// Constante de tiempo del ease del spotlight, en segundos. Time-based (no
// "fracción por frame") para que a 120 Hz no vaya al doble de velocidad.
const POINTER_TAU = 0.085;
// Umbral de convergencia en unidades normalizadas de ventana: por debajo de
// esto el movimiento es sub-píxel y el loop se apaga.
const POINTER_EPS = 0.0006;

/**
 * Monta el glyph-shine sobre un <canvas> ya presente en el DOM, mascarado
 * exactamente a la silueta de `chars` (texto renderizado a una textura
 * offscreen — no `background-clip:text`, que no sobrevive un split por
 * caracteres).
 *
 * Devuelve `null` — sin lanzar, sin loguear en prod — si el navegador no da
 * WebGL2 utilizable. El reveal de opacidad del DOM (plano, sin WebGL) corre
 * igual: el shine es una capa aditiva, no un requisito.
 */
export function createGlyphShine(
  canvas: HTMLCanvasElement,
  {
    chars: initialChars,
    host,
    observe,
    tint = [0.34, 0.97, 0.72],
    intensity = 1.0,
    // Tope de 2 y no 3: la máscara cubre la línea de heading COMPLETA (2-3
    // renglones de texto display), así que a dpr 3 la textura se va a decenas
    // de MB por instancia sin ganancia visible — el shader además erosiona el
    // borde del glifo, que es donde la resolución extra se notaría.
    maxDpr = 2,
    padEm = 0.35,
  }: GlyphShineOptions
): GlyphShine | null {
  // Mutable: `setChars` la reemplaza sin recrear el contexto. Arrancar con un
  // array vacío es válido (un campo de texto todavía sin valor).
  let chars = initialChars;

  // El paso por dos variables no es redundante: el narrowing de un `const` que
  // sale de un `if (!x) return` NO sobrevive dentro de las clausuras que se
  // declaran más abajo, y este módulo usa `gl` en casi todas. Reasignarlo a un
  // `const` ya no-nulo sí.
  const glOrNull = getGl2(canvas);
  if (!glOrNull) {
    if (DEV) console.info("[glyphShine] sin WebGL2 utilizable — el shine no se monta.");
    return null;
  }
  const gl = glOrNull;

  const program = buildProgram(gl, GLYPH_SHINE_VERTEX, GLYPH_SHINE_FRAGMENT, "glyphShine");
  if (!program) return null;

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.useProgram(program);

  const uMask = gl.getUniformLocation(program, "uMask");
  const uFront = gl.getUniformLocation(program, "uFront");
  const uPointer = gl.getUniformLocation(program, "uPointer");
  const uResolution = gl.getUniformLocation(program, "uResolution");
  const uTint = gl.getUniformLocation(program, "uTint");
  const uIntensity = gl.getUniformLocation(program, "uIntensity");

  gl.uniform3f(uTint, tint[0], tint[1], tint[2]);
  gl.uniform1f(uIntensity, intensity);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND); // la composición la hace CSS (mix-blend-mode), no GL

  // ── Textura de máscara ──────────────────────────────────────────────────
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  // CLAMP_TO_EDGE es obligatorio: con REPEAT (el default) el halo del
  // spotlight que se sale por un borde reaparece del otro lado.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(uMask, 0);

  // Canvas 2D offscreen (nunca entra al DOM), reusado en cada remeasure.
  // `alpha:false` porque la cobertura viaja en el canal R sobre fondo negro
  // opaco: así el upload no toca nada de premultiplicado de alpha, y el
  // antialias del rasterizador de texto se conserva tal cual como gris.
  const mask = document.createElement("canvas");
  const mctxOrNull = mask.getContext("2d", { alpha: false });
  if (!mctxOrNull) {
    // Sin canvas 2D no hay máscara, así que no hay efecto. Se sueltan los
    // objetos GL ya creados, pero NO el contexto: el canvas puede volver a
    // usarse (ver getGl2 en ./glContext).
    gl.bindVertexArray(null);
    gl.deleteVertexArray(vao);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.deleteTexture(tex);
    gl.useProgram(null);
    gl.deleteProgram(program);
    return null;
  }
  // Nueva const ya no-nula: TS no preserva el narrowing de un `if (!x)
  // return` dentro de closures declaradas más abajo (rasterize/remeasure) —
  // mismo fix que gl en la factory anterior.
  const mctx = mctxOrNull;

  // ── Estado ──────────────────────────────────────────────────────────────
  let dead = false;
  let visible = true;
  let bufW = 0;
  let bufH = 0;
  // Arranca antes de la primera letra (no en 0), así el estado en reposo es
  // "el frente todavía no entró" y no "el frente está sobre la letra 1".
  let front = -1;

  const tgt = { x: 0.5, y: 0.5 };
  const cur = { x: 0.5, y: 0.5 };

  let rafId = 0;
  let lastT = 0;
  let roTimer: ReturnType<typeof setTimeout> | undefined;
  let sig = "";

  const onContextLost = (e: Event) => {
    // preventDefault habilita que el navegador PUEDA restaurar. No
    // reconstruimos: el efecto es decorativo y su ausencia es invisible
    // (negro + screen = identidad). Romperse hacia "nada" es lo correcto.
    e.preventDefault();
    dead = true;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    if (DEV) console.warn("[glyphShine] contexto WebGL perdido — el shine se apaga.");
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  // ── Draw ────────────────────────────────────────────────────────────────
  function draw() {
    if (dead || bufW === 0 || bufH === 0) return;
    gl.uniform1f(uFront, front);
    gl.uniform2f(uPointer, cur.x, cur.y);
    // Sin gl.clear(): el triángulo cubre el 100% del framebuffer.
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // ── RENDER ON DEMAND ────────────────────────────────────────────────────
  // Dos fuentes de frames con requisitos opuestos:
  //
  //  · SCROLL → `setFront` dibuja SINCRÓNICAMENTE desde el onUpdate del
  //    timeline. Sin rAF: así el draw ocurre en el mismo tick en que GSAP
  //    escribió el valor.
  //
  //  · MOUSE con el scroll quieto → hace falta un rAF. La clave es cómo se
  //    APAGA: no por un `setTimeout(stop, N ms)` sino por CONVERGENCIA del
  //    lerp. Cuando |target - current| cae bajo el umbral no queda nada
  //    nuevo que dibujar, así que no queda ningún rAF colgado. Un mouse
  //    quieto = cero frames.
  function tick(now: number) {
    rafId = 0;
    if (dead || !visible) {
      lastT = 0;
      return;
    }

    // dt real, con techo: si la pestaña estuvo en background el primer dt
    // sería enorme y el ease saltaría de golpe.
    const dt = lastT ? Math.min((now - lastT) / 1000, 0.05) : 1 / 60;
    lastT = now;

    const dx = tgt.x - cur.x;
    const dy = tgt.y - cur.y;
    const moving = Math.abs(dx) > POINTER_EPS || Math.abs(dy) > POINTER_EPS;

    if (moving) {
      const k = 1 - Math.exp(-dt / POINTER_TAU);
      cur.x += dx * k;
      cur.y += dy * k;
    } else {
      cur.x = tgt.x;
      cur.y = tgt.y;
      lastT = 0;
    }

    draw();
    if (moving) rafId = requestAnimationFrame(tick);
  }

  function requestFrame() {
    // El gate de visible se aplica ACÁ, no dentro del tick: un pedido de
    // frame con la sección fuera de pantalla no debe ni agendar el rAF.
    if (dead || !visible || rafId) return;
    rafId = requestAnimationFrame(tick);
  }

  // ── Máscara: texto → textura ────────────────────────────────────────────
  function rasterize(
    rects: DOMRect[],
    fonts: CharFont[],
    originX: number,
    originY: number,
    dpr: number
  ) {
    mctx.setTransform(1, 0, 0, 1, 0, 0);
    mctx.fillStyle = "#262626";
    mctx.fillRect(0, 0, mask.width, mask.height);

    mctx.textAlign = "left";
    mctx.textBaseline = "alphabetic";

    // Métricas de baseline por fuente, cacheadas: measureText es lo caro acá,
    // y en la práctica todos los chars comparten una o dos fuentes.
    const vmetrics = new Map<string, { asc: number; desc: number }>();
    let activeFont = "";

    // GLIFO POR GLIFO en la x que reportó el layout real, NO un fillText del
    // string completo. Dos razones:
    //   · SplitText ya puso cada glifo en su propio inline-block, o sea que
    //     el navegador YA desactivó kerning y ligaduras entre ellos. Un
    //     fillText del string completo SÍ aplicaría kerning y quedaría
    //     corrido.
    //   · Hace innecesario reproducir letter-spacing (-0.015em en
    //     --text-h1): ya está horneado en las posiciones. `ctx.letterSpacing`
    //     no existe en Safari < 17.4 ni Firefox < 126.
    //
    // El COLOR de cada glifo codifica su lugar en el bloque:
    //   R = 255                       → cobertura (lo que recorta la luz)
    //   G = round(i/(n-1) * 255)      → orden de lectura, 0 en la 1ª letra
    // El antialias del rasterizador multiplica AMBOS canales por el mismo
    // alpha (compositing sobre negro opaco), así que G/R en el shader devuelve
    // el orden intacto incluso en el borde del glifo. 256 niveles alcanzan de
    // sobra: un bloque de heading no pasa de ~100 caracteres.
    const last = Math.max(chars.length - 1, 1);

    for (let i = 0; i < chars.length; i++) {
      const text = chars[i].textContent;
      const r = rects[i];
      const f = fonts[i];
      if (!text || !r || !f || r.width === 0) continue;

      // Shorthand armado con los valores COMPUTADOS del char real: el clamp()
      // de --text-h2 ya está resuelto a px, el weight es el efectivo, y la
      // family es la que next/font generó — no un nombre adivinado que caería
      // en el fallback.
      const font = `${f.style} ${f.weight} ${f.px * dpr}px ${f.family}`;
      if (font !== activeFont) {
        mctx.font = font;
        activeFont = font;
      }

      let vm = vmetrics.get(font);
      if (!vm) {
        // Fallback proporcional si el navegador no expone fontBoundingBox*.
        const tm = mctx.measureText("Hxp");
        vm = {
          asc: Number.isFinite(tm.fontBoundingBoxAscent)
            ? tm.fontBoundingBoxAscent
            : f.px * dpr * 0.8,
          desc: Number.isFinite(tm.fontBoundingBoxDescent)
            ? tm.fontBoundingBoxDescent
            : f.px * dpr * 0.2,
        };
        vmetrics.set(font, vm);
      }

      mctx.fillStyle = `rgb(255,${Math.round((i / last) * 255)},0)`;

      const x = (r.left - originX) * dpr;
      // Baseline dentro de la caja del inline-block: half-leading + ascent.
      // Con line-height 1.1 el half-leading es chico o negativo — de ahí que
      // no alcance con textBaseline:"top".
      const y = (r.top - originY) * dpr + (r.height * dpr - (vm.asc + vm.desc)) / 2 + vm.asc;
      mctx.fillText(text, x, y);
    }
  }

  /** Apaga el canvas sin tocar el contexto: el efecto queda vivo, listo para
   *  volver a encenderse con el próximo setChars. */
  function blank() {
    bufW = 0;
    bufH = 0;
    sig = "";
    canvas.style.width = "0px";
    canvas.style.height = "0px";
  }

  function remeasure() {
    // El guard de `dead` es lo que hace inofensivos los callbacks asíncronos
    // tardíos (fonts.ready resolviendo después del desmontaje de StrictMode).
    if (dead) return;

    // Sin glifos no hay nada que mascarar (campo de texto vacío). `blank` y no
    // un `return` pelado: si antes había texto, el canvas se quedaría mostrando
    // el último frame rasterizado.
    if (chars.length === 0) {
      blank();
      return;
    }

    // TODAS las lecturas de layout primero, TODOS los writes después.
    const fonts: CharFont[] = chars.map((c) => {
      const cs = getComputedStyle(c);
      return {
        px: parseFloat(cs.fontSize) || 16,
        style: cs.fontStyle,
        weight: cs.fontWeight,
        family: cs.fontFamily,
      };
    });
    const rects = chars.map((c) => c.getBoundingClientRect());
    const hostRect = host.getBoundingClientRect();

    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    for (const cr of rects) {
      if (cr.width === 0 && cr.height === 0) continue;
      l = Math.min(l, cr.left);
      t = Math.min(t, cr.top);
      r = Math.max(r, cr.right);
      b = Math.max(b, cr.bottom);
    }
    if (!Number.isFinite(l) || r - l < 1 || b - t < 1) return;

    // El pad se dimensiona con la fuente MÁS GRANDE del bloque: es la que
    // define cuánto se sale un ascendente del bounding box de los chars.
    const fontPx = Math.max(...fonts.map((f) => f.px));
    const pad = padEm * fontPx;
    const dpr = deviceRatio(maxDpr);

    // SNAP A PÍXEL DE DISPOSITIVO del offset relativo al host. Si el canvas
    // cae en una posición fraccional, el compositor RESAMPLEA su bitmap: la
    // máscara sale borrosa y medio píxel corrida respecto al texto. El resto
    // fraccionario se traslada al dibujo de los glifos (originX/originY), así
    // que las letras siguen en su posición subpíxel real.
    const snap = (v: number) => Math.round(v * dpr) / dpr;
    const left = snap(l - hostRect.left - pad);
    const top = snap(t - hostRect.top - pad);
    const wCss = snap(r - l + pad * 2);
    const hCss = snap(b - t + pad * 2);

    const w = Math.max(1, Math.round(wCss * dpr));
    const h = Math.max(1, Math.round(hCss * dpr));

    // Rebuild-guard: durante un drag de resize el RO dispara por frame, pero
    // si nada relevante cambió no hay por qué re-rasterizar texto ni
    // re-subir la textura.
    const f0 = fonts[0];
    const nextSig = `${left}|${top}|${w}|${h}|${fontPx}|${f0.family}|${f0.weight}`;
    if (nextSig === sig) return;
    sig = nextSig;

    canvas.style.left = `${left}px`;
    canvas.style.top = `${top}px`;
    canvas.style.width = `${wCss}px`;
    canvas.style.height = `${hCss}px`;

    if (w !== bufW || h !== bufH) {
      bufW = w;
      bufH = h;
      canvas.width = w; // resetea el drawing buffer, NO el estado GL
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uResolution, w, h);
    }

    mask.width = w;
    mask.height = h;
    rasterize(rects, fonts, hostRect.left + left, hostRect.top + top, dpr);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // RGBA y no R8/RED: la conversión de un DOM source a un formato de un
    // solo canal no está bien definida en todos los drivers.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);

    draw();
  }

  // ── Cuándo regenerar la máscara ─────────────────────────────────────────
  // Se observa el bloque de texto, no el canvas: el canvas está fuera de flujo
  // y su box lo fijamos nosotros, así que observarlo sería un bucle. El bloque
  // cambia de box exactamente cuando la máscara queda inválida (font-size del
  // clamp(), wrapping, DPR).
  const ro = new ResizeObserver(() => {
    if (dead) return;
    clearTimeout(roTimer);
    roTimer = setTimeout(remeasure, 80);
  });
  try {
    ro.observe(observe, { box: "device-pixel-content-box" });
  } catch {
    ro.observe(observe);
  }

  // Primer render + segundo render tras la carga de fuente. `document.fonts.
  // ready` es imprescindible: montreal es next/font/local con display:"swap",
  // así que el primer paint usa la fallback — si rasterizamos antes de que el
  // woff2 esté listo, la máscara sale con los glifos de la fallback aunque
  // las posiciones ya vengan del layout correcto.
  remeasure();
  document.fonts?.ready.then(remeasure).catch(() => {});

  return {
    setFront(f: number) {
      front = f;
      draw();
    },
    setPointer(x: number, y: number) {
      tgt.x = x;
      tgt.y = y;
      requestFrame();
    },
    setVisible(v: boolean) {
      if (v === visible) return;
      visible = v;
      if (v) {
        // Al reentrar, snap del spotlight al último valor conocido: si el
        // mouse se movió mientras la sección estaba fuera de pantalla, no
        // queremos ver el ease "corriendo" hasta la posición nueva.
        cur.x = tgt.x;
        cur.y = tgt.y;
        lastT = 0;
        draw();
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        lastT = 0;
      }
    },
    remeasure,
    setChars(next: HTMLElement[]) {
      if (dead) return;
      chars = next;
      // Resetear `sig` es obligatorio, no una precaución: el rebuild-guard
      // compara geometría y fuente, y al editar texto el box puede quedar
      // IDÉNTICO con contenido distinto (reemplazar una letra por otra del
      // mismo ancho). Sin esto, remeasure saldría temprano y la máscara
      // quedaría mostrando el texto anterior.
      sig = "";
      remeasure();
    },
    destroy() {
      clearTimeout(roTimer);
      ro.disconnect();
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      canvas.removeEventListener("webglcontextlost", onContextLost);

      // El canvas SIGUE en el DOM (React lo renderiza): si el teardown no
      // fue un unmount sino un cambio en vivo de prefers-reduced-motion, hay
      // que devolverlo a 0x0 para no dejar un rectángulo colgado.
      canvas.style.width = "0px";
      canvas.style.height = "0px";

      if (dead) return;
      dead = true;

      // Se sueltan los objetos GL de ESTA instancia, pero el contexto queda
      // vivo y cacheado contra el canvas — ver getGl2 en ./glContext. Perderlo
      // acá rompía el segundo montaje de StrictMode, que reusa el mismo
      // <canvas>: sobre un contexto perdido el link falla sin ningún mensaje, y
      // como acá el reveal por opacidad sigue funcionando, el único síntoma era
      // que el brillo no aparecía.
      gl.bindVertexArray(null);
      gl.deleteVertexArray(vao);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.deleteTexture(tex);
      gl.useProgram(null);
      gl.deleteProgram(program);

      // El canvas NO se reduce a 1×1: lo haría inservible para el remount, que
      // lo reusa. Las dimensiones CSS ya se pusieron en 0 arriba.
      mask.width = 1;
      mask.height = 1;
    },
  };
}
