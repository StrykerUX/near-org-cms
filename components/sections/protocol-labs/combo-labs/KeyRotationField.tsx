"use client";

import { useEffect, useRef } from "react";
import { deviceRatio } from "@/components/primitives/motion/dpr";

// La superficie de rotación de claves — el fondo del hero como un mecanismo del
// protocolo, no como una textura.
//
// ── Qué se ve ──────────────────────────────────────────────────────────────
//
// Una retícula densa de caracteres monoespaciados, muy tenue. Cada tantos
// segundos un frente verde cruza el plano en una sola pasada y **todos los
// glifos cambian de alfabeto a su paso**. Ni una celda se mueve de lugar: cambia
// lo que dice, no dónde está.
//
// Sembradas entre el ruido hay dos clases de palabras, y la diferencia entre
// ellas es el argumento entero de esta superficie:
//
//   · **Los esquemas de firma** —ED25519, SECP256K1, ML-DSA, FIPS-204— cambian
//     en cada rotación junto con el resto del campo.
//   · **Las cuentas** —alice.near, agent.near, vault.near— **no cambian nunca**.
//     El frente les pasa por encima y quedan idénticas.
//
// ── De dónde sale ─────────────────────────────────────────────────────────
//
// Sección 8, textual: *«NEAR accounts are decoupled from cryptography, so
// upgrading to quantum-safe keys takes a single key rotation. NEAR supports
// FIPS-204 (ML-DSA), a NIST-approved post-quantum signing scheme.»*
//
// Las tres cosas que dice esa frase están en el dibujo: la criptografía cambia,
// la cuenta no, y pasa **en una sola pasada**. No hay licencia ni metáfora — el
// fondo hace lo que el párrafo afirma.
//
// Y no hay que inventar una vuelta atrás: rotar es una operación repetible, así
// que cada pasada estrena un alfabeto nuevo en vez de alternar entre dos
// estados.
//
// ── El puntero ────────────────────────────────────────────────────────────
//
// Dos gestos, y ninguno es decoración: los dos dicen lo mismo que el párrafo.
//
//   · **Mover** revuelve el ruido bajo el cursor y lo enciende en verde. Es
//     material criptográfico reescribiéndose donde pasa la mano — y las cuentas
//     que caen dentro del halo **no se inmutan**, que es el argumento otra vez y
//     ahora provocado por el lector en vez de mostrado.
//   · **Hacer clic** dispara la rotación **desde ese punto**, en un frente
//     radial. La pasada automática es diagonal; la que dispara el lector sale de
//     su mano.
//
// El ruido se revuelve, los esquemas y las cuentas no. Revolver una palabra
// legible la destruye, y lo que sostiene la superficie es justamente que haya
// algo estable entre el ruido.
//
// Los eventos se escuchan en la SECCIÓN, no en el canvas. El canvas vive en
// `z-0` debajo del titular, del cuerpo y del marcador de cifras: escuchando en
// él, el puntero sólo respondería en los huecos entre bloques de texto. Va con
// `pointer-events-none` para no robarle nada al contenido, y las coordenadas se
// traducen con `getBoundingClientRect()`.
//
// Un clic sobre un enlace o un botón no dispara nada: el CTA del hero está
// dentro de la zona de escucha y disparar la rotación al salir de la página es
// ruido, no interacción.
//
// ── Por qué es tipografía y nada más ──────────────────────────────────────
//
// El intento anterior en este mismo hero dibujaba regiones, rellenos y un
// tramado, y sobre crema quedó sucio: cajas de valor bajo detrás de un titular
// y de un marcador de cifras compiten con los dos. Acá no hay una sola forma —
// sólo texto a un alfa muy bajo, en el mismo registro mono con el que está
// rotulada toda la página. Lo único con presencia es el frente y el halo del
// cursor, y los dos son verdes: el color no está de adorno, marca exactamente
// dónde está pasando algo.
//
// ── Los dos verdes, y por qué no es uno solo ──────────────────────────────
//
// `--near-green-accent` (#00dc8d) es el verde de la marca y no llega a 3:1 sobre
// crema: a cuerpo de texto desaparece. `--green-ink` (#00a86b) es el que sí se
// lee sobre claro.
//
// Acá se usan los dos, y la división no es estética: **el núcleo del frente va
// en el verde de marca** —es un destello de un cuarto de segundo, no texto que
// haya que leer, así que puede permitirse el que brilla— y **todo lo que tiene
// que leerse va en `--green-ink`**: las cuentas, la cola del frente y el halo.
// Es la misma distinción que `globals.css` documenta entre esos dos tokens.
//
// ── Parentesco con `GlyphField` ───────────────────────────────────────────
//
// Comparte la técnica —retícula de caracteres en canvas, celda estable, alfa
// bajo— con `opening-labs/GlyphField`, que sirve a las aperturas E y G. No lo
// reusa: aquél tiene una onda diagonal que enciende y apaga glifos fijos, y éste
// tiene un evento que los reescribe. Meterle la rotación a `GlyphField` la
// metería también en E y G, que no la piden.

