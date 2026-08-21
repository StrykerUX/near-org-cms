// Tres lecturas del mismo frame de referencia: follaje verde en motion blur
// direccional-curvo, con la luz entrando por arriba-izquierda y el campo
// cerrándose en verde casi negro hacia el borde derecho.
//
// La observación que ordena las tres: el blur de la referencia NO es isotrópico
// y NO es uniforme. Las estrías se abren en abanico hacia la derecha y ganan
// definición ahí, mientras que a la izquierda se disuelven en un degradé casi
// liso. Eso es la firma de un centro de fuga FUERA del canvas, a la derecha —
// sea porque la cámara barrió hacia él, sea porque el zoom se abrió desde él.
//
// De ahí las tres variantes, que se diferencian en CÓMO producen el blur:
//
//   A · stretch — no hay blur. Se comprime el dominio del ruido a lo largo del
//       flujo, así que el propio fbm nace estirado. Una sola muestra por píxel:
//       es, de lejos, la más barata, y el grano de estría sale gratis.
//   B · sweep — blur direccional de verdad: N muestras a lo largo de la
//       tangente del flujo, promediadas. Cuesta N veces A, pero disuelve las
//       masas con la suavidad que el estirado no consigue.
//   C · zoom — blur radial desde el centro de fuga: las muestras se toman
//       escalando el plano respecto de ese centro. Es la que reproduce el
//       abanico del borde derecho por construcción y no por ajuste.
//
// GLSL 1.0 (sin `#version`) sobre contexto WebGL2, igual que `hero-alt/shaders`
// y `hero-burst`: no hace falta nada de ES 3.0 acá, y mezclar las dos versiones
// en el repo obliga a recordar cuál es cuál en cada archivo.

export const FOLIAGE_VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

// ── Lo que comparten las tres ───────────────────────────────────────────────
//
// Se concatena al principio de cada fragment en vez de vivir en tres copias.
// Cuando la calibración toque el ruido o la rampa —que es lo que más se toca—
// hay un solo lugar donde tocarlo, y las tres variantes siguen siendo
// comparables entre sí. Si cada una tuviera su propio fbm, una diferencia de
// calibración se leería como una diferencia de técnica.
const COMMON = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;

// Centro de fuga, en coordenadas de pantalla normalizadas (0..1). Vive fuera
// del canvas a la derecha: es el punto al que apuntan las estrías.
uniform vec2  u_focus;

uniform float u_scale;      // frecuencia base del campo
uniform float u_curl;       // cuánto se doblan las estrías respecto del radial puro
uniform float u_curlScale;  // tamaño de esa curvatura
uniform float u_blur;       // longitud del blur (estirado en A, recorrido en B y C)
uniform float u_detail;     // segunda capa de alta frecuencia: las "hojas"
uniform float u_detailFall; // a qué distancia del foco muere ese detalle
uniform float u_contrast;
uniform float u_lift;
uniform float u_gradAngle;  // dirección del degradé maestro, en radianes
uniform float u_gradSpread; // cuánto campo cubre el degradé
uniform float u_gradGamma;  // curva del degradé: <1 abre las luces, >1 las comprime
uniform float u_gradMix;    // amplitud con la que el campo abolla el degradé
uniform float u_grain;
uniform float u_drift;      // deriva temporal — 0 congela el cuadro

