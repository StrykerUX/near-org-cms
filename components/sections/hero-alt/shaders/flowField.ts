// GLSL del campo de flujo de la versión 02 · Flow.
//
// Vive en su propio módulo por lo mismo que `motion/shaders/glyphShine.ts`: un
// template literal de 90 líneas dentro del componente hace ilegible el
// componente, y TypeScript no puede mirar adentro de él de todas formas — el
// único chequeo que existe es el `COMPILE_STATUS` que hace `buildProgram`, que
// además dice en qué línea del GLSL falló.
//
// GLSL 1.0 (sin `#version`) y no ES 3.0, aunque el contexto sea WebGL2: es lo
// que ya usa `hero-burst`, no hace falta nada de 3.0 acá, y mezclar las dos
// versiones en el mismo repo obliga a recordar cuál es cuál en cada archivo.

export const FLOW_VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

export const FLOW_FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_flow;      // fase INTEGRADA: avanza con el scroll, no con el reloj
uniform float u_time;      // deriva lenta, para que el campo no se congele quieto
uniform float u_energy;    // 0..1 — cuánto se está scrolleando ahora mismo
uniform float u_cols;      // 0 = campo continuo; >0 = cuantizado a esas columnas
uniform float u_floor;     // recorte inferior: por debajo de esto no se pinta nada
uniform vec3  u_bg;
uniform vec3  u_c0;        // valle
uniform vec3  u_c1;
uniform vec3  u_c2;        // cresta

// ── Ruido ───────────────────────────────────────────────────────────────────
//
// Value noise y no simplex: el gradiente de simplex cuesta el doble de ALU y
// acá el resultado pasa por tres octavas de fbm y dos warps, que se comen
// cualquier diferencia de calidad. Lo que sí importa es que sea barato: este
// shader corre a pantalla completa.

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // Quintic y no smoothstep cúbico: la segunda derivada continua es lo que
  // evita las bandas visibles en las diagonales del fbm.
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
  // Tres octavas. Con dos el campo se lee como manchas; con cuatro la cuarta
  // cae por debajo de un píxel a esta escala y solo agrega costo.
  for (int i = 0; i < 3; i++) {
    v += a * vnoise(p);
    // La rotación entre octavas rompe el enrejado del value noise, que si no
    // deja ejes visibles a 0° y 90°.
    p = mat2(1.6, 1.2, -1.2, 1.6) * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  // Aspecto corregido contra la altura: así el campo no se estira al cambiar el
  // ancho de la ventana, que es la dimensión que más varía.
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

  // ── Cuantización a columnas ───────────────────────────────────────────────
  //
  // Es lo que convierte el mismo campo en las barras de la segunda sección: se
  // muestrea el CENTRO de cada columna en vez de cada píxel. No es un filtro
  // sobre el resultado — es leer el mismo campo a menor resolución, que es
  // justamente lo que se quiere decir con "las barras son el campo".
  if (u_cols > 0.5) {
    float w = 1.0 / u_cols;
    float col = floor(gl_FragCoord.x / u_res.x / w);
    uv.x = ((col + 0.5) * w - 0.5) * u_res.x / u_res.y;
  }

  // ── Domain warping ────────────────────────────────────────────────────────
  //
  // Dos pasadas. La primera dobla el dominio con un fbm desfasado; la segunda
  // vuelve a doblar el resultado. Es lo que produce los filamentos que se
  // enroscan sin que ninguna línea del código dibuje un filamento.
  //
  // 'u_flow' entra en las dos con signo opuesto: las capas se deslizan en
  // sentidos contrarios y el campo se cizalla en vez de trasladarse en bloque.
  vec2 q = vec2(
    fbm(uv * 1.7 + vec2(0.0, u_flow * 0.35) + u_time * 0.02),
    fbm(uv * 1.7 + vec2(5.2, 1.3) - u_flow * 0.28)
  );

  vec2 r = vec2(
    fbm(uv * 2.4 + 3.4 * q + vec2(1.7, 9.2) + u_flow * 0.22),
    fbm(uv * 2.4 + 3.4 * q + vec2(8.3, 2.8) - u_time * 0.03)
  );

  float f = fbm(uv * 2.1 + 3.0 * r);

  // ── Energía ───────────────────────────────────────────────────────────────
  //
  // La velocidad del scroll no mueve el campo —eso ya lo hace 'u_flow'— sino
  // que sube el CONTRASTE y empuja las crestas. Scrollear rápido no acelera un
  // loop: enciende el campo. Es la diferencia entre una animación que ignora al
  // lector y una que le responde.
  float contrast = mix(1.0, 2.3, u_energy);
  float lift = 0.10 * u_energy;
  float v = clamp((f - 0.5) * contrast + 0.5 + lift, 0.0, 1.0);

  // Recorte inferior con borde suave: sin él el fondo entero queda teñido del
  // color del valle y la sección pierde su negro.
  v = smoothstep(u_floor, 1.0, v);

  // Rampa de tres tramos. 'smoothstep' en los dos mixes y no 'mix' lineal: con
  // el lineal las tres bandas de color se ven como tres bandas.
  vec3 col = mix(u_bg, u_c0, smoothstep(0.0, 0.35, v));
  col = mix(col, u_c1, smoothstep(0.32, 0.72, v));
  col = mix(col, u_c2, smoothstep(0.75, 1.0, v));

  // Grano ligado a la posición y no al tiempo: fijo, no hierve. Es lo que
  // esconde el banding de los degradados largos en pantallas de 8 bits.
  col += (hash(gl_FragCoord.xy) - 0.5) * 0.016;

  gl_FragColor = vec4(col, 1.0);
}
`;
