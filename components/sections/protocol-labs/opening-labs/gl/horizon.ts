// F · Horizon — la única superficie cálida de las seis.
//
// Un degradé profundo cruzado por una banda de luz, con grano. No representa
// nada: es atmósfera, y está acá porque las otras cinco aperturas son
// geométricas o tipográficas y ninguna aporta lo que una fotografía de
// amanecer aporta a la portada de Ondo — calor, y la sensación de que hay algo
// detrás del texto.
//
// ── Por qué abstracto y no una foto ───────────────────────────────────────
//
// No hay banco de imágenes ni presupuesto de render para esta página. Un
// degradé con banda y grano da la misma temperatura sin depender de un asset, y
// además escala a cualquier proporción sin recortar mal — que es la mitad del
// trabajo de mantener una foto de portada.
//
// ── El grano no es un adorno ──────────────────────────────────────────────
//
// Un degradé de esta amplitud muestra bandas visibles en pantallas de 8 bits, y
// el grano las rompe. De paso hace la diferencia entre "degradé de CSS" y
// "superficie": es el detalle que más aleja a esta pieza de un `linear-gradient`.
//
// GLSL ES 3.00 — ver la nota de `GlSurface`.

export const HORIZON_FRAG = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2  u_res;
uniform float u_time;
uniform float u_motion;

uniform vec3  u_deep;    // el fondo, abajo
uniform vec3  u_mid;
uniform vec3  u_light;   // la banda
uniform float u_horizon; // altura de la banda, 0..1
uniform float u_spread;  // cuánto se abre
uniform float u_grain;
uniform float u_drift;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time * u_drift * u_motion;

  // La banda no es recta: una ondulación muy baja la hace parecer un horizonte
  // atmosférico y no una línea de CSS. La frecuencia es deliberadamente menor a
  // 1 ciclo por pantalla — más que eso se lee como una ola.
  float wob = noise(vec2(uv.x * 0.8 + t * 0.05, t * 0.03)) - 0.5;
  float h = u_horizon + wob * 0.06;

  float d = abs(uv.y - h);
  float glow = exp(-d * d / max(0.0005, u_spread * u_spread));

  // El fondo: profundo abajo, medio arriba. El punto de mezcla acompaña a la
  // banda para que el degradé no la contradiga.
  vec3 col = mix(u_deep, u_mid, smoothstep(0.0, 1.0, uv.y * 0.85 + 0.1));
  col = mix(col, u_light, glow * 0.9);

  // Nubes: una capa de ruido muy suave que rompe la perfección del degradé.
  float clouds = noise(vec2(uv.x * 2.2 + t * 0.08, uv.y * 3.4 - t * 0.04));
  col *= mix(0.94, 1.06, clouds);

  // Viñeta: el texto va al centro-izquierda y los bordes tienen que ceder.
  col *= mix(0.72, 1.0, smoothstep(1.25, 0.2, length(uv - 0.5)));

  col += (hash(gl_FragCoord.xy + t) - 0.5) * u_grain;
  fragColor = vec4(col, 1.0);
}
`;
