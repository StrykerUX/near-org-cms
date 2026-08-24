// Value noise y fbm, compartidos por los shaders de este laboratorio.
//
// Es un fragmento de GLSL que cada shader interpola dentro de su propia fuente.
// Se comparte y no se copia por el mismo motivo que la copy de la página: dos
// transcripciones del mismo ruido divergen en el primer ajuste, y entonces dos
// superficies que deberían tener la misma textura de base dejan de tenerla sin
// que nadie lo haya decidido.
//
// ── De dónde sale ──────────────────────────────────────────────────────────
//
// Del shader del hero de la homepage (`homepage-a/gl/foliage.ts`), que ya
// había resuelto estas tres decisiones y las dejó anotadas:
//
//   · **Value noise y no simplex.** El gradiente de simplex cuesta el doble de
//     ALU, y acá el resultado pasa por varias octavas que se comen la
//     diferencia. Lo que importa es que sea barato.
//   · **Interpolación quíntica y no el smoothstep cúbico.** La segunda derivada
//     continua es lo que evita las bandas visibles en las diagonales del fbm.
//   · **Rotación entre octavas.** Sin ella el value noise deja ejes visibles a
//     0° y 90°, muy legibles en cuanto el campo se estira o se estratifica.
//
// Copiarlo de allá y no importarlo de allá: `homepage-a/` es la línea de
// diseño viva de la home y `protocol-labs/` es un laboratorio. La dependencia
// tiene que ir del lab hacia la página, nunca al revés.
//
// ⚠️ Sin backticks acá dentro: cierran el template literal del shader que lo
// interpola, y el error que da no señala el shader.

export const NOISE_GLSL = `
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(
    mix(hash(i),                  hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p, int octaves) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    v += a * vnoise(p);
    p = mat2(1.6, 1.2, -1.2, 1.6) * p;
    a *= 0.5;
  }
  return v;
}
`;