uniform vec3  u_c0;         // luz  (crema verdoso)
uniform vec3  u_c1;
uniform vec3  u_c2;
uniform vec3  u_c3;
uniform vec3  u_c4;         // sombra (verde casi negro)

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Value noise y no simplex, por el mismo motivo que en \`hero-alt/flowField\`: el
// gradiente de simplex cuesta el doble de ALU y acá el resultado pasa por varias
// octavas y un warp que se comen la diferencia. Lo que importa es que sea
// barato — sobre todo en B y C, donde se evalúa una docena de veces por píxel.
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // Quintic y no el smoothstep cúbico: la segunda derivada continua es lo que
  // evita las bandas visibles en las diagonales del fbm.
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(hash(i),                hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm4(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    // La rotación entre octavas rompe el enrejado del value noise, que si no
    // deja ejes visibles a 0° y 90° — muy legibles justamente cuando el campo
    // se estira en una dirección, que es todo lo que hace este shader.
    p = mat2(1.6, 1.2, -1.2, 1.6) * p;
    a *= 0.5;
  }
  return v;
}

float fbm2(vec2 p) {
  float v = 0.5 * vnoise(p);
  p = mat2(1.6, 1.2, -1.2, 1.6) * p;
  return v + 0.25 * vnoise(p);
}

// Aspecto corregido contra la ALTURA, no contra el ancho: el ancho es la
// dimensión que más varía entre un monitor y un teléfono, y corrigiendo contra
// él el campo se deformaría en cada resize.
vec2 toField(vec2 frag) {
  return (frag - 0.5 * u_res) / u_res.y;
}

vec2 focusField() {
  return (u_focus * u_res - 0.5 * u_res) / u_res.y;
}

// Dirección que siguen las estrías en un punto: el radial desde el foco, rotado
// por un fbm lento. Sin esa rotación las estrías serían rectas perfectas y el
// resultado se leería como un zoom blur de Photoshop; la referencia tiene el
// flujo DOBLADO, que es lo que la hace parecer follaje movido y no un filtro.
vec2 flowDir(vec2 p) {
  vec2 d = p - focusField();
  float r = max(length(d), 1e-4);
  vec2 radial = d / r;
  float sw = (fbm2(p * u_curlScale + vec2(0.0, u_time * 0.02 * u_drift)) - 0.375) * u_curl;
  float c = cos(sw);
  float s = sin(sw);
  return mat2(c, -s, s, c) * radial;
}

// El campo de follaje en un punto, ya con la capa de detalle. \`det\` es 0..1 y
// llega desde afuera porque cada variante lo calcula en su propio sitio del
// recorrido: en A una vez, en B y C por muestra.
float foliage(vec2 p, float det) {
  float base = fbm4(p * u_scale);
  // La capa fina no se suma a secas: se centra en cero y se pondera. Sumada
  // cruda subiría el nivel medio del campo y aclararía la zona derecha, que es
  // justo la que tiene que cerrar en verde oscuro.
  float fine = (fbm4(p * u_scale * 3.7 + 11.3) - 0.5) * u_detail * det;
  return base + fine;
}

vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0);
  // Cuatro tramos con smoothstep y no mix lineal: con el lineal las paradas se
  // leen COMO paradas, y en un degradé que ocupa la pantalla entera esas cinco
  // costuras son lo primero que delata que hay una rampa detrás.
  if (t < 0.25) return mix(u_c0, u_c1, smoothstep(0.0, 1.0, t / 0.25));
  if (t < 0.50) return mix(u_c1, u_c2, smoothstep(0.0, 1.0, (t - 0.25) / 0.25));
  if (t < 0.75) return mix(u_c2, u_c3, smoothstep(0.0, 1.0, (t - 0.50) / 0.25));
  return mix(u_c3, u_c4, smoothstep(0.0, 1.0, (t - 0.75) / 0.25));
}

// Índice de la rampa: el degradé maestro, ABOLLADO por el campo.
//
// El degradé va por SEPARADO y no como una octava más del ruido. Es lo que fija
// de dónde viene la luz, y tiene que sobrevivir intacto a cualquier calibración
// del follaje: si saliera del mismo fbm, subir el detalle movería la luz.
//
// ⚠️ El campo se SUMA como desviación; no se mezcla con \`mix()\`.
//
// Con un mix() el ruido —que está centrado en 0.5— tira de la imagen entera
// hacia el color CENTRAL de la rampa, y se lleva por delante los dos extremos:
// el crema de la esquina iluminada y el verde casi negro del borde en sombra
// desaparecen, y queda una lámina de verde medio uniforme. Es un promedio, y un
// promedio con una constante siempre aplana.
//
// Sumando la desviación respecto de 0.5, el degradé conserva su recorrido
// completo 0..1 y el follaje lo abolla localmente — que es lo que hace la luz
// atravesando hojas: no cambia de dónde viene, cambia cuánta pasa.
float rampCoord(vec2 p, float f) {
  vec2 g = vec2(cos(u_gradAngle), sin(u_gradAngle));
  float grad = clamp(dot(p, g) * u_gradSpread + 0.5, 0.0, 1.0);

  // Curva sobre el degradé, antes de que el follaje lo abolle.
  //
  // Un degradé LINEAL reparte los tonos por igual a lo largo del eje, y esa es
  // una distribución que la referencia no tiene: ahí la luz está concentrada en
  // una esquina y cae deprisa, con el grueso del cuadro ya en los verdes
  // medios. Sin esta curva solo se puede elegir entre "todo medio" (spread bajo)
  // y "dos bloques planos con una costura diagonal" (spread alto) — que es
  // exactamente entre lo que se estaba oscilando al calibrar.
  //
  // gamma < 1 estira la zona clara; > 1 la aprieta contra la esquina.
  grad = pow(grad, u_gradGamma);

  // El contraste actúa sobre la DESVIACIÓN, no sobre el valor absoluto: subirlo
  // marca más las estrías sin desplazar el nivel general de luz.
  float dev = (f - 0.5) * u_contrast;

  return clamp(grad + dev * u_gradMix + u_lift, 0.0, 1.0);
}

// Grano de película. El \`u_drift\` lo deja quieto cuando el cuadro está quieto:
// un grano que hierve sobre una imagen congelada se lee como ruido de
// compresión, no como emulsión.
vec3 filmGrain(vec3 col, float amount) {
  float n = hash(gl_FragCoord.xy + floor(u_time * 12.0 * u_drift) * 7.13);
  return col + (n - 0.5) * amount;
}
`;

