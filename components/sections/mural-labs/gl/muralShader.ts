// El shader que comparten las tres versiones WebGL del mural.
//
// Uno solo con tres modos y no tres programas: las tres leen la MISMA textura
// —la palabra ya pintada con su degradado— y solo difieren en cómo desplazan la
// coordenada antes de muestrearla. Compartir el programa mantiene idénticos el
// muestreo, la mezcla con el fondo y el tratamiento del alfa, que es justo lo
// que no debe variar entre variantes que se están comparando.
//
// ── Los backticks ──────────────────────────────────────────────────────────
//
// El GLSL vive en un template literal, así que un backtick dentro de un
// comentario del shader CIERRA el literal y TypeScript reporta el error en una
// línea que no tiene nada que ver. Los comentarios de acá abajo usan comillas
// simples por eso — es el error más fácil de reintroducir de todo el archivo.

export const MURAL_VERT = /* glsl */ `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

export const MURAL_FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform vec2  u_res;
uniform sampler2D u_tex;
/** 0 = flare, 1 = ripple, 2 = melt */
uniform int   u_mode;
/** Progreso de la escena, 0..1. */
uniform float u_p;
/** Velocidad instantánea del scroll, ya normalizada 0..1. */
uniform float u_vel;
uniform float u_time;
/** El color de fondo de la sección, para mezclar donde no hay tinta. */
uniform vec3  u_bg;

out vec4 outColor;

// Ruido de valor, barato y suficiente: lo único que hace falta es que dos
// columnas vecinas caigan distinto, no una distribución de calidad.
float hash(float x) { return fract(sin(x * 127.1) * 43758.5453); }

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  // El eje Y del canvas va al revés que el de la textura.
  uv.y = 1.0 - uv.y;

  vec2 st = uv;
  float glow = 0.0;
  float alphaMul = 1.0;

  if (u_mode == 0) {
    // ── flare ───────────────────────────────────────────────────────────────
    // Un frente vertical que cruza de izquierda a derecha. Delante del frente
    // la palabra todavía no existe; sobre él, el trazo se perturba; detrás,
    // queda limpio. El ancho del frente es fijo en UV para que se lea igual en
    // palabras de largos distintos.
    float front = u_p * 1.25 - 0.12;
    float d = uv.x - front;
    float band = smoothstep(0.10, 0.0, abs(d));

    // El desplazamiento decae con la distancia al frente: lejos, cero, así que
    // la parte ya revelada es la textura intacta.
    st.y += sin(uv.x * 42.0 + u_time * 3.0) * 0.02 * band;
    st.x += sin(uv.y * 26.0 - u_time * 2.2) * 0.012 * band;

    glow = band * 0.85;
    // Todo lo que está por delante del frente se recorta.
    alphaMul = smoothstep(0.02, -0.02, d) * 0.0 + step(d, 0.0);
  } else if (u_mode == 1) {
    // ── ripple ──────────────────────────────────────────────────────────────
    // La amplitud sale de la VELOCIDAD, no del progreso: quieto el bloque es el
    // del artboard, y solo se agita mientras el lector empuja. Es la diferencia
    // con animar contra la posición de scroll, donde la deformación sería una
    // función de dónde está y no de qué está haciendo.
    float amp = u_vel * 0.045;
    st.y += sin(uv.x * 18.0 + u_time * 4.0) * amp;
    st.x += sin(uv.y * 9.0 + u_time * 2.6) * amp * 0.6;
    glow = u_vel * 0.18;
  } else {
    // ── melt ────────────────────────────────────────────────────────────────
    // Cada columna cae una distancia distinta, sembrada con ruido. Se muestrea
    // HACIA ARRIBA (st.y menor) para que el material parezca estirarse hacia
    // abajo: leer más arriba de la textura y pintarlo más abajo es exactamente
    // eso.
    float col = floor(uv.x * 160.0);
    float drop = (0.35 + hash(col) * 0.65) * u_p;
    st.y -= drop * 0.55;
    // El borde inferior no se estira al infinito: se recorta, que es lo que
    // mantiene el efecto como materia y no como desenfoque.
    alphaMul = step(0.0, st.y);
  }

  vec4 tex = texture(u_tex, st);

  // ── La textura se muestrea PREMULTIPLICADA, y eso decide la fórmula ──────
  //
  // El canvas 2D entrega el texto con el color ya multiplicado por su alfa, y
  // la subida pide explícitamente conservarlo así (UNPACK_PREMULTIPLY_ALPHA en
  // 'MuralGl'). Con datos premultiplicados la mezcla correcta es una suma sobre
  // el fondo atenuado — nunca un 'mix' con el color dividido.
  //
  // Dividir por el alfa para 'recuperar' el color puro, que es lo que hacía la
  // primera versión, produce un HALO CLARO alrededor de cada letra: en el borde
  // antialiaseado el alfa vale una fracción, y dividir por esa fracción dispara
  // el color hacia el blanco. A este cuerpo el contorno se veía en las cuatro
  // líneas, y era más visible cuanto más oscura la tinta.
  //
  // El 'alphaMul' de los modos se aplica a las DOS partes: escalar solo el alfa
  // rompería la premultiplicación y traería el mismo halo por la puerta de
  // atrás.
  vec3 ink = tex.rgb * alphaMul;
  float a = tex.a * alphaMul;

  // El brillo también va premultiplicado: por eso el '* a'. Sin él, el glow
  // pintaría fuera del trazo — justamente en el borde.
  ink += glow * vec3(0.25, 0.70, 0.25) * a;

  outColor = vec4(u_bg * (1.0 - a) + ink, 1.0);
}
`;
