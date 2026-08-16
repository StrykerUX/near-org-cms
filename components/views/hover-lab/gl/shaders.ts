// Los fragment shaders del hover lab. GLSL ES 1.0 (WebGL 1) a propósito:
// WebGL 2 no aporta nada a un quad de dos triángulos y sí deja afuera a los
// navegadores viejos, que es exactamente la clase de costo que un efecto
// decorativo no puede permitirse.
//
// ── Reglas que se respetan en todos ────────────────────────────────────────
// · Nada de `fwidth`/`dFdx`: son de OES_standard_derivatives, una extensión.
//   Los bordes se suavizan con `smoothstep` sobre un ancho derivado de uRes.
// · Loops con límite constante — GLSL ES 1.0 no admite otra cosa.
// · Los colores NO están hardcodeados: entran por uniform desde los tokens de
//   marca (`--cta-lime`, `--cta-mint`, `--cta-deep`). Un hex copiado acá sería
//   una segunda fuente de verdad para la paleta.
//
// ── Uniforms comunes ───────────────────────────────────────────────────────
//   uTime   float  segundos, del ticker de GSAP
//   uRes    vec2   tamaño del canvas en píxeles de dispositivo
//   uMouse  vec2   puntero en píxeles, origen abajo-izquierda (como gl_FragCoord)
//   uHover  float  0..1, lo anima GSAP — NO es un booleano: la curva es el efecto
//   uProg   float  0..1, segundo canal de animación para las que lo necesitan
//   uAux    vec4   libre por shader (posición y alto del link activo, etc.)
//   uC1/2/3 vec3   lime / mint / deep
//   uInk    vec3   el negro de la página
//   uTex    sampler2D + uTexRes vec2 — sólo `glText`

export type ShaderId =
  | "glMesh"
  | "glRipple"
  | "glDissolve"
  | "glBorder"
  | "glText"
  | "glStack"
  | "glTorch"
  | "glAurora"
  | "glInk"
  | "glUnderline";

/** Cabecera común: precisión, uniforms y el ruido. Se antepone a cada shader
 *  en vez de repetirse diez veces — un fbm con una octava de más en una copia
 *  y no en las otras es un bug imposible de ver leyendo. */
const HEAD = /* glsl */ `
// highp donde exista. No es exceso de celo: el hash de abajo multiplica un
// seno por 43758.5, y en mediump ese número pierde tantos bits de mantisa que
// el "ruido" sale en bandas regulares — el efecto se ve bien en desktop y
// cuadriculado en el teléfono, que es la peor forma de enterarse.
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 vUv;

uniform float uTime;
uniform vec2  uRes;
uniform vec2  uMouse;
uniform float uHover;
uniform float uProg;
uniform vec4  uAux;
uniform vec3  uC1;
uniform vec3  uC2;
uniform vec3  uC3;
uniform vec3  uInk;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Value noise: más barato que simplex y suficiente para todo lo de acá, que
// son manchas suaves y no terreno.
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

// Distancia con signo a un rectángulo redondeado. Es lo que permite dibujar el
// contorno del botón con su radio real en vez de aproximarlo con un borde.
float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

// La rampa de marca como función de un escalar. Un solo lugar donde vive el
// orden lime -> mint -> deep, igual que en el CSS.
vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0);
  return t < 0.5 ? mix(uC1, uC2, t * 2.0) : mix(uC2, uC3, (t - 0.5) * 2.0);
}

// Grano. Un poco de ruido de alta frecuencia sobre cualquier degradado evita
// el banding que se ve en los verdes claros de la paleta, y de paso empareja
// el shader con la textura del resto del sitio.
float grain(vec2 uv) {
  return hash(uv * uRes + fract(uTime) * 100.0) - 0.5;
}
`;

/** 34 · flujo. Dos capas de fbm que se arrastran en direcciones distintas y
 *  colorean con la rampa. El hover no enciende nada: acelera y contrasta lo
 *  que ya estaba pasando, que es la diferencia entre un fondo vivo y un
 *  interruptor. */