// ── A · stretch ─────────────────────────────────────────────────────────────
//
// Una muestra por píxel. El truco es que el dominio se lleva a la base
// (tangente, normal) del flujo y se COMPRIME a lo largo de la tangente antes de
// muestrear: el ruido nace estirado en esa dirección, que es exactamente lo que
// un blur direccional produciría, pero sin promediar nada.
//
// Lo que esta variante no puede dar: la disolución de las masas. Un estirado
// mantiene el contraste local a lo ancho de la estría, mientras que un blur de
// verdad lo baja. Por eso A se lee siempre un punto más "fibrosa" que la
// referencia. A cambio corre a pantalla completa por menos que un gradiente CSS.
export const FOLIAGE_FRAG_STRETCH =
  COMMON +
  `
void main() {
  vec2 p = toField(gl_FragCoord.xy);
  vec2 t = flowDir(p);
  vec2 n = vec2(-t.y, t.x);

  float r = length(p - focusField());
  float det = exp(-r * u_detailFall);

  // La compresión crece con la distancia al foco: cerca de él las estrías son
  // cortas y el detalle se lee; lejos se alargan hasta fundirse. Es lo que en la
  // referencia hace que la izquierda sea casi un degradé liso.
  float stretch = 1.0 + u_blur * (0.35 + r);

  // Proyectar sobre la base del flujo, comprimir la tangente, muestrear.
  vec2 q = vec2(dot(p, t) / stretch, dot(p, n));
  q += vec2(u_time * 0.015 * u_drift, 0.0);

  float f = foliage(q, det);

  vec3 col = ramp(rampCoord(p, f));
  col = filmGrain(col, u_grain);
  gl_FragColor = vec4(col, 1.0);
}
`;