const CELL = 15;

// Los alfabetos. Cada rotación estrena uno: cambiar de charset es lo que hace
// que la pasada se VEA, más que el cambio de glifo individual.
const CHARSETS = [
  "0123456789ABCDEF",
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZ",
  "0123456789abcdef",
  "+/=·:—0123456789",
];

// Los esquemas de firma rotan con el campo. Los dos primeros son las claves de
// hoy; los dos siguientes, el esquema post-cuántico que la página nombra.
const SCHEMES = ["ED25519", "SECP256K1", "ML-DSA", "FIPS-204", "ECDSA", "LATTICE"];

// Las cuentas NO rotan. Genéricas a propósito: una cuenta real en un fondo
// decorativo es un dato que nadie revisó.
const ACCOUNTS = ["alice.near", "agent.near", "vault.near", "relay.near"];

// El ciclo. Reposo largo y pasada lenta: la rotación tiene que sentirse como un
// evento, y un evento que ocurre cada tres segundos es un loop.
//
// La pasada empezó en 1 s y se fue a 3.4: a la velocidad original el frente
// cruzaba antes de que el ojo lo siguiera, así que se leía como un flash y no
// como algo que atraviesa el plano. Lenta, se puede mirar — que es la diferencia
// entre un efecto y un gesto.
//
// Alargarla obligó a tres ajustes que van juntos y no se pueden tocar por
// separado: la banda se ensanchó, el progreso dejó de ser lineal y el borde se
// disgregó. Un frente lento con los números de uno rápido se ve como una regla
// deslizándose, que es peor que el flash.
const HOLD_MS = 8200;
const SWEEP_MS = 3400;

// Ancho de la banda del frente, en unidades de la coordenada de barrido, y del
// núcleo que va en el verde de marca.
//
// Los dos crecieron con la duración de la pasada, y por un motivo geométrico: a
// 3.4 s el frente recorre la misma distancia en tres veces más tiempo, así que
// una banda angosta se convierte en una línea nítida deslizándose despacio — el
// ojo la sigue como un objeto sólido en vez de como un frente. Ancha, el degradé
// tarda en pasar por cada celda y la transición se siente continua.
//
// El núcleo sigue siendo mucho más angosto que la banda: es un filo dentro de
// una cola, no una franja. Si se acerca al ancho de la banda, la pasada deja de
// leerse como un corte y pasa a ser un degradé verde cruzando la pantalla.
const CREST_W = 0.2;
const CORE_W = 0.055;

// Cuánto se desordena el borde del frente, por celda. Sin esto el límite entre
// las dos generaciones es una recta perfecta, y a esta velocidad se ve: una fila
// de glifos cambiando a la vez se lee como una barra que empuja. Con el
// desorden, cada celda gira un instante antes o después que su vecina y el
// frente tiene grosor en vez de filo.
const EDGE_JITTER = 0.028;

// Radio del halo del puntero, en píxeles de CSS.
const HALO_R = 150;
// Cada cuánto se re-sortea el ruido bajo el cursor. Cada frame sería estática de
// televisor; a este ritmo se lee como material reescribiéndose.
const SCRAMBLE_MS = 85;

