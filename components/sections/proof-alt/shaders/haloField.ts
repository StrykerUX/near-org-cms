// GLSL de la capa de fondo de la versión 02 · Halo.
//
// Vive en su propio módulo por lo mismo que 'hero-alt/shaders/flowField.ts': un
// template literal de setenta líneas dentro del componente lo vuelve ilegible, y
// TypeScript no puede mirar adentro de todos modos — el único chequeo que existe
// es el COMPILE_STATUS de buildProgram, que además dice en qué línea del GLSL
// falló.
//
// ── Este shader es GLSL ES 3.00, y es el ÚNICO del repo que lo es ──────────
//
// El resto (hero-burst, flowField, glass, glyphShine) está en ES 1.00 sin
// '#version', y la convención era mantenerlo así para no tener que recordar cuál
// es cuál archivo por archivo. Acá no se pudo, y el motivo es concreto:
//
// el efecto son curvas de nivel, y una curva de nivel de ancho constante en
// PÍXELES necesita fwidth() — la derivada de pantalla del campo. En ES 1.00
// fwidth no es parte del lenguaje: vive tras GL_OES_standard_derivatives, una
// extensión de WebGL1 que en un contexto WebGL2 NO EXISTE (en ES 3.00 pasó a ser
// core). El intento de habilitarla ahí devuelve exactamente esto:
//
//   WARNING: 'GL_OES_standard_derivatives' : extension is not supported
//   ERROR: 'fwidth' : no matching overloaded function found
//
// La alternativa —ancho de línea fijo en unidades del campo— alia feo justo
// donde el campo es plano, que en este shader es la mitad de la pantalla.
//
// Lo que cambia respecto de los otros shaders del repo: 'attribute' pasa a 'in',
// y 'gl_FragColor' a una salida declarada. El '#version' tiene que ser lo
// primero del literal, solo puede llevar comentarios y espacios delante.
//
// OJO al editar: dentro del template literal NO puede haber acentos graves.
// Cierran el literal de JS, y el error que sale es un TS1005 en una línea que no
// tiene nada que ver. Pasó al escribir el shader de la primera ronda.

export const HALO_VERT = `#version 300 es\nin vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

export const HALO_FRAG = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2  u_res;
uniform float u_time;
uniform vec3  u_bg;
uniform vec3  u_line;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // Quintic y no smoothstep cúbico: la segunda derivada continua es lo que evita
  // las bandas visibles en las diagonales, y acá se notarían MUCHO — todo el
  // efecto son líneas de nivel, o sea el gradiente del campo hecho visible.
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
    // La rotación entre octavas rompe el enrejado del value noise, que si no se
    // ve como una cuadrícula en las líneas de nivel.
    p = mat2(0.8, 0.6, -0.6, 0.8) * p * 2.03;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 2.4;

  // El campo deriva MUY despacio y en diagonal. Es lo único que se mueve en la
  // sección, así que la velocidad es el parámetro delicado: por encima de esto
  // el fondo empieza a pedir atención, y este fondo no debe pedir nada.
  float h = fbm(p + vec2(u_time * 0.014, u_time * -0.009));

  // Curvas de nivel: se toma la parte fraccionaria del campo escalado y se marca
  // dónde cruza el medio. fwidth da el ancho en píxeles de ese cruce, así que la
  // línea mide lo mismo donde el campo es denso y donde es plano, y no se aliasa.
  float scaled = h * 9.0;
  float d = abs(fract(scaled) - 0.5);
  float w = fwidth(scaled);
  float line = 1.0 - smoothstep(0.0, w * 1.6, d);

  // Las líneas se apagan contra el borde superior e inferior. Sin esto el campo
  // llega a los bordes de la sección y la corta como un rectángulo pegado encima
  // del blanco; con el desvanecido, el blanco de la sección y el de la página
  // son el mismo blanco.
  float fade = smoothstep(0.0, 0.28, uv.y) * (1.0 - smoothstep(0.72, 1.0, uv.y));

  fragColor = vec4(mix(u_bg, u_line, line * fade), 1.0);
}
`;
