import { NOISE_GLSL } from "@/components/sections/protocol-labs/gl/noise";

// La superficie del hero de la página — capas paralelas que fluyen, cada una por
// su cuenta.
//
// ── Es una COPIA, y por qué ────────────────────────────────────────────────
//
// Salió de `opening-labs/gl/layerflow.ts`, el shader de
// `/prototype/protocol-combo/layerflow`, cuando esa variante ganó. Se copió y no
// se importa por la regla del laboratorio: `a/` es la estructura elegida y un
// lab puede cambiar o borrarse sin aviso, así que la página no puede depender de
// él. Desde acá los dos evolucionan por separado — calibrar esta superficie ya
// no toca la ruta de comparación, que es lo que permite seguir usándola como
// referencia de dónde estaba el diseño.
//
// El mismo criterio que siguió `homepage-update/gl/foliage.ts` con su lab.
//
// ── De dónde sale ─────────────────────────────────────────────────────────
//
// Del motor del hero de la home (`homepage-update/gl/foliage.ts`), entero:
//
//   · un **punto de fuga** fuera del canvas al que apuntan las estrías;
//   · el campo **estirado** a lo largo de esa dirección, con la compresión
//     creciendo con la distancia al foco — cerca del foco las estrías son
//     cortas y se lee el detalle, lejos se alargan hasta fundirse;
//   · esa dirección **doblada** por un ruido lento, para que no sean rectas
//     perfectas (rectas se leen como un zoom blur de Photoshop);
//   · una **rampa de cinco tonos** con smoothstep entre paradas;
//   · **grano de película** encima.
//
// Es la misma técnica, no una imitación. Por eso se parece.
//
// ── Y qué le agrega: las capas ────────────────────────────────────────────
//
// El eje PERPENDICULAR al flujo se parte en franjas. Cada franja es una capa, y
// cada capa tiene tres cosas propias:
//
//   · **su propia velocidad** — avanza más rápido o más lento que sus vecinas;
//   · **su propio corte del ruido** — o sea, su propia textura;
//   · **su propia fase** — arranca en otro punto del campo.
//
// El resultado es que las estrías NO se continúan de una capa a la siguiente: se
// ve material fluyendo en carriles paralelos, deslizando unos sobre otros.
//
// ── Por qué eso es el concepto de la página y no un efecto ────────────────
//
// Dos frases del contenido, y las dos dicen lo mismo:
//
//   · el titular — *«The settlement layer for the agent economy»*;
//   · la sección 3 — *«Scalable sharding: more shards, more throughput, no
//     change for the developer.»*
//
// Un shard es exactamente eso: un carril que procesa por su cuenta, en paralelo
// con los demás, sin coordinarse cuadro a cuadro. Capas que fluyen independientes
// no es una metáfora de la arquitectura de NEAR — es su diagrama.
//
// Y la juntura entre capas se marca con LUZ, no con una línea: donde dos capas
// se tocan el campo baja de densidad y aparece un filo claro. Un contorno sería
// un elemento compitiendo con el titular; una variación de densidad, no.
//
// GLSL ES 3.00 — ver la nota de GlSurface.

export const HERO_SURFACE_FRAG = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2  u_res;
uniform float u_time;
uniform float u_motion;

// Centro de fuga, en coordenadas de pantalla normalizadas. Vive fuera del canvas:
// es el punto al que apuntan las estrías.
uniform vec2  u_focus;

uniform float u_scale;      // frecuencia base del campo
uniform float u_curl;       // cuánto se doblan las estrías respecto del radial puro
uniform float u_curlScale;  // tamaño de esa curvatura
uniform float u_blur;       // longitud del estirado
uniform float u_detail;     // segunda capa de alta frecuencia
uniform float u_detailFall; // a qué distancia del foco muere ese detalle
uniform float u_contrast;
uniform float u_lift;
uniform float u_gradAngle;  // dirección del degradé maestro, en radianes
uniform float u_gradSpread;
uniform float u_gradGamma;  // <1 abre las luces, >1 las comprime
uniform float u_gradMix;    // cuánto abolla el campo al degradé
uniform float u_grain;
uniform float u_drift;      // deriva temporal