// Tipo declarado y no inferencia con `as const`: con la inferencia TypeScript
// arma la unión de los literales de los dos tonos, y `cfg.floor` deja de ser un
// número para pasar a ser `0.05 | 0.055` — que no se puede sumar con nada. Es la
// misma trampa que `protocolContent.ts` documenta para `ProofStat`.
type ToneCfg = {
  ink: string;
  /** `--green-ink`: el verde que se lee sobre este fondo. */
  green: string;
  /** `--near-green-accent`: el verde de la marca, sólo para el filo del frente. */
  accent: string;
  floor: number;
  scheme: number;
  accountAlpha: number;
  crest: number;
  halo: number;
};

const TONE: Record<"light" | "dark", ToneCfg> = {
  light: {
    ink: "16, 16, 16",
    green: "0, 168, 107",
    accent: "0, 220, 141",
    floor: 0.05,
    scheme: 0.1,
    accountAlpha: 0.2,
    crest: 0.78,
    halo: 0.5,
  },
  dark: {
    ink: "245, 244, 241",
    green: "139, 242, 156",
    accent: "0, 220, 141",
    floor: 0.055,
    scheme: 0.12,
    accountAlpha: 0.24,
    crest: 0.9,
    halo: 0.6,
  },
};

// Marca qué es cada celda. Decide tres cosas a la vez: si rota, con qué color se
// pinta y a qué alfa. Constantes planas y no un `enum`: `const enum` no convive
// con `isolatedModules`, que es como compila Next.
const NOISE = 0;
const SCHEME = 1;
const ACCOUNT = 2;

