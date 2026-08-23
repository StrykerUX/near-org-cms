// C · Spectrum — el pulso de la red, como bandas de luz.
//
// Columnas verticales de distinto brillo que se desplazan y se interfieren
// entre sí. Es la traducción a la paleta de NEAR de un recurso que funciona muy
// bien en esta categoría: una superficie que no representa nada concreto pero
// se lee como actividad, como un osciloscopio ancho.
//
// ── Por qué columnas y no un degradé ──────────────────────────────────────
//
// Un degradé animado es atmósfera; una columna tiene un borde, y un borde tiene
// posición. El ojo puede seguir una columna y ver que se mueve, que es lo que
// convierte la superficie en algo vivo en vez de algo bonito. Además las
// columnas comparten estructura con la retícula de doce que gobierna la página.
//
// ── Tres ondas y no una ───────────────────────────────────────────────────
//
// Con una sola frecuencia el patrón se repite de forma obvia cada pocos
// segundos. Tres ondas de frecuencias no múltiplos entre sí (1.0 / 1.63 / 2.71)
// no vuelven a coincidir en ningún ciclo corto, así que la superficie nunca se
// ve repetir.
//
// GLSL ES 3.00 — ver la nota de `GlSurface`.

export const SPECTRUM_FRAG = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2  u_res;
uniform float u_time;
uniform float u_motion;

uniform vec3  u_bg;
uniform vec3  u_low;     // columna apagada
uniform vec3  u_high;    // columna encendida
uniform float u_columns; // cuántas columnas cruzan la pantalla
uniform float u_speed;
uniform float u_soft;    // 0 = bordes duros, 1 = columnas fundidas

float hash(float n){ return fract(sin(n) * 43758.5453); }

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;

  float col = floor(uv.x * u_columns);
  float inCol = fract(uv.x * u_columns);
  float seed = hash(col);

  float t = u_time * u_speed * u_motion;

  // Tres frecuencias no múltiplos: el patrón no vuelve a coincidir en ningún
  // ciclo corto, así que nunca se lo ve repetir.
  float a = sin(t * 1.00 + seed * 12.0);
  float b = sin(t * 1.63 + seed * 31.0 + uv.y * 1.4);
  float c = sin(t * 2.71 + seed * 7.0);
  float level = 0.5 + 0.5 * (a * 0.5 + b * 0.32 + c * 0.18);

  // Las columnas no llegan a los extremos: sin este remapeo hay siempre alguna
  // en negro absoluto, y una columna vacía se lee como un hueco en la
  // superficie y no como una lectura baja.
  level = mix(0.12, 0.95, level);

  // El borde entre columnas. 'u_soft' a 1 las funde en un degradé continuo; a 0
  // deja el filete visible, que es lo que las hace contables.
  float edge = smoothstep(0.0, 0.02 + u_soft * 0.45, min(inCol, 1.0 - inCol));

  // Caída vertical: arriba más brillante. Le da a la superficie una dirección
  // de luz, sin la cual las columnas flotan sin plano.
  float fall = mix(0.55, 1.0, smoothstep(0.0, 1.0, uv.y));

  vec3 band = mix(u_low, u_high, level * fall);
  vec3 out_ = mix(u_bg, band, edge);

  out_ += (hash(dot(gl_FragCoord.xy, vec2(0.13, 0.71))) - 0.5) * 0.022;
  fragColor = vec4(out_, 1.0);
}
`;
