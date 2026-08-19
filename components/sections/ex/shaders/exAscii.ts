// GLSL del fondo ASCII de EX3.
//
// GLSL ES 3.00 (`#version 300 es`) porque usa `textureSize` y `fwidth`. El resto
// de shaders del repo está en ES 1.00; la excepción y su motivo están anotados
// también en `newsletter-labs/shaders/haloField.ts`.
//
// OJO al editar: dentro del template literal NO puede haber acentos graves —
// cierran el literal de JS y el error sale en una línea que no tiene que ver.
//
// ── Cómo se dibuja ASCII en un shader ───────────────────────────────────────
//
// No hay texto: hay un ATLAS. El componente rasteriza una tira de caracteres
// —del más vacío al más denso— en un canvas y la sube como textura. El shader
// hace tres cosas por píxel:
//
//   1. decide en qué CELDA de la rejilla cae;
//   2. evalúa el campo en el centro de esa celda y saca una intensidad 0..1;
//   3. convierte esa intensidad en un ÍNDICE de carácter y muestrea el atlas en
//      la posición relativa dentro de la celda.
//
// Evaluar el campo en el centro de la celda y no en el píxel es lo que hace que
// cada carácter sea uniforme. Evaluándolo por píxel, cada glifo saldría con un
// degradado dentro y el resultado parecería una imagen borrosa, no texto.

export const EX_ASCII_VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0., 1.); }`;

export const EX_ASCII_FRAG = `#version 300 es
precision highp float;

uniform vec2      u_res;
uniform float     u_time;
uniform vec2      u_pointer;   // en px, ya en coordenadas de este canvas
uniform float     u_pointerOn; // 0..1 — entra y sale suave, no de golpe
uniform float     u_cell;      // lado de la celda, en px
uniform float     u_glyphs;    // cuántos caracteres tiene el atlas
uniform sampler2D u_atlas;
uniform vec3      u_bg;
uniform vec3      u_ink;
uniform vec3      u_accent;

out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = mat2(0.8, 0.6, -0.6, 0.8) * p * 2.03;
    a *= 0.5;
  }
  return v;
}

// El campo que decide qué densidad tiene cada celda.
float field(vec2 px) {
  vec2 p = px / u_res.y;

  // Corriente lenta en diagonal. Es lo único que se mueve sin que nadie toque
  // nada, y va despacio a propósito: el fondo tiene que respirar, no hervir.
  float v = fbm(p * 3.2 + vec2(u_time * 0.035, -u_time * 0.022));

  // ── El cursor ──────────────────────────────────────────────────────────
  //
  // No pinta: DEFORMA. Suma un bulbo de intensidad centrado en el puntero, con
  // caída suave, así que lo que cambia bajo el cursor es qué CARÁCTER toca en
  // cada celda — el texto se "densifica" alrededor de la mano en vez de
  // encenderse un halo encima. Es la diferencia entre un efecto sobre el ASCII
  // y un efecto DEL ASCII.
  float d = distance(px, u_pointer) / (u_res.y * 0.42);
  float bulb = exp(-d * d * 3.0) * u_pointerOn;

  return clamp(v + bulb * 0.55, 0.0, 1.0);
}

void main() {
  vec2 px = gl_FragCoord.xy;

  // La celda y la posición dentro de ella.
  vec2 cell = floor(px / u_cell);
  vec2 inCell = fract(px / u_cell);

  // El campo se evalúa en el CENTRO de la celda: un valor por carácter.
  float v = field((cell + 0.5) * u_cell);

  // Intensidad → índice de glifo. El atlas va del más vacío al más denso, así
  // que el índice es directo.
  float idx = floor(v * (u_glyphs - 0.001));

  // El atlas es una tira horizontal: cada glifo ocupa 1/u_glyphs del ancho.
  vec2 uv = vec2((idx + inCell.x) / u_glyphs, 1.0 - inCell.y);
  float glyph = texture(u_atlas, uv).a;

  // El acento entra solo en las celdas más densas, que con el cursor cerca son
  // justo las que lo rodean: la mano deja un rastro de color sin que haya que
  // pintar nada aparte.
  vec3 ink = mix(u_ink, u_accent, smoothstep(0.72, 1.0, v));

  fragColor = vec4(mix(u_bg, ink, glyph), 1.0);
}
`;
