// Shaders del material de bandas de los covers de LatestUpdates.
// GLSL ES 3.00 (WebGL2).
//
// ⚠️ `#version 300 es` DEBE ser el primer byte del source — pegado al backtick.
// Un solo `\n` adelante y el compilador asume GLSL ES 1.00.

export const BAND_FIELD_VERTEX = `#version 300 es
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
 * Material de "persianas de luz": un campo de luz continuo, muestreado en
 * bandas verticales que lo leen cada una desde una altura distinta.
 *
 * Cinco piezas, y ninguna es decorativa — sacando cualquiera el efecto se cae
 * a un degradado:
 *
 *   1. FUENTE DE LUZ, no rampa. Dos focos con falloff exponencial que derivan
 *      con el tiempo. Una rampa lineal (lo que había antes) no puede producir
 *      el núcleo brillante que se difumina en todas las direcciones.
 *   2. DOMINIO DEFORMADO. El espacio se deforma con fbm antes de medir la
 *      distancia a los focos, así los focos no son óvalos perfectos y el
 *      contorno respira.
 *   3. BANDAS DE ANCHO DESIGUAL. El eje x pasa por una función monótona no
 *      lineal antes de cuantizar, de modo que las columnas no quedan
 *      equiespaciadas.
 *   4. DESPLAZAMIENTO POR BANDA, con una parte fija por banda y otra que oscila
 *      lentamente: es lo que corta las manchas en los bordes y hace que el
 *      corte se mueva.
 *   5. GRANO. Ruido fino sumado al final. Es lo que da la textura de film y
 *      evita el banding de un degradado suave en 8 bits.
 */
export const BAND_FIELD_FRAGMENT = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform float uBands;
uniform float uSpread;    // 0 = bandas alineadas · 1 = desfase abierto (el hover)
uniform float uTime;      // segundos
uniform vec3  uC1;        // los 4 stops, del más saturado al neutro
uniform vec3  uC2;
uniform vec3  uC3;
uniform vec3  uC4;

const float SPREAD_MAX = 0.85;
const float GRAIN = 0.030;

// ── Ruido ──────────────────────────────────────────────────────────────────
float hash11(float n) { return fract(sin(n * 78.233) * 43758.5453); }

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Value noise con interpolación suave (smoothstep en las dos direcciones).
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// 3 octavas alcanzan: el material es difuso y las octavas altas se pierden
// bajo el grano.
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * vnoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

float dot2(vec2 v) { return dot(v, v); }

/**
 * El material completo en un punto del campo.
 *
 * CADA FOCO APORTA SU PROPIO COLOR, en vez de una única rampa sobre una
 * intensidad escalar. Con una sola rampa, todo el material recorre los mismos
 * colores y es imposible tener cyan en una zona y amarillo en otra, que es lo
 * que hace la referencia. Con color por foco, el tercer stop aparece solo donde
 * los dos se superponen — y esa zona se mueve, porque los focos derivan.
 */
vec3 material(vec2 p, float t) {
  // Dominio deformado ANTES de medir distancias: de acá sale que el contorno de
  // los focos no sea un óvalo y que respire con el tiempo.
  float w = fbm(p * 2.1 + vec2(t * 0.05, t * -0.04));
  vec2 q = p + (w - 0.5) * 0.30;

  // Deriva orgánica: cada eje con una frecuencia distinta e inconmensurable con
  // las otras, así el recorrido no se repite de forma perceptible ni se lee como
  // un vaivén. El aspecto 1:1.15 estira los focos en la dirección de las bandas.
  vec2 a = vec2(0.30 + 0.20 * sin(t * 0.19), 0.62 + 0.17 * cos(t * 0.13));
  vec2 b = vec2(0.74 + 0.16 * cos(t * 0.11), 0.30 + 0.19 * sin(t * 0.17));

  // Falloff exponencial ancho: núcleo brillante con halo largo.
  float ga = exp(-dot2((q - a) * vec2(1.0, 1.15)) * 3.4);
  float gb = exp(-dot2((q - b) * vec2(1.0, 1.15)) * 4.2);

  vec3 c = uC4;                                          // fondo neutro
  c = mix(c, uC1, smoothstep(0.04, 0.72, ga));           // foco A
  c = mix(c, uC3, smoothstep(0.04, 0.72, gb));           // foco B
  c = mix(c, uC2, smoothstep(0.55, 1.15, ga + gb));      // donde se superponen
  // Sobre-exposición del núcleo: un toque a blanco, como en la referencia.
  c = mix(c, vec3(1.0), smoothstep(1.20, 1.70, ga + gb) * 0.5);
  // El fbm tiñe el fondo para que tampoco sea plano.
  return mix(c, uC2, w * 0.10);
}

void main() {
  // ── Bandas de ancho desigual ─────────────────────────────────────────────
  // El warp es monótono (la derivada de x + k·sin nunca se hace negativa con
  // k < 1/6), así que el orden de las bandas se conserva y no se cruzan.
  float xw = vUv.x + 0.055 * sin(vUv.x * 8.2 + 1.3);
  float bi = floor(xw * uBands);
  float center = (bi + 0.5) / uBands;

  // ── Desplazamiento por banda ─────────────────────────────────────────────
  // Parte fija (hash, estable entre frames) + parte que oscila muy lento, con
  // la fase decalada por banda: sin la segunda, los cortes quedarían clavados y
  // el movimiento se leería solo como una deriva global.
  float fixedOff = hash11(bi) - 0.5;
  float waveOff = 0.16 * sin(uTime * 0.23 + bi * 1.7);
  float off = (fixedOff + waveOff) * uSpread * SPREAD_MAX;

  // Se muestrea el CENTRO de la banda en x: el color no varía horizontalmente
  // dentro de la columna, y de ahí sale el borde duro entre bandas con el
  // interior difuso. Con vUv.x saldría un degradado continuo.
  vec2 p = vec2(center, vUv.y + off + uTime * 0.012);

  vec3 col = material(p, uTime);

  // ── Grano ────────────────────────────────────────────────────────────────
  // Sobre gl_FragCoord, o sea a resolución de píxel real y no del UV, así el
  // tamaño del grano no depende del tamaño de la card. El uTime cuantizado a
  // ~12 Hz le da vida sin el titileo de refrescarlo a 60.
  float gt = floor(uTime * 12.0);
  float g = hash21(gl_FragCoord.xy + gt) - 0.5;
  col += g * GRAIN;

  fragColor = vec4(col, 1.0);
}`;