uniform float u_layers;     // cuántas capas cruzan el campo
uniform float u_seam;       // ancho de la juntura entre capas
uniform float u_seamLift;   // cuánto aclara esa juntura
uniform float u_dither;     // amplitud del dither sobre el índice de la rampa

uniform vec3  u_c0;         // luz
uniform vec3  u_c1;
uniform vec3  u_c2;
uniform vec3  u_c3;
uniform vec3  u_c4;         // sombra

${NOISE_GLSL}

// Aspecto corregido contra la ALTURA y no contra el ancho: el ancho es la
// dimensión que más varía entre un monitor y un teléfono, y corrigiendo contra
// él el campo se deformaría en cada resize.
vec2 toField(vec2 frag) {
  return (frag - 0.5 * u_res) / u_res.y;
}

vec2 focusField() {
  return (u_focus * u_res - 0.5 * u_res) / u_res.y;
}

// Dirección que siguen las estrías en un punto: el radial desde el foco, rotado
// por un fbm lento. Sin esa rotación serían rectas perfectas y el resultado se
// leería como un filtro; lo que hace que parezca material y no efecto es que el
// flujo esté DOBLADO.
vec2 flowDir(vec2 p) {
  vec2 d = p - focusField();
  float r = max(length(d), 1e-4);
  vec2 radial = d / r;
  float sw = (fbm(p * u_curlScale + vec2(0.0, u_time * 0.02 * u_motion), 2) - 0.375) * u_curl;
  float c = cos(sw);
  float s = sin(sw);
  return mat2(c, -s, s, c) * radial;
}

// Dither ordenado de Bayer 4x4, calculado con aritmética en vez de una tabla.
//
// Se usa ORDENADO y no ruido blanco: a la misma amplitud, el patrón ordenado
// rompe el banding con bastante menos energía, porque distribuye los errores de
// cuantización de forma regular en vez de dejar que se agrupen por azar. Ruido
// blanco al nivel necesario para matar una banda ancha ya se ve como suciedad;
// esto no se ve en absoluto.
float bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2.0 + a.y * a.y * 0.75);
}

float bayer4(vec2 a) {
  return bayer2(0.5 * a) * 0.25 + bayer2(a);
}

vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0);
  // Cuatro tramos con smoothstep y no con mix lineal: con el lineal las paradas
  // se leen COMO paradas, y en un degradé que ocupa la pantalla entera esas
  // costuras son lo primero que delata que hay una rampa detrás.
  if (t < 0.25) return mix(u_c0, u_c1, smoothstep(0.0, 1.0, t / 0.25));
  if (t < 0.50) return mix(u_c1, u_c2, smoothstep(0.0, 1.0, (t - 0.25) / 0.25));
  if (t < 0.75) return mix(u_c2, u_c3, smoothstep(0.0, 1.0, (t - 0.50) / 0.25));
  return mix(u_c3, u_c4, smoothstep(0.0, 1.0, (t - 0.75) / 0.25));
}