// ── B · sweep ───────────────────────────────────────────────────────────────
//
// Blur direccional honesto: TAPS muestras repartidas sobre la tangente del
// flujo y promediadas con pesos triangulares.
//
// 13 taps y no 8 ni 32. Por debajo de ~11 el promedio deja escalones visibles
// en las zonas planas —se ven las muestras individuales como fantasmas—, y por
// encima de ~16 la diferencia ya no se ve pero el costo sigue subiendo lineal.
//
// El recorrido se re-evalúa por muestra (\`flowDir\` dentro del loop) en vez de
// fijar la tangente una vez: con la tangente fija el barrido es RECTO y las
// estrías pierden justo la curvatura que las hace parecer follaje. Cuesta un
// fbm2 extra por tap y es lo que separa esta variante de un blur de librería.
export const FOLIAGE_FRAG_SWEEP =
  COMMON +
  `
#define TAPS 13

void main() {
  vec2 p = toField(gl_FragCoord.xy);
  float r = length(p - focusField());
  float det = exp(-r * u_detailFall);

  // Igual que en A: el barrido se alarga al alejarse del foco.
  float len = u_blur * (0.05 + r * 0.14);

  float acc = 0.0;
  float wsum = 0.0;

  for (int i = 0; i < TAPS; i++) {
    float k = float(i) / float(TAPS - 1) - 0.5;   // -0.5 .. 0.5
    // Peso triangular: la muestra del centro pesa el doble que las de los
    // extremos. Con pesos planos el blur se lee como una copia fantasma en cada
    // punta del recorrido en vez de como una estela.
    float w = 1.0 - abs(k) * 2.0 * 0.75;

    // La posición de la muestra sigue el flujo LOCAL, no el del píxel.
    vec2 sp = p;
    vec2 dir = flowDir(sp);
    sp += dir * k * len;

    sp += vec2(u_time * 0.015 * u_drift, 0.0);
    acc += foliage(sp, det) * w;
    wsum += w;
  }

  float f = acc / wsum;

  vec3 col = ramp(rampCoord(p, f));
  col = filmGrain(col, u_grain);
  gl_FragColor = vec4(col, 1.0);
}
`;

// ── C · zoom ────────────────────────────────────────────────────────────────
//
// Blur radial desde el foco: cada muestra se toma escalando el plano respecto
// de ese punto, que es literalmente lo que hace una cámara que se abre.
//
// Es la única de las tres en la que el abanico del borde derecho sale por
// construcción: las muestras divergen al alejarse del foco porque el escalado
// las separa más cuanto mayor es el radio. En A y B ese abanico hay que
// perseguirlo a mano con \`u_blur\`.
//
// El escalado se aplica al DOMINIO del ruido y no a una textura, así que no hay
// bordes que se estiren ni resolución que se pierda: el campo es analítico y se
// puede muestrear tan lejos como haga falta.
export const FOLIAGE_FRAG_ZOOM =
  COMMON +
  `
#define TAPS 13

void main() {
  vec2 p = toField(gl_FragCoord.xy);
  vec2 fc = focusField();
  float r = length(p - fc);
  float det = exp(-r * u_detailFall);

  float acc = 0.0;
  float wsum = 0.0;

  for (int i = 0; i < TAPS; i++) {
    float k = float(i) / float(TAPS - 1);          // 0 .. 1
    // El escalado arranca en 1 y se abre: las muestras van del punto hacia
    // afuera del foco, nunca hacia adentro. Un barrido simétrico cruzaría el
    // foco y emborronaría la zona definida, que es la que tiene que quedar
    // legible.
    float sc = 1.0 + u_blur * k * 0.55;
    vec2 sp = fc + (p - fc) * sc;

    // La curvatura entra igual que en B, como un desvío lateral del rayo. Sin
    // esto el resultado es un zoom blur puro: correcto en la forma, pero
    // demasiado limpio para leerse como vegetación.
    vec2 dir = flowDir(sp);
    vec2 nrm = vec2(-dir.y, dir.x);
    sp += nrm * (fbm2(sp * u_curlScale * 1.7) - 0.375) * u_curl * 0.35 * r;

    // Peso decreciente: la muestra sin escalar manda, y las estiradas aportan
    // la estela. Con pesos planos el centro de fuga se aclara de más, porque
    // todas las muestras lejanas convergen ahí.
    float w = 1.0 - k * 0.72;

    sp += vec2(u_time * 0.015 * u_drift, 0.0);
    acc += foliage(sp, det) * w;
    wsum += w;
  }

  float f = acc / wsum;

  vec3 col = ramp(rampCoord(p, f));
  col = filmGrain(col, u_grain);
  gl_FragColor = vec4(col, 1.0);
}
`;

export type FoliageVariant = "stretch" | "sweep" | "zoom";

export const FOLIAGE_FRAG: Record<FoliageVariant, string> = {
  stretch: FOLIAGE_FRAG_STRETCH,
  sweep: FOLIAGE_FRAG_SWEEP,
  zoom: FOLIAGE_FRAG_ZOOM,
};
