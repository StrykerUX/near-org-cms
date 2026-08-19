// GLSL del campo de EX2: curvas de nivel que derivan muy despacio.
//
// GLSL ES 3.00 por `fwidth`, que en ES 1.00 vive tras una extensión de WebGL1
// que en un contexto WebGL2 no existe. Mismo caso —y misma nota— que
// `newsletter-labs/shaders/haloField.ts`.
//
// OJO al editar: nada de acentos graves dentro del template literal.

export const EX_FIELD_VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0., 1.); }`;

export const EX_FIELD_FRAG = `#version 300 es
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec3  u_bg;
uniform vec3  u_line;
uniform vec3  u_glow;

out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // Quintic: la segunda derivada continua es lo que evita las bandas en las
  // diagonales, y acá se verían MUCHO — el efecto entero son curvas de nivel,
  // o sea el gradiente del campo hecho visible.
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
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p = mat2(0.8, 0.6, -0.6, 0.8) * p * 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 2.1;

  // Deriva lenta y en diagonal. A esta velocidad el campo tarda cerca de un
  // minuto en cambiar de forma reconociblemente: si se le ve moverse, está mal
  // calibrado — es un fondo, no una animación.
  float h = fbm(p + vec2(u_time * 0.012, u_time * -0.008));

  // Curvas de nivel de ancho constante en PÍXELES: 'fwidth' da el ancho del
  // cruce en pantalla, así que la línea mide lo mismo donde el campo es denso y
  // donde es plano, y no se aliasa.
  float scaled = h * 11.0;
  float d = abs(fract(scaled) - 0.5);
  float w = fwidth(scaled);
  float line = 1.0 - smoothstep(0.0, w * 1.5, d);

  // Un rescoldo en los valles del campo: las zonas bajas se tiñen apenas del
  // verde de marca. Sin esto son once líneas grises y el fondo no dice nada.
  float low = smoothstep(0.55, 0.15, h);

  vec3 col = mix(u_bg, u_glow, low * 0.5);
  col = mix(col, u_line, line * 0.85);

  fragColor = vec4(col, 1.0);
}
`;
