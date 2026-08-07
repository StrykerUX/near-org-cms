// Shaders del material de los covers de LatestUpdates.
// GLSL ES 3.00 (WebGL2).
//
// ⚠️ `#version 300 es` DEBE ser el primer byte del source — pegado al backtick.
// Un solo `\n` adelante y el compilador asume GLSL ES 1.00.
//
// ⚠️ Y NINGÚN backtick dentro de los template literals, ni en un comentario de
// GLSL: cierra el string y el error que tira TypeScript ("',' expected") apunta
// a la línea siguiente, no a la culpable.

export const FLOW_FIELD_VERTEX = `#version 300 es
precision highp float;

out vec2 vUv;

void main() {
  // vertexID 0,1,2 -> (0,0), (2,0), (0,2): un triángulo sobredimensionado que
  // cubre todo el clip-space. Sin VBO que crear, subir ni borrar.
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

/**
 * Un campo de color suave, arrastrado por un flujo de ruido.
 *
 * Dos etapas, y el orden importa: primero se deforma la COORDENADA con un campo
 * vectorial de ruido, y recién después se evalúa el color en la coordenada ya
 * deformada. Al revés —deformar el color— daría un desenfoque, no un flujo: lo
 * que produce las vetas que se estiran y se enroscan es que puntos vecinos
 * terminen leyendo zonas lejanas del campo.
 *
 *   1. BASE. Dos focos de luz con falloff exponencial, cada uno aportando SU
 *      PROPIO color. Con una rampa única sobre una intensidad escalar es
 *      imposible tener cyan en una zona y amarillo en otra: todo el material
 *      recorrería los mismos colores en el mismo orden. Con color por foco, el
 *      tercer stop aparece solo donde los dos se superponen — y esa zona se
 *      mueve, porque los focos derivan.
 *   2. FLUJO. Ocho pasos que empujan el uv en la dirección que dicta el ruido.
 *      Un solo paso daría un desplazamiento suave; es la ITERACIÓN la que
 *      acumula el estirado y arma las vetas.
 *   3. RUIDO GRADIENTE 3D, no value noise. Tres dimensiones porque el tiempo
 *      entra por la tercera: así el campo EVOLUCIONA en lugar de trasladarse
 *      (un campo 2D animado por traslación se lee como una textura que se
 *      desliza, no como algo vivo). Y gradiente en vez de value porque ocho
 *      iteraciones amplifican los artefactos alineados a ejes del value noise
 *      hasta hacerlos visibles como una grilla.
 *   4. GRANO. Ruido fino sumado al final. Sin bandas duras que lo disimulen,
 *      un degradado así de suave BANDEA en 8 bits — acá el grano no es textura
 *      de film, es lo que evita los escalones.
 *
 * ── Por qué esto no puede lavarse con el tiempo ──────────────────────────────
 * El material anterior (bandas) tenía un `+ uTime * 0.012` dentro de la
 * coordenada de muestreo. Ese término crecía sin límite, así que a los ~90 s el
 * muestreo se alejaba de los focos y el cover se iba a gris plano.
 *
 * Acá eso es imposible por construcción, no por elegir mejor las constantes:
 * el tiempo entra ÚNICAMENTE por el eje z del ruido y por los senos acotados de
 * la deriva de los focos, nunca por una coordenada que se use para muestrear
 * color. Y `flow()` devuelve `mix(uv, clamp(st, 0, 1), MIX)`, que está acotado
 * en [0,1] pase lo que pase.
 */
export const FLOW_FIELD_FRAGMENT = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform float uTime;        // segundos
uniform float uHover;       // 0 = reposo · 1 = puntero encima
uniform float uAspect;      // ancho/alto del canvas
uniform vec2  uMouse;       // [0,1] relativo a la card; (0.5,0.5) en reposo
uniform vec3  uC1;          // los 4 stops, del más saturado al neutro
uniform vec3  uC2;
uniform vec3  uC3;
uniform vec3  uC4;

const int   STEPS = 8;
const float AMP   = 0.020;  // cuánto empuja cada paso
const float TURN  = 12.72;  // radianes de giro máximo (729°)
const float MIX   = 0.55;   // cuánto del uv deformado se aplica
const float GRAIN = 0.030;
const float HOVER_GAIN = 0.9;   // el flujo casi se duplica con el puntero encima
const float BANDS  = 8.0;       // franjas que modulan la aberración
const float CHROMA = 0.022;     // separación máxima entre canales, en uv

// ── Ruido ──────────────────────────────────────────────────────────────────
float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Hash a un vector 3D en [-1,1]: son los gradientes de las esquinas de la celda.
vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1137, 0.1379));
  p += dot(p, p.yxz + 19.19);
  return -1.0 + 2.0 * fract(vec3(
    (p.x + p.y) * p.z,
    (p.x + p.z) * p.y,
    (p.y + p.z) * p.x
  ));
}

// Ruido gradiente 3D. A diferencia del value noise, el valor en cada esquina no
// es un escalar random sino el producto punto entre un gradiente random y el
// vector hacia el punto: eso es lo que le saca la estructura de grilla.
float gnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = p - i;
  // Smootherstep (6t⁵-15t⁴+10t³) en vez de smoothstep: su segunda derivada es
  // continua, y sin eso el flujo muestra discontinuidades en los bordes de celda
  // después de acumular ocho pasos.
  vec3 w = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

  float n000 = dot(hash33(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0));
  float n100 = dot(hash33(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0));
  float n010 = dot(hash33(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0));
  float n110 = dot(hash33(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0));
  float n001 = dot(hash33(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0));
  float n101 = dot(hash33(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0));
  float n011 = dot(hash33(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0));
  float n111 = dot(hash33(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0));

  return mix(
    mix(mix(n000, n100, w.x), mix(n010, n110, w.x), w.y),
    mix(mix(n001, n101, w.x), mix(n011, n111, w.x), w.y),
    w.z
  );
}

float dot2(vec2 v) { return dot(v, v); }

/**
 * El color del campo en un punto, sin deformar.
 *
 * Los focos derivan con senos de frecuencias inconmensurables entre sí, así el
 * recorrido no se repite de forma perceptible ni se lee como un vaivén. Están
 * acotados a y ∈ [0.13, 0.79] y x ∈ [0.10, 0.90] — dentro del cover, siempre.
 */
vec3 base(vec2 p, float t) {
  vec2 a = vec2(0.30 + 0.20 * sin(t * 0.19), 0.62 + 0.17 * cos(t * 0.13));
  vec2 b = vec2(0.74 + 0.16 * cos(t * 0.11), 0.30 + 0.19 * sin(t * 0.17));

  // Falloff exponencial ancho: núcleo brillante con halo largo. El aspecto
  // 1:1.15 estira los focos en vertical.
  float ga = exp(-dot2((p - a) * vec2(1.0, 1.15)) * 3.0);
  float gb = exp(-dot2((p - b) * vec2(1.0, 1.15)) * 3.6);

  vec3 c = uC4;                                       // fondo neutro
  c = mix(c, uC1, smoothstep(0.04, 0.72, ga));        // foco A
  c = mix(c, uC3, smoothstep(0.04, 0.72, gb));        // foco B
  c = mix(c, uC2, smoothstep(0.55, 1.15, ga + gb));   // donde se superponen
  // Sobreexposición del núcleo: un toque a blanco.
  return mix(c, vec3(1.0), smoothstep(1.20, 1.70, ga + gb) * 0.5);
}

/**
 * Empuja el uv siguiendo el campo vectorial del ruido.
 *
 * sprd se divide por el aspecto para que la escala del flujo sea la misma en
 * las dos direcciones: sin eso, en una card apaisada las vetas salen estiradas
 * en horizontal por la geometría y no por el diseño.
 */
vec2 flow(vec2 uv, float t) {
  vec2 aspect = vec2(uAspect, 1.0);
  float sprd = 0.12 / ((uAspect + 1.0) * 0.5);
  float freq = 5.0 * sprd;
  float amt = AMP * (1.0 + uHover * HOVER_GAIN);

  // El mouse traslada el ORIGEN del muestreo del ruido, no la intensidad: el
  // patrón se desliza bajo el puntero en vez de deformarse más cerca de él.
  vec2 origin = 1.0 - uMouse;

  vec2 st = uv;
  for (int i = 0; i < STEPS; i++) {
    // El clamp acota la coordenada ANTES de muestrear: sin él, un paso que se
    // fue lejos sigue acumulando y el error se dispara.
    vec2 scaled = (clamp(st, -1.0, 2.0) - 0.5) * aspect + origin;
    float n = gnoise(vec3((scaled - 0.5) * freq, t));
    float ang = n * TURN;
    st += vec2(cos(ang), sin(ang)) * amt;
  }
  return mix(uv, clamp(st, 0.0, 1.0), MIX);
}

/**
 * Aberración cromática con estructura de franjas.
 *
 * Es la firma visual que le faltaba: el fleco de color en los bordes de las
 * manchas. Sale de separar los canales R y B en direcciones opuestas antes de
 * evaluar el color, de modo que cada uno lee el campo desde un punto ligeramente
 * distinto.
 *
 * Lo que la hace parecer diseñada y no un defecto es que la separación NO es
 * uniforme: se modula por franjas horizontales. Sin eso el fleco aparece igual
 * en toda la superficie y se lee como una lente barata; por franjas, aparece
 * concentrado en unas zonas y ausente en otras.
 *
 * Se evalúa la base tres veces, una por canal. Es asumible porque la base son
 * dos exponenciales y nada más — lo caro de este shader son las 8 iteraciones de
 * ruido del flujo, que se hacen UNA sola vez y se comparten entre los tres.
 */
vec3 aberrate(vec2 p, float t, float amount) {
  // La franja va sobre la coordenada YA deformada por el flujo, no sobre vUv:
  // así las bandas siguen al campo en vez de quedar clavadas en la pantalla,
  // que es lo que las delataría como un overlay.
  float band = fract(p.y * BANDS);
  // Triangular en vez de fract crudo: fract salta de 1 a 0 y ese corte se ve
  // como una línea dura entre franjas.
  float seg = 1.0 - abs(band * 2.0 - 1.0);

  vec2 dir = vec2(0.0, 1.0) * amount * seg;
  return vec3(
    base(p - dir, t).r,
    base(p, t).g,
    base(p + dir, t).b
  );
}

void main() {
  // ── Los dos diales de velocidad ──────────────────────────────────────────
  // Dos escalas distintas a propósito: el flujo se reorganiza a un ritmo y los
  // focos derivan a otro. Si compartieran una, el conjunto se leería como una
  // sola animación en loop.
  //
  // tFlow avanza el eje z del ruido: con 0.04 el campo se reordena de forma
  // perceptible en ~15-25 s. tBase mueve los focos, cuyo seno más rápido es
  // 0.19, o sea un período de ~66 s. Los dos van más rápido que el export de
  // referencia (0.0166), y a propósito: ahí la fuente es un JPG con mucho
  // detalle y cualquier micro-movimiento se nota, mientras que una base
  // procedural suave a esa velocidad se lee como una imagen estática.
  float tFlow = uTime * 0.040;
  float tBase = uTime * 0.50;

  vec2 p = flow(vUv, tFlow);
  vec3 col = aberrate(p, tBase, CHROMA * (1.0 + uHover * 0.6));

  // ── Grano ────────────────────────────────────────────────────────────────
  // Sobre gl_FragCoord, o sea a resolución de píxel real y no del UV, así el
  // tamaño del grano no depende del tamaño de la card. El uTime cuantizado a
  // ~12 Hz le da vida sin el titileo de refrescarlo a 60.
  float gt = floor(uTime * 12.0);
  col += (hash21(gl_FragCoord.xy + gt) - 0.5) * GRAIN;

  fragColor = vec4(col, 1.0);
}`;
