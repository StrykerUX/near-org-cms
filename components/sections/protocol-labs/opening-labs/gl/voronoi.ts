// B · Shards — células que se reparten el plano.
//
// Un campo de Voronoi lento: puntos que derivan, y con ellos las fronteras de
// sus celdas. Es la representación más literal posible del tema de la página —
// un espacio partido en regiones que se redistribuyen— y la única de las cuatro
// superficies que explica algo en vez de acompañar.
//
// ── Lo que se dibuja es la FRONTERA, no la celda ──────────────────────────
//
// El valor que se pinta es la distancia a la arista más cercana (la clásica
// segunda pasada del Voronoi), no el índice de la celda. La diferencia importa:
// pintando celdas se obtiene un mosaico de colores planos —que se lee como un
// mapa político— y pintando fronteras se obtiene una red de líneas, que es lo
// que una red de shards es.
//
// ── Una celda encendida por vez ───────────────────────────────────────────
//
// Un hash decide cuál, y cambia cada pocos segundos. Es la lectura del tema:
// las regiones existen todas, pero el trabajo se mueve entre ellas. Encender
// varias a la vez deja un vitral.
//
// GLSL ES 3.00 — ver la nota de `GlSurface`.

export const VORONOI_FRAG = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2  u_res;
uniform float u_time;
uniform float u_motion;

uniform vec3  u_bg;
uniform vec3  u_edge;    // color de las fronteras
uniform vec3  u_glow;    // color de la celda activa
uniform float u_scale;   // celdas por pantalla
uniform float u_drift;   // velocidad de deriva de los puntos
uniform float u_edgeWidth;

vec2 hash2(vec2 p){
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  vec2 p = uv * u_scale;
  vec2 ip = floor(p);
  vec2 fp = fract(p);

  float t = u_time * u_drift * u_motion;

  // Primera pasada: el punto más cercano.
  vec2 bestOffset = vec2(0.0);
  vec2 bestId = vec2(0.0);
  float bestDist = 8.0;
  for (int j = -1; j <= 1; j++){
    for (int i = -1; i <= 1; i++){
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash2(ip + g);
      // Cada punto deriva por su cuenta, con fase propia: si todos se movieran
      // igual, el campo entero se trasladaría en vez de reorganizarse.
      o = 0.5 + 0.45 * sin(t + 6.28 * o);
      vec2 r = g + o - fp;
      float d = dot(r, r);
      if (d < bestDist){ bestDist = d; bestOffset = r; bestId = ip + g; }
    }
  }

  // Segunda pasada: distancia a la arista, o sea al plano medio entre este
  // punto y cada vecino. Es lo que da fronteras de ancho uniforme —una simple
  // resta de distancias las da más gruesas en los vértices.
  float edge = 8.0;
  for (int j = -2; j <= 2; j++){
    for (int i = -2; i <= 2; i++){
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash2(ip + g);
      o = 0.5 + 0.45 * sin(t + 6.28 * o);
      vec2 r = g + o - fp;
      vec2 diff = r - bestOffset;
      if (dot(diff, diff) > 0.0001){
        edge = min(edge, dot(0.5 * (bestOffset + r), normalize(diff)));
      }
    }
  }

  float w = fwidth(edge) * 1.5 + u_edgeWidth;
  float line = 1.0 - smoothstep(0.0, w, edge);

  // La celda activa. El índice cambia por tramos de tiempo, así que el
  // protagonismo salta de una región a otra en vez de desplazarse.
  float slot = floor(t * 0.22);
  vec2 activeId = floor(hash2(vec2(slot, 3.7)) * u_scale * 2.0 - u_scale);
  float isActive = step(length(bestId - activeId), 0.5);
  float fill = isActive * (1.0 - smoothstep(0.0, 0.35, edge)) * 0.0
             + isActive * smoothstep(0.0, 0.55, edge) * 0.5;

  // Viñeta suave: concentra la atención al centro y evita que las celdas de los
  // bordes compitan con el texto que va encima.
  float vig = smoothstep(1.35, 0.25, length(uv));

  vec3 col = u_bg;
  col = mix(col, u_edge, line * 0.75 * vig);
  col = mix(col, u_glow, fill * vig);
  col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.02;

  fragColor = vec4(col, 1.0);
}
`;
