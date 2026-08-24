import { NOISE_GLSL } from "@/components/primitives/gl/noise";

// La superficie del armazón «escenario»: un terreno de curvas de nivel que
// deriva.
//
// ── Por qué curvas de nivel y no otra cosa ────────────────────────────────
//
// Este repo ya tiene dos superficies con shader y las dos están tomadas: el hero
// de la homepage es un follaje que se comprime, y las aperturas de protocol son
// cintas (`layerflow`) y columnas (`spectrum`). Una tercera página con cintas
// sería la misma superficie con otro color, y el punto de estas variantes es que
// se distingan.
//
// Las curvas de nivel aportan algo que ninguna de las otras dos tiene: **leen
// como una medición**. Una cinta es atmósfera y una columna es actividad; un
// contorno es un dato del terreno, y las cuatro páginas que lo van a usar
// —fundación, economía, historia, comunidad— hablan justamente de terrenos que
// alguien midió. La superficie no ilustra el tema, comparte su gramática.
//
// Y hay una razón de composición: un mapa de nivel tiene ZONAS PLANAS. Entre dos
// curvas hay una meseta de color liso donde un titular se apoya sin competir con
// nada, que es exactamente lo que a un hero con shader se le suele romper.
//
// ── El ancho de línea sale de `fwidth` ────────────────────────────────────
//
// La curva se dibuja midiendo cuánto cambia el campo entre dos píxeles vecinos y
// pintando donde ese cambio cruza un múltiplo de la banda. Es lo que mantiene la
// línea a UN píxel en toda la pantalla: donde el terreno es empinado las curvas
// se juntan y donde es plano se separan, pero ninguna se engorda. Hacerlo con un
// `smoothstep` de ancho fijo da líneas gruesas en las zonas planas y líneas que
// desaparecen en las empinadas — el defecto clásico de este efecto.
//
// `fwidth` es lo que obliga a GLSL ES 3.00; ver la nota larga en `GlSurface`.
//
// ⚠️ Sin backticks acá dentro: cierran el template literal.

export const CONTOUR_FRAG = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2  u_res;
uniform float u_time;
uniform float u_motion;

uniform vec3  u_bg;     // la meseta más baja
uniform vec3  u_high;   // la meseta más alta
uniform vec3  u_line;   // la curva de nivel
uniform float u_bands;  // cuántos niveles cruzan el rango
uniform float u_scale;  // tamaño del terreno; más chico = colinas más anchas
uniform float u_speed;
uniform float u_tilt;   // 0 = terreno plano en pantalla, 1 = horizonte marcado
uniform float u_lineOpacity;

${NOISE_GLSL}

void main(){
  // Se normaliza por la ALTURA en los dos ejes: dividir cada eje por el suyo
  // estira el terreno en pantallas anchas y las colinas salen ovaladas.
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

  float t = u_time * u_speed * u_motion;

  // Dominio deformado por su propio ruido: sin esto el campo deriva como un
  // bloque rígido y se lee como una textura que se mueve, no como un terreno.
  vec2 q = uv * u_scale;
  vec2 warp = vec2(fbm(q + vec2(0.0, t * 0.35), 3), fbm(q + vec2(5.2, 1.3 - t * 0.27), 3));
  float h = fbm(q + warp * 1.3 + vec2(t * 0.08, 0.0), 4);

  // La inclinación sube el terreno hacia arriba de la pantalla: le da una
  // dirección, y con ella un horizonte donde apoyar el titular.
  h += (uv.y + 0.5) * u_tilt * 0.35;

  // ── las mesetas ──────────────────────────────────────────────────────────
  float level = floor(h * u_bands) / u_bands;
  vec3 base = mix(u_bg, u_high, clamp(level * 1.15, 0.0, 1.0));

  // ── la curva ─────────────────────────────────────────────────────────────
  // Distancia al múltiplo de banda más cercano, en unidades de la propia
  // pendiente: por eso la línea mide lo mismo en todo el cuadro.
  float f = h * u_bands;
  float d = abs(fract(f) - 0.5);
  float w = fwidth(f);
  float line = 1.0 - smoothstep(0.5 - w * 1.5, 0.5 - w * 0.5, d);

  vec3 out_ = mix(base, u_line, line * u_lineOpacity);

  // Grano: rompe el banding de las mesetas, que a ocho niveles se ve en
  // cualquier pantalla de 8 bits.
  out_ += (hash(gl_FragCoord.xy * 0.017) - 0.5) * 0.018;

  fragColor = vec4(out_, 1.0);
}
`;