const glMesh = /* glsl */ `
void main() {
  vec2 uv = vUv;
  float t = uTime * (0.08 + uHover * 0.22);

  float a = fbm(uv * vec2(2.4, 1.6) + vec2(t, t * 0.6));
  float b = fbm(uv * vec2(3.1, 2.2) - vec2(t * 0.8, t * 0.3) + 7.3);

  // El eje horizontal manda: el botón es cuatro veces más ancho que alto y un
  // patrón isótropo ahí se lee como manchas, no como flujo.
  float m = uv.x * 0.55 + a * 0.5 + b * 0.25 - 0.15;
  m = mix(m, smoothstep(0.15, 0.85, m), uHover);

  vec3 col = ramp(m);
  col = mix(col, col * 1.12, uHover);
  col += grain(uv) * 0.035;

  gl_FragColor = vec4(col, 1.0);
}
`;

/** 35 · ondas. Anillos que nacen en el punto de entrada del puntero y mueren
 *  con la distancia. La amortiguación es lo único que importa acá: sin ella se
 *  ve una diana, no un impacto. */
const glRipple = /* glsl */ `
void main() {
  vec2 px = vUv * uRes;
  float d = distance(px, uMouse) / max(uRes.x, 1.0);

  float wave = sin(d * 34.0 - uTime * 7.0);
  // Decae con la distancia Y con el tiempo desde el hover (uProg lo baja).
  float damp = exp(-d * 5.5) * uHover;
  float disp = wave * damp * 0.16;

  float m = vUv.x + disp;
  vec3 col = ramp(m);
  // Cresta: donde la onda está alta, un toque del lime más claro.
  col += uC1 * max(wave, 0.0) * damp * 0.25;
  col += grain(vUv) * 0.03;

  gl_FragColor = vec4(col, 1.0);
}
`;

/** 36 · disolución. El botón se materializa desde el ruido: el umbral sube con
 *  uHover y en la franja del borde el color se calienta al lime. Es el único
 *  shader con alpha — el botón está literalmente vacío en reposo. */
const glDissolve = /* glsl */ `
void main() {
  vec2 uv = vUv;
  float n = fbm(uv * 4.5 + uTime * 0.06);
  // El barrido horizontal le da dirección a lo que si no sería estática.
  float thr = uHover * 1.35 - uv.x * 0.3;

  float edge = thr - n;
  float alpha = smoothstep(0.0, 0.045, edge);
  float hot = 1.0 - smoothstep(0.0, 0.12, edge);

  vec3 col = ramp(uv.x * 0.9 + n * 0.2);
  col = mix(col, uC1, hot * 0.85);
  col += grain(uv) * 0.04;

  gl_FragColor = vec4(col, alpha * smoothstep(0.0, 0.08, uHover));
}
`;

/** 37 · contorno. Un SDF del rectángulo redondeado dibuja la línea con el
 *  radio exacto del botón, y una banda angular la recorre. El interior queda
 *  casi vacío: es un borde, no un relleno.
 *
 *  uAux.x trae el radio en píxeles — el shader no puede leerlo del CSS. */
const glBorder = /* glsl */ `
const float TAU = 6.28318530718;

void main() {
  vec2 px = vUv * uRes;
  vec2 c = px - uRes * 0.5;
  float d = sdRoundBox(c, uRes * 0.5 - 1.0, uAux.x);

  // Ancho del trazo en píxeles, suavizado a mano (sin fwidth).
  float line = 1.0 - smoothstep(0.0, 2.2, abs(d));

  // La banda que viaja: el ángulo alrededor del centro, normalizado.
  float ang = atan(c.y, c.x * uRes.y / uRes.x) / TAU + 0.5;
  float head = fract(ang - uTime * 0.22);
  float pulse = pow(1.0 - abs(head - 0.5) * 2.0, 6.0);

  vec3 col = ramp(ang);
  float a = line * (0.28 + pulse * 0.9) * uHover;

  // Relleno apenas insinuado adentro del trazo.
  float inside = 1.0 - smoothstep(-1.0, 0.0, d);
  vec3 fill = mix(uInk, uC3, 0.12);
  float fa = inside * uHover * 0.22;

  gl_FragColor = vec4(mix(fill, col, a / max(a + fa, 0.001)), max(a, fa));
}
`;