void main() {
  vec2 p = toField(gl_FragCoord.xy);
  vec2 tg = flowDir(p);
  vec2 nm = vec2(-tg.y, tg.x);

  float r = length(p - focusField());
  float det = exp(-r * u_detailFall);

  // La compresión crece con la distancia al foco: cerca de él las estrías son
  // cortas y el detalle se lee; lejos se alargan hasta fundirse.
  float stretch = 1.0 + u_blur * (0.35 + r);

  // ── Las capas ────────────────────────────────────────────────────────────
  // El eje perpendicular al flujo se parte en franjas. Cada una recibe una
  // semilla propia, y de esa semilla salen su velocidad, su fase y su corte del
  // ruido — las tres cosas que hacen que una capa no se continúe en la
  // siguiente.
  float across = dot(p, nm);
  float lf = across * u_layers;
  float lid = floor(lf);
  float inl = fract(lf);

  float seed = hash(vec2(lid, 7.31));
  float speed = mix(0.45, 1.55, seed);

  float along = dot(p, tg) / stretch + u_time * u_drift * u_motion * speed + seed * 6.0;

  // La coordenada transversal usa 'inl' y no 'across': así cada capa muestrea su
  // propia región del ruido en vez de un tramo contiguo del mismo campo, que es
  // lo que las volvería una sola textura cortada en tiras.
  vec2 q = vec2(along, inl * 0.85 + seed * 11.0);

  float base = fbm(q * u_scale, 4);
  // La capa fina no se suma cruda: se centra en cero y se pondera. Sumada cruda
  // subiría el nivel medio del campo y aclararía la zona que tiene que cerrar en
  // verde profundo.
  // Dos octavas y no tres: con el buffer a resolución plena esta capa cuesta el
  // triple que antes, y la tercera octava cae por debajo del píxel en casi toda
  // la pantalla — se estaba pagando detalle que no llega a verse.
  float fine = (fbm(q * u_scale * 3.4 + 11.3, 2) - 0.5) * u_detail * det;
  float f = base + fine;

  // La juntura entre capas: el campo pierde densidad y aparece un filo CLARO.
  // Un contorno sería un elemento compitiendo con el titular; una variación de
  // densidad, no.
  float seam = smoothstep(0.0, u_seam, min(inl, 1.0 - inl));
  f -= (1.0 - seam) * u_seamLift;

  // El degradé maestro va por SEPARADO y el campo se SUMA como desviación.
  //
  // Con un mix() el ruido —centrado en 0.5— tira de la imagen entera hacia el
  // color central de la rampa y se lleva por delante los dos extremos: el crema
  // luminoso y el verde profundo desaparecen, y queda una lámina de verde medio.
  // Un promedio con una constante siempre aplana.
  vec2 g = vec2(cos(u_gradAngle), sin(u_gradAngle));
  float grad = clamp(dot(p, g) * u_gradSpread + 0.5, 0.0, 1.0);
  grad = pow(grad, u_gradGamma);

  // El contraste actúa sobre la DESVIACIÓN y no sobre el valor absoluto: subirlo
  // marca más las estrías sin desplazar el nivel general de luz.
  float dev = (f - 0.5) * u_contrast;

  float coord = clamp(grad + dev * u_gradMix + u_lift, 0.0, 1.0);

  // Dither sobre el ÍNDICE de la rampa, antes de mapear a color.
  //
  // Un degradé que cruza la pantalla entera reparte 256 niveles de 8 bits sobre
  // miles de píxeles, así que cada nivel ocupa una franja ancha y las fronteras
  // entre franjas se ven como bandas. Es banding de cuantización y no tiene nada
  // que ver con la resolución del buffer — a resolución plena se ve igual.
  //
  // La amplitud NO es 1/256. El índice recorre 0..1 en cuatro tramos, y cada
  // tramo cubre la distancia de color entre dos paradas de la rampa: con paradas
  // separadas por ~40 niveles, un nivel son ~0.006 de índice, no 0.004. Un
  // dither calculado sobre 1/256 se queda corto por casi la mitad, que es
  // exactamente por qué el banding sobrevivió al primer intento.
  coord += (bayer4(gl_FragCoord.xy) - 0.5) * u_dither;

  vec3 col = ramp(clamp(coord, 0.0, 1.0));

  // Grano cuantizado en el tiempo: un grano que corre más rápido que la imagen
  // se lee como ruido de compresión y no como emulsión.
  float n = hash(gl_FragCoord.xy + floor(u_time * 8.0 * u_motion) * 7.13);
  col += (n - 0.5) * u_grain;

  fragColor = vec4(col, 1.0);
}
`;
