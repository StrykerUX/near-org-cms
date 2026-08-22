// A · Lattice — la red vista en perspectiva.
//
// Una retícula isométrica que se aleja hacia un horizonte, con celdas que se
// encienden y se apagan solas. Es el mismo eje de 30° con el que está dibujado
// todo el material de NEAR, llevado de diagrama a superficie: en vez de un cubo
// de 40px, el plano entero al que esos cubos pertenecen.
//
// ── Por qué NO es una grilla en fuga tipo synthwave ───────────────────────
//
// La diferencia es que las dos familias de líneas están en el eje isométrico del
// sistema (±30°) y no en perpendicular, y que la perspectiva es suave —el
// horizonte está muy alto y fuera del encuadre— así que se lee como un plano
// inclinado y no como una carretera. Una grilla en fuga con líneas verticales es
// un cliché de 1984; ésta es la retícula de la marca con profundidad.
//
// ── Las celdas encendidas son el contenido ────────────────────────────────
//
// Un hash por celda decide cuáles se iluminan y una onda lenta las hace latir
// desfasadas. Eso es lo que convierte la superficie en algo que dice el tema —
// shards activos en una red— en vez de una textura. La proporción encendida es
// baja a propósito (`u_density`): una retícula donde brilla todo es un tablero.
//
// GLSL ES 3.00 — ver la nota de `GlSurface` sobre por qué estas superficies no
// usan el GLSL 1.0 del resto del toolkit.

export const LATTICE_FRAG = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2  u_res;
uniform float u_time;
uniform float u_motion;   // 0 con prefers-reduced-motion

uniform vec3  u_bg;       // fondo
uniform vec3  u_line;     // color de la retícula
uniform vec3  u_glow;     // color de la celda encendida
uniform float u_scale;    // celdas por pantalla
uniform float u_tilt;     // cuánto se inclina el plano (0 = plano, 1 = muy tumbado)
uniform float u_density;  // fracción de celdas encendidas
uniform float u_drift;    // velocidad de avance sobre el plano

float hash(vec2 p){
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

  // Perspectiva: el plano se aleja hacia arriba. El +0.55 mantiene el horizonte
  // FUERA del encuadre — con el horizonte visible la superficie se convierte en
  // un paisaje, y lo que se quiere es un plano inclinado.
  float depth = 1.0 / max(0.08, uv.y * u_tilt + 0.55);
  vec2 plane = vec2(uv.x * depth, depth);
  plane.y -= u_time * u_drift * u_motion;

  // Al eje isométrico: dos familias a ±30°, que es como está dibujado el resto
  // del material de la marca.
  vec2 iso = vec2(plane.x * 0.866 + plane.y * 0.5, -plane.x * 0.866 + plane.y * 0.5);
  vec2 cell = iso * u_scale;
  vec2 id = floor(cell);
  vec2 f = fract(cell);

  // Ancho de línea en píxeles y no en unidades del plano: sin esto las líneas
  // lejanas se vuelven más finas que un píxel y titilan al moverse.
  vec2 w = fwidth(cell) * 1.2;
  vec2 grid = smoothstep(w, vec2(0.0), f) + smoothstep(w, vec2(0.0), 1.0 - f);
  float line = clamp(max(grid.x, grid.y), 0.0, 1.0);

  // Qué celdas se encienden, y su latido.
  float seed = hash(id);
  float lit = step(1.0 - u_density, seed);
  float pulse = 0.35 + 0.65 * (0.5 + 0.5 * sin(u_time * 0.9 * u_motion + seed * 28.0));
  float cellFill = lit * pulse * (1.0 - smoothstep(0.0, 0.9, max(abs(f.x - 0.5), abs(f.y - 0.5)) * 2.0));

  // La distancia apaga todo: es lo que da profundidad sin dibujar un horizonte.
  float far = smoothstep(9.0, 0.6, depth);

  vec3 col = u_bg;
  col = mix(col, u_line, line * 0.55 * far);
  col = mix(col, u_glow, cellFill * 0.85 * far);

  // Grano fino: sin él los degradés largos del fondo muestran bandas en
  // pantallas de 8 bits.
  col += (hash(gl_FragCoord.xy) - 0.5) * 0.02;

  fragColor = vec4(col, 1.0);
}
`;
