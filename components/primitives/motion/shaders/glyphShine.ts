// Shaders del glyph-shine (ver `primitives/ShineField.tsx`). GLSL ES 3.00 (WebGL2).
//
// ⚠️ `#version 300 es` DEBE ser el primer byte del source — pegado al
// backtick. Un solo `\n` adelante y el compilador asume GLSL ES 1.00.

export const GLYPH_SHINE_VERTEX = `#version 300 es
precision highp float;

out vec2 vUv;

void main() {
  // vertexID 0,1,2 -> (0,0), (2,0), (0,2): un triángulo sobredimensionado que
  // cubre todo el clip-space. Sin VBO que crear, subir ni borrar.
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

/**
 * Brillo recortado a la forma exacta de los glifos de una línea de heading,
 * con DOS términos que se suman:
 *
 *   1. FRENTE (uFront): una cresta de luz que recorre la línea EN ORDEN DE
 *      LECTURA, clavada sobre el mismo borde donde el DOM está subiendo la
 *      opacidad de 10% a 100%. Sin desfase: es la luz del propio reveal, no
 *      un barrido aparte que lo acompaña.
 *   2. SPOTLIGHT DE MOUSE (uPointer): falloff gaussiano cuya posición sale del
 *      mouse normalizado a la VENTANA. Activo siempre, también mientras el
 *      frente todavía está barriendo.
 *
 * ── Por qué el frente NO viaja en uv.x ──────────────────────────────────────
 * Un heading de este tamaño hace wrap en 2-3 renglones. Si el frente avanzara
 * en el eje horizontal del canvas, iluminaría los renglones EN PARALELO
 * mientras el stagger del DOM va en orden de lectura: el brillo se
 * desincronizaría del reveal exactamente en el caso normal.
 *
 * Así que el orden de lectura viene HORNEADO en la máscara: cada glifo se
 * rasteriza con R = cobertura y G = (índice normalizado) × cobertura. La
 * división G/R recupera el índice sin que el antialias lo distorsione (el
 * compositing sobre negro multiplica ambos canales por el mismo alpha).
 *
 * Salida pensada para `mix-blend-mode: screen`: fuera del glifo escribimos
 * negro, que bajo screen es identidad EXACTA. Nunca dibujamos una segunda
 * copia opaca del texto — solo SUMAMOS luz adentro de la silueta.
 */
export const GLYPH_SHINE_FRAGMENT = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uMask;      // R = cobertura del glifo, G = orden de lectura × cobertura
uniform float uFront;         // posición del frente en espacio de ORDEN; entra <0 y sale >1
uniform vec2  uPointer;       // mouse en [0,1] de la ventana (y = 0 arriba)
uniform vec2  uResolution;    // px reales del drawing buffer
uniform vec3  uTint;
uniform float uIntensity;

// Ancho del frente en espacio de orden: 0.10 ≈ 3 letras de una línea de 30.
const float SOFT = 0.10;

void main() {
  // El canvas 2D de la máscara es y-abajo; vUv sale de clip-space (y-arriba).
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  vec4 m = texture(uMask, uv);

  // EROSIÓN DEL BORDE — el detalle que hace que la desalineación subpíxel
  // entre el bitmap de la máscara y el texto DOM sea invisible. El smoothstep
  // 0.42→0.92 descarta la franja de antialias del rasterizador de texto, así
  // que la luz queda ESTRICTAMENTE ADENTRO del glifo.
  float cov = smoothstep(0.42, 0.92, m.r);

  // Early-out: la mayor parte del cuadro es fondo.
  if (cov <= 0.0) {
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  // Índice de lectura del glifo, 0 en la primera letra y 1 en la última.
  float order = m.g / max(m.r, 0.004);

  float aspect = uResolution.x / max(uResolution.y, 1.0);

  // ── 1) frente del reveal ───────────────────────────────────────────────
  // d < 0  → este glifo ya quedó atrás (revelado)
  // d ~ 0  → es el que está subiendo de opacidad AHORA
  // d > 0  → todavía no le toca
  float d = order - uFront;
  float front = 1.0 - smoothstep(0.0, SOFT, abs(d));
  // Estela: lo ya recorrido queda habilitado para el spotlight.
  float wake = smoothstep(SOFT * 0.3, -SOFT * 1.5, d);

  // ── 2) spotlight global de mouse ───────────────────────────────────────
  // El mouse recorre 0..1 de la VENTANA y se remapea a un rango MÁS ANCHO que
  // el bloque de texto (overshoot), para que el brillo pueda salirse y volver
  // en vez de clavarse en el borde durante todo el trayecto del mouse por los
  // extremos de la pantalla.
  vec2 spot = vec2(mix(-0.35, 1.35, uPointer.x), mix(-0.9, 1.9, uPointer.y));
  vec2 dp = (uv - spot) * vec2(aspect, 1.0);
  float glow = exp(-dot(dp, dp) * 3.0);

  // El spotlight solo ilumina lo ya recorrido (wake); el velo constante es
  // bajo a propósito — con TODA la línea mascarada, subirlo tiñe el texto
  // entero de verde en vez de leerse como un brillo.
  float lum = front * 1.25 + wake * (0.10 + 1.15 * glow);

  vec3 col = mix(uTint, vec3(1.0), clamp(front + glow * 0.55, 0.0, 1.0) * 0.65);

  // Alpha 1.0 a propósito: el contexto se pide con alpha:false y la
  // composición la hace CSS. Negro = identidad bajo screen.
  fragColor = vec4(col * lum * cov * uIntensity, 1.0);
}`;