/** 38 · el label como textura, distorsionado. `uTex` trae el texto rasterizado
 *  en un canvas 2D con la MISMA fuente que el DOM (ver `textTexture()`), así
 *  que el cambio del label real al del shader no se nota.
 *
 *  El desplazamiento se aplica en coordenadas de textura y decae hacia los
 *  bordes: distorsionar parejo se ve como un canvas mal escalado, distorsionar
 *  con un frente que avanza se ve como líquido. */
const glText = /* glsl */ `
uniform sampler2D uTex;

void main() {
  vec2 uv = vUv;

  float n = fbm(uv * vec2(3.0, 6.0) + vec2(uTime * 0.35, uTime * 0.2));
  // El frente: una banda vertical que cruza el botón mientras uProg sube.
  float front = 1.0 - smoothstep(0.0, 0.45, abs(uv.x - uProg));
  float amp = (0.012 + front * 0.05) * uHover;

  vec2 off = vec2((n - 0.5) * amp * 1.6, (fbm(uv * 5.0 - uTime * 0.3) - 0.5) * amp);
  // La textura está en el espacio del canvas: eje Y invertido respecto de vUv.
  vec4 tex = texture2D(uTex, vec2(uv.x, 1.0 - uv.y) + off);

  vec3 bg = ramp(uv.x * 0.8 + n * 0.25);
  bg += grain(uv) * 0.03;

  // El texto es negro sobre la rampa: en esta paleta es lo legible, igual que
  // en el CTA de producción.
  vec3 col = mix(bg, uInk, tex.a);
  gl_FragColor = vec4(col, 1.0);
}
`;

/** 39 · el kitchen sink. La rampa de siempre, más un foco que sigue al puntero,
 *  más una cáustica lenta, más grano. Existe para tener el techo del rango a la
 *  vista: es defendible en una landing de campaña y difícil de defender en el
 *  header permanente de un sitio de producto. */
