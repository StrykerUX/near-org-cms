import { NOISE_GLSL } from "@/components/sections/protocol-labs/opening-labs/gl/noise";

// Haze — luz difusa sobre crema. La superficie del hero claro de C.
//
// ── Qué reemplaza, y por qué ──────────────────────────────────────────────
//
// Al espectro de columnas, que en claro no funcionaba. Doce bandas verticales
// moviéndose es mucha información y mucho movimiento para una primera pantalla
// que además tiene titular, cuerpo, CTA y seis cifras asomando. El problema no
// era el color ni la velocidad: era que la superficie TENÍA ESTRUCTURA, y la
// estructura compite con el texto aunque esté al 8% de contraste.
//
// Acá no hay estructura. Hay luz: un degradé maestro abollado por un campo de
// ruido lento, y nada más. No se puede señalar ningún elemento porque no hay
// elementos — que es exactamente lo que hace que se pueda mirar durante mucho
// tiempo sin cansar.
//
// ── El método viene del hero de la homepage ───────────────────────────────
//
// Mismo esqueleto que `homepage-update/gl/foliage.ts`: un degradé direccional
// que fija de dónde viene la luz, un fbm que lo abolla localmente, una rampa de
// varios tonos y grano de película encima. Es una decisión de cohesión: el
// fondo del hero de Protocol y el de la home tienen que pertenecer a la misma
// familia, y la manera de lograrlo no es copiar la imagen sino compartir el
// método.
//
// Lo que NO se trae es el flujo radial estirado — las estrías del follaje. Eso
// es la firma de la home y repetirla acá haría de esta página una versión
// pálida de aquella, en vez de un pariente.
//
// ── El campo se SUMA al degradé, no se mezcla ─────────────────────────────
//
// Es la trampa que el shader de la home documenta y que vale igual acá. Con un
// mix() el ruido —centrado en 0.5— tira de la imagen entera hacia el color
// central de la rampa y se lleva por delante los dos extremos: el crema
// luminoso y el verde profundo desaparecen, y queda una lámina de verde medio
// uniforme. Un promedio con una constante siempre aplana.
//
// Sumando la desviación respecto de 0.5, el degradé conserva su recorrido
// completo y el campo lo abolla localmente — que es lo que hace la luz al
// atravesar algo: no cambia de dónde viene, cambia cuánta pasa.
//
// ── La deriva es casi cero, y es el punto ─────────────────────────────────
//
// El campo se mueve a 0.012 unidades por segundo. Mirándolo fijo, apenas se
// nota que cambia; mirando la página, la sensación es que está viva. Ese es el
// registro que se busca: nada que puedas seguir con la vista.
//
// GLSL ES 3.00 — ver la nota de GlSurface.

export const HAZE_FRAG = `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2  u_res;
uniform float u_time;
uniform float u_motion;

uniform vec3  u_c0;    // el tono más claro de la rampa
uniform vec3  u_c1;
uniform vec3  u_c2;
uniform vec3  u_c3;    // el más profundo

uniform float u_scale;      // tamaño del campo
uniform float u_gradAngle;  // dirección de la luz, en radianes
uniform float u_gradSpread; // cuánto campo cubre el degradé
uniform float u_gradGamma;  // curva: <1 estira las luces, >1 las aprieta
uniform float u_mix;        // cuánto abolla el campo al degradé
uniform float u_lift;
uniform float u_drift;      // deriva temporal
uniform float u_grain;

${NOISE_GLSL}

// Aspecto corregido contra la ALTURA y no contra el ancho: el ancho es la
// dimensión que más varía entre un monitor y un teléfono, y corrigiendo contra
// él el campo se deformaría en cada resize.
vec2 toField(vec2 frag) {
  return (frag - 0.5 * u_res) / u_res.y;
}

vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0);
  // Tramos con smoothstep y no con mix lineal: con el lineal las paradas se
  // leen COMO paradas, y en un degradé que ocupa la pantalla entera esas
  // costuras son lo primero que delata que hay una rampa detrás.
  if (t < 0.34) return mix(u_c0, u_c1, smoothstep(0.0, 1.0, t / 0.34));
  if (t < 0.67) return mix(u_c1, u_c2, smoothstep(0.0, 1.0, (t - 0.34) / 0.33));
  return mix(u_c2, u_c3, smoothstep(0.0, 1.0, (t - 0.67) / 0.33));
}

void main() {
  vec2 p = toField(gl_FragCoord.xy);
  float t = u_time * u_drift * u_motion;

  // Dos capas con derivas distintas y no una sola: con una, el campo entero se
  // desplaza en bloque y se lee como una textura que resbala. Con dos que se
  // cruzan a distinta velocidad, lo que cambia es la FORMA, y eso no tiene
  // dirección que el ojo pueda seguir.
  float f = fbm(p * u_scale + vec2(t, t * 0.6), 4);
  f += (fbm(p * u_scale * 2.3 - vec2(t * 0.7, 0.0), 3) - 0.5) * 0.35;

  vec2 g = vec2(cos(u_gradAngle), sin(u_gradAngle));
  float grad = clamp(dot(p, g) * u_gradSpread + 0.5, 0.0, 1.0);
  grad = pow(grad, u_gradGamma);

  float coord = clamp(grad + (f - 0.5) * u_mix + u_lift, 0.0, 1.0);
  vec3 col = ramp(coord);

  // Grano de película. Cuantizado en el tiempo para que no hierva a 60fps: un
  // grano que corre más rápido que la imagen se lee como ruido de compresión y
  // no como emulsión.
  float n = hash(gl_FragCoord.xy + floor(u_time * 8.0 * u_motion) * 7.13);
  col += (n - 0.5) * u_grain;

  fragColor = vec4(col, 1.0);
}
`;