export default function KeyRotationField({
  tone = "light",
  className,
}: {
  tone?: keyof typeof TONE;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cfg = TONE[tone];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = 1;
    let cols = 0;
    let rows = 0;
    // `prev` es lo que el frente deja atrás; `next`, lo que escribe. Se guardan
    // los dos porque durante la pasada la pantalla muestra las dos generaciones
    // a la vez, una a cada lado del frente.
    let prev: string[] = [];
    let next: string[] = [];
    let kind: Uint8Array = new Uint8Array(0);
    // Desorden del borde, fijo por celda. Se calcula una vez por build y no por
    // frame: si cambiara, el frente hervería en vez de tener grosor.
    let jitter: Float32Array = new Float32Array(0);
    let gen = 0;

    // Las cuentas ocupan celdas fijas y su contenido NO se toca al rotar. Se
    // guardan aparte para que la siembra de cada generación no las pise: si una
    // palabra nueva cayera encima, la cuenta cambiaría — que es exactamente lo
    // contrario de lo que esta superficie afirma.
    let accountCells: number[] = [];

    const generate = (target: string[], g: number) => {
      const charset = CHARSETS[g % CHARSETS.length];
      for (let i = 0; i < target.length; i++) {
        if (kind[i] === ACCOUNT) continue;
        kind[i] = NOISE;
        target[i] = charset[Math.floor(Math.random() * charset.length)];
      }

      const seeds = Math.max(3, Math.round((cols * rows) / 1100));
      for (let s = 0; s < seeds; s++) {
        const word = SCHEMES[Math.floor(Math.random() * SCHEMES.length)];
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * Math.max(1, cols - word.length));
        const at = row * cols + col;
        let clear = true;
        for (let k = 0; k < word.length; k++) {
          if (kind[at + k] === ACCOUNT) clear = false;
        }
        if (!clear) continue;
        for (let k = 0; k < word.length; k++) {
          target[at + k] = word[k];
          kind[at + k] = SCHEME;
        }
      }
    };

    const build = () => {
      dpr = deviceRatio(1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);

      const n = cols * rows;
      prev = new Array(n);
      next = new Array(n);
      kind = new Uint8Array(n);
      jitter = new Float32Array(n);
      for (let i = 0; i < n; i++) jitter[i] = (Math.random() - 0.5) * 2 * EDGE_JITTER;
      accountCells = [];

      // Las cuentas se colocan ANTES que nada: son las celdas que ninguna
      // generación puede tocar, así que tienen que existir cuando se siembra la
      // primera.
      for (let a = 0; a < ACCOUNTS.length; a++) {
        const word = ACCOUNTS[a];
        const row = Math.floor(((a + 0.5) / ACCOUNTS.length) * rows);
        const col = Math.floor(Math.random() * Math.max(1, cols - word.length));
        const at = row * cols + col;
        for (let k = 0; k < word.length; k++) {
          if (at + k >= n) break;
          prev[at + k] = word[k];
          next[at + k] = word[k];
          kind[at + k] = ACCOUNT;
          accountCells.push(at + k);
        }
      }

      gen = 0;
      generate(prev, gen);
      generate(next, gen + 1);
    };

    // ── El barrido ──────────────────────────────────────────────────────────
    // `origin` en null = pasada diagonal (la automática). Con un punto = pasada
    // radial desde ahí (la que dispara el clic). Las dos devuelven una
    // coordenada 0..1, así que el mismo progreso `p` sirve para las dos y no hay
    // dos mecanismos de barrido que mantener sincronizados.
    let origin: { x: number; y: number } | null = null;

    const front = (x: number, y: number) => {
      const nx = x / Math.max(1, cols);
      const ny = y / Math.max(1, rows);
      if (!origin) {
        // Diagonal, con más peso en la horizontal: en vertical puro el frente
        // coincide con las columnas de la retícula y la pasada se lee como una
        // persiana.
        return nx * 0.78 + ny * 0.22;
      }
      const dx = nx - origin.x;
      // La distancia se mide en el espacio de la pantalla y no en el de la
      // retícula: sin corregir por la proporción, el frente "radial" sale
      // ovalado en cualquier viewport que no sea cuadrado.
      const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
      const dy = (ny - origin.y) / Math.max(0.0001, aspect);
      // Normalizado por la diagonal, para que el frente siempre termine de
      // cruzar dentro de la duración de la pasada, salga del centro o de una
      // esquina.
      return Math.hypot(dx, dy) / 1.415;
    };

    let raf = 0;
    let visible = true;
    let phaseStart = 0;
    let sweeping = false;

    // Puntero, en píxeles de CSS relativos al canvas. `null` cuando no hay.
    let pointer: { x: number; y: number } | null = null;
    let lastScramble = 0;

    const startSweep = (now: number, from: { x: number; y: number } | null) => {
      if (sweeping) return;
      origin = from;
      sweeping = true;
      phaseStart = now;
    };

    // Revuelve el ruido bajo el cursor. Sólo `NOISE`: romper un esquema o una
    // cuenta destruiría lo único estable que tiene el campo.
    const scramble = (target: string[]) => {
      if (!pointer) return;
      const charset = CHARSETS[gen % CHARSETS.length];
      const cx = pointer.x / CELL;
      const cy = pointer.y / CELL;
      const r = HALO_R / CELL;
      const x0 = Math.max(0, Math.floor(cx - r));
      const x1 = Math.min(cols - 1, Math.ceil(cx + r));
      const y0 = Math.max(0, Math.floor(cy - r));
      const y1 = Math.min(rows - 1, Math.ceil(cy + r));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const i = y * cols + x;
          if (kind[i] !== NOISE) continue;
          if (Math.hypot(x - cx, y - cy) > r) continue;
          // No todas cada vez: con el barrido entero re-sorteado a 85 ms el halo
          // hierve parejo y se lee como un rectángulo de estática.
          if (Math.random() > 0.35) continue;
          target[i] = charset[Math.floor(Math.random() * charset.length)];
        }
      }
    };

    const draw = (now: number) => {
      let p = -1;
      if (sweeping) {
        const k = (now - phaseStart) / SWEEP_MS;
        if (k >= 1) {
          gen += 1;
          prev = next.slice();
          generate(next, gen + 1);
          for (const i of accountCells) next[i] = prev[i];
          sweeping = false;
          origin = null;
          phaseStart = now;
        } else {
          // El progreso no es lineal: `smoothstep` arranca y termina con
          // velocidad cero, así que el frente entra y sale del plano sin el
          // arranque seco de una rampa recta. Es lo que hace que la pasada se
          // sienta continua y no cronometrada.
          //
          // El precio: en la mitad del recorrido va más rápido que el promedio.
          // Es el reparto correcto — los extremos son donde el ojo detecta el
          // arranque y la detención, el medio es donde no mira.
          const eased = k * k * (3 - 2 * k);
          // Margen a los dos lados para que la cresta entre y salga fuera del
          // plano en vez de aparecer pegada al borde.
          p = -0.2 + eased * 1.4;
        }
      } else if (now - phaseStart > HOLD_MS) {
        startSweep(now, null);
      }

      if (pointer && now - lastScramble > SCRAMBLE_MS) {
        scramble(p >= 0 ? next : prev);
        scramble(p >= 0 ? prev : next);
        lastScramble = now;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.font = "500 11px var(--font-montreal-mono), ui-monospace, monospace";
      ctx.textBaseline = "top";

      const haloCx = pointer ? pointer.x / CELL : 0;
      const haloCy = pointer ? pointer.y / CELL : 0;
      const haloR = HALO_R / CELL;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const k = kind[i];
          const u = front(x, y);
          // El jitter entra SÓLO en la decisión de qué generación mostrar, no en
          // el cálculo del brillo: desordenar también la cresta la convertiría en
          // ruido granulado en vez de en una banda con borde blando.
          const passed = p >= 0 && u + jitter[i] < p;
          const char = passed ? next[i] : prev[i];
          if (!char) continue;

          // La cresta. `core` es el filo en verde de marca; el resto de la banda
          // cae hacia `--green-ink`.
          let crest = 0;
          let core = 0;
          if (p >= 0) {
            const d = Math.abs(u - p);
            if (d < CREST_W) {
              crest = (1 - d / CREST_W) ** 2 * cfg.crest;
              if (d < CORE_W) core = 1 - d / CORE_W;
            }
          }

          // El halo del puntero. Cae al cuadrado para que tenga borde suave sin
          // un límite visible.
          let halo = 0;
          if (pointer) {
            const hd = Math.hypot(x - haloCx, y - haloCy) / haloR;
            if (hd < 1) halo = (1 - hd) ** 2 * cfg.halo;
          }

          let alpha = cfg.floor;
          let color = cfg.ink;
          if (k === SCHEME) alpha = cfg.scheme;
          if (k === ACCOUNT) {
            alpha = cfg.accountAlpha;
            color = cfg.green;
          }

          // El orden importa: el filo del frente gana sobre todo lo demás, el
          // halo gana sobre el reposo, y una cuenta conserva su verde en los tres
          // casos — es lo único que no cambia nunca, y el color lo dice.
          const lit = Math.max(crest, halo);
          if (lit > 0.001 && k !== ACCOUNT) {
            color = core > 0.5 ? cfg.accent : cfg.green;
          }

          ctx.fillStyle = `rgba(${color}, ${alpha + lit})`;
          ctx.fillText(char, x * CELL, y * CELL);
        }
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    build();
    phaseStart = 0;
    draw(0);

    if (!reduced) {
      raf = requestAnimationFrame(loop);
    }

    // ── Los eventos ─────────────────────────────────────────────────────────
    // En la sección y no en el canvas: el canvas está en `z-0` debajo del texto
    // y con `pointer-events-none`, así que sólo respondería en los huecos.
    const host = canvas.parentElement;

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      pointer = null;
    };
    const onDown = (e: PointerEvent) => {
      // Un clic en el CTA no dispara nada: disparar la rotación mientras el
      // lector se va de la página es ruido, no interacción.
      if ((e.target as HTMLElement | null)?.closest("a, button")) return;
      const r = canvas.getBoundingClientRect();
      startSweep(performance.now(), {
        x: (e.clientX - r.left) / Math.max(1, r.width),
        y: (e.clientY - r.top) / Math.max(1, r.height),
      });
    };

    if (host && !reduced) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        const now = entry.isIntersecting;
        if (now === visible) return;
        visible = now;
        if (!visible) {
          cancelAnimationFrame(raf);
          raf = 0;
          pointer = null;
        } else if (!raf && !reduced) {
          // El reloj del reposo se reinicia al volver: sin esto, una pestaña que
          // estuvo minutos fuera de pantalla dispara la pasada en el primer
          // frame, antes de que el lector llegue a ver el campo en reposo.
          phaseStart = performance.now();
          raf = requestAnimationFrame(loop);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      build();
      draw(performance.now());
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      if (host) {
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
        host.removeEventListener("pointerdown", onDown);
      }
    };
  }, [tone]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