const glStack = /* glsl */ `
void main() {
  vec2 uv = vUv;
  vec2 px = uv * uRes;

  float t = uTime * 0.14;
  float caustic = fbm(uv * vec2(3.5, 2.0) + vec2(t, -t * 0.7));
  float m = uv.x * 0.7 + caustic * 0.4 - 0.1;
  vec3 col = ramp(m);

  // El foco: radio en píxeles para que no se deforme con el aspecto.
  float d = distance(px, uMouse);
  float glow = exp(-d / (uRes.y * 1.5)) * uHover;
  col += (uC1 - col) * glow * 0.55;

  // Realce especular en la cresta de la cáustica, sólo con hover.
  float spec = smoothstep(0.62, 0.85, caustic) * uHover;
  col += spec * 0.18;

  col += grain(uv) * 0.04;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** F23 · antorcha. Se dibuja SOBRE la columna con blend `screen`, así que lo
 *  único que hay que calcular es la luz: el negro no suma nada y el texto que
 *  cae bajo el halo se aclara solo. El ruido evita que el foco se lea como un
 *  degradado radial de Photoshop. */
const glTorch = /* glsl */ `
void main() {
  vec2 px = vUv * uRes;
  float d = distance(px, uMouse);
  float r = uRes.y * 0.55;

  float n = fbm(vUv * 5.0 + uTime * 0.12);
  float halo = exp(-d / (r * (0.75 + n * 0.5)));

  vec3 col = mix(uC3, uC1, n) * halo * (0.55 + 0.45 * uHover) * uHover;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** F24 · aurora. Bandas lentas detrás de la columna. Es el más quieto de los
 *  cuatro de footer a propósito: un fondo animado detrás de nueve links tiene
 *  que poder ignorarse mientras se lee. */
const glAurora = /* glsl */ `
void main() {
  vec2 uv = vUv;
  float t = uTime * 0.05;

  float band = fbm(vec2(uv.x * 1.6 + t, uv.y * 2.4 - t * 0.5));
  float band2 = fbm(vec2(uv.x * 2.2 - t * 0.7, uv.y * 1.2 + t * 0.3) + 4.0);

  float m = band * 0.7 + band2 * 0.4;
  vec3 col = ramp(m) * (0.10 + 0.30 * uHover);
  // Se apaga hacia los bordes verticales para no cortar contra la tarjeta.
  col *= smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.75, uv.y);
  col += grain(uv) * 0.02;

  gl_FragColor = vec4(col, 1.0);
}
`;

/** F25 · tinta. Una mancha que crece desde el link activo (uAux.y es su centro
 *  en píxeles, uAux.z su alto) con el borde roto por ruido, como tinta en
 *  papel. uProg es el crecimiento: GSAP lo lleva con un ease que desacelera
 *  fuerte, que es como se comporta un líquido absorbido. */
const glInk = /* glsl */ `
void main() {
  vec2 px = vUv * uRes;
  vec2 c = vec2(uAux.x, uAux.y);

  // Elipse achatada: la mancha tiene que seguir la forma de una línea de
  // texto, no ser un círculo que invade las filas de arriba y abajo.
  vec2 rel = (px - c) / vec2(uRes.x * 0.75, uAux.z * 1.4);
  float d = length(rel);

  float n = fbm(vUv * 7.0 + uTime * 0.05);
  float edge = d + (n - 0.5) * 0.35;
  float mask = 1.0 - smoothstep(uProg - 0.12, uProg + 0.06, edge);

  vec3 col = mix(uC3, uC2, n) * mask * 0.55;
  gl_FragColor = vec4(col, 1.0);
}
`;

/** F26 · el subrayado es el shader. Una franja de 2px a la altura del link
 *  activo (uAux.y) con plasma corriendo por dentro; el ancho lo abre uProg.
 *
 *  Un canvas por COLUMNA y no uno por link: el subrayado se mueve al link
 *  activo en vez de existir nueve veces. Es la misma decisión que el rail de
 *  la variante 13, llevada al shader. */
const glUnderline = /* glsl */ `
void main() {
  vec2 px = vUv * uRes;

  float dy = abs(px.y - uAux.y);
  float line = 1.0 - smoothstep(0.0, 2.0, dy - 1.0);

  // uAux.z es el ancho del link en píxeles; uProg lo abre de 0 a 1.
  float half = uAux.z * 0.5 * uProg;
  float dx = abs(px.x - uAux.x);
  float span = 1.0 - smoothstep(half - 2.0, half + 2.0, dx);

  float plasma = fbm(vec2(px.x * 0.02 - uTime * 0.6, uTime * 0.2));
  vec3 col = ramp(plasma);
  // Halo tenue por encima y por debajo del trazo: es lo que lo hace ver
  // encendido en vez de pintado.
  float glow = exp(-dy / 6.0) * 0.35;

  float a = (line + glow) * span * uHover;
  gl_FragColor = vec4(col * a, a);
}
`;

export const FRAGMENTS: Record<ShaderId, string> = {
  glMesh: HEAD + glMesh,
  glRipple: HEAD + glRipple,
  glDissolve: HEAD + glDissolve,
  glBorder: HEAD + glBorder,
  glText: HEAD + glText,
  glStack: HEAD + glStack,
  glTorch: HEAD + glTorch,
  glAurora: HEAD + glAurora,
  glInk: HEAD + glInk,
  glUnderline: HEAD + glUnderline,
};
