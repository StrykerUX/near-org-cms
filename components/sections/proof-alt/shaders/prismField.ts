// GLSL del campo de interferencia de la versión 07 · Prism.
//
// Vive en su propio módulo por lo mismo que `hero-alt/shaders/flowField.ts`: un
// template literal de ochenta líneas dentro del componente lo vuelve ilegible, y
// TypeScript no puede mirar adentro de todos modos — el único chequeo que existe
// es el `COMPILE_STATUS` de `buildProgram`, que además dice en qué línea del
// GLSL falló.
//
// GLSL 1.0 (sin `#version`) aunque el contexto sea WebGL2: es lo que ya usan
// `hero-burst` y `flowField`, acá no hace falta nada de ES 3.0, y mezclar las
// dos versiones en el mismo repo obliga a recordar cuál es cuál archivo por
// archivo.

export const PRISM_VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

export const PRISM_FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_src[6];    // centro de cada celda, en coordenadas 0..1
uniform float u_amp[6];    // energía de cada fuente, 0..1
uniform vec3  u_bg;
uniform vec3  u_lo;        // color del valle
uniform vec3  u_hi;        // color de la cresta

// La onda de UNA fuente: una senoidal que viaja hacia afuera, atenuada con la
// distancia.
//
// La atenuación es 1/(1+k·d²) y no un 'exp(-d)': el inverso cuadrado es lo que
// hace una onda real en el plano, y en la práctica la diferencia se ve —con
// exponencial la energía muere a la mitad del camino y las seis celdas nunca
// llegan a interferir entre sí, que es todo el efecto.
float wave(vec2 p, vec2 src, float amp, float t) {
  float d = distance(p, src);
  // El frente viaja: la fase resta el tiempo, así que las crestas salen del
  // centro hacia afuera. Sumándolo irían hacia adentro y se leería como un
  // desagüe.
  float phase = d * 26.0 - t * 2.4;
  return amp * sin(phase) / (1.0 + 18.0 * d * d);
}

void main() {
  // Coordenada normalizada con el aspecto CORREGIDO: sin esto los círculos de
  // las ondas serían elipses en cualquier viewport que no sea cuadrado, y la
  // deformación cambiaría al redimensionar.
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float field = 0.0;
  for (int i = 0; i < 6; i++) {
    vec2 src = vec2(u_src[i].x * aspect, u_src[i].y);
    field += wave(p, src, u_amp[i], u_time);
  }

  // El campo se remapea a 0..1 con un 'tanh' barato (x/(1+|x|)): la suma de
  // seis ondas puede pasarse de rango cuando varias celdas están calientes a la
  // vez, y un clamp duro produce mesetas planas donde se pierde el detalle.
  float v = field / (1.0 + abs(field));
  float t = 0.5 + 0.5 * v;

  // Dos mezclas y no una rampa de tres paradas: el fondo tiene que ganar en el
  // reposo (donde el campo es plano, t ≈ 0.5) o la sección brilla entera sin
  // que nadie la haya tocado.
  vec3 col = mix(u_bg, u_lo, smoothstep(0.5, 0.86, t));
  col = mix(col, u_hi, smoothstep(0.8, 1.0, t));

  gl_FragColor = vec4(col, 1.0);
}
`;
