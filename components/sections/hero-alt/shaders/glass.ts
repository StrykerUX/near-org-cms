// GLSL del panel de vidrio de la versión 04 · Glass.
//
// Mismo criterio que 'flowField.ts': GLSL 1.0 sin '#version', el módulo aparte
// para que el componente siga siendo legible, y CERO backticks en los
// comentarios — vive dentro de un template literal y un backtick lo cerraría a
// mitad del shader, con un error de TypeScript que apunta a una línea que no
// tiene nada que ver.

export const GLASS_VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;

export const GLASS_FRAG = `
precision highp float;

uniform vec2      u_res;
uniform float     u_time;
uniform vec2      u_pointer;   // 0..1, ya suavizado en JS
uniform float     u_scroll;    // 0..1 del recorrido de la sección
uniform float     u_ior;       // fuerza de la refracción
uniform float     u_cols;      // 0 = lámina continua; >0 = columnas de vidrio
uniform sampler2D u_text;      // el titular rasterizado — alfa en el canal A
uniform vec3      u_bg0;
uniform vec3      u_bg1;
uniform vec3      u_ink;

// ── El campo de altura del vidrio, y su gradiente ───────────────────────────
//
// Todo el efecto sale de UNA función escalar h(p): la superficie del vidrio.
// Lo que se ve —la distorsión, el brillo del borde, el grosor— son derivadas
// suyas, no dibujos separados. Por eso el vidrio se lee como un objeto: sus
// tres señales no pueden contradecirse porque salen de la misma fuente.
//
// ── Por qué el gradiente es analítico y no por diferencias finitas ──────────
//
// La primera versión sacaba la normal muestreando h() en tres puntos
// (h(p), h(p+dx), h(p+dy)). Eso son TRES evaluaciones por píxel, y cada una
// cuesta 3 sin + 1 exp: nueve senos y tres exponenciales por píxel, a pantalla
// completa, en dos instancias simultáneas. Se veía como lag y lo era.
//
// h() es una suma de senos y una gaussiana, así que su derivada se escribe a
// mano: la de sin es cos y la de exp(-k·d²) es -2k·d·exp(-k·d²). Una sola
// evaluación devuelve la altura Y las dos parciales — 3 cos + 1 exp por píxel,
// un tercio del costo, y además EXACTA en vez de aproximada (las diferencias
// finitas dependían de un epsilon que había que escalar con el viewport).
//
// Devuelve vec3(h, dh/dx, dh/dy).

vec3 heightAndGrad(vec2 p) {
  float a = p.x * 3.1 + u_time * 0.35;
  float b = p.y * 2.3 - u_time * 0.27;
  float c = (p.x + p.y) * 1.7 + u_time * 0.19;

  float w = sin(a) * 0.5 + sin(b) * 0.5 + sin(c) * 0.35;
  // Las constantes de cada término son el producto de su amplitud por su
  // frecuencia — la regla de la cadena, escrita. Si alguien toca una amplitud
  // arriba tiene que tocarla acá también: es el precio de la derivada a mano.
  float dwx = cos(a) * 0.5 * 3.1 + cos(c) * 0.35 * 1.7;
  float dwy = cos(b) * 0.5 * 2.3 + cos(c) * 0.35 * 1.7;

  // La lente del puntero: una campana gaussiana que ABULTA el vidrio donde
  // está el cursor. Es lo único que responde al lector, y por eso es lo único
  // con amplitud suficiente para dominar a las ondas de fondo.
  vec2 d = p - (u_pointer * 2.0 - 1.0) * vec2(u_res.x / u_res.y, 1.0);
  float lens = exp(-dot(d, d) * 3.2) * 1.6;

  return vec3(
    w * 0.22 + lens,
    dwx * 0.22 - lens * 6.4 * d.x,
    dwy * 0.22 - lens * 6.4 * d.y
  );
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

  // Cuantización a columnas: cada columna muestrea el campo en SU centro, así
  // que las siete tienen alturas distintas y refractan distinto. Es el mismo
  // truco que usa la versión 02, y por la misma razón — las barras tienen que
  // ser el mismo material visto de otra manera, no un dibujo aparte.
  if (u_cols > 0.5) {
    float w = 1.0 / u_cols;
    float col = floor(uv.x / w);
    p.x = ((col + 0.5) * w - 0.5) * u_res.x / u_res.y;
  }

  vec3 hg = heightAndGrad(p);
  vec2 grad = hg.yz;

  // La refracción es el gradiente empujando la coordenada de muestreo. Se
  // atenúa con el scroll: al final del recorrido el vidrio se aplana y el texto
  // queda legible, que es lo que hace que la sección se pueda leer y no solo
  // mirar.
  float strength = u_ior * (1.0 - 0.55 * u_scroll);
  vec2 offset = -grad * strength * 0.02;

  // ── Fondo ────────────────────────────────────────────────────────────────
  //
  // Procedural y no una textura: lo que se refracta tiene que existir en
  // cualquier coordenada, incluidas las que el offset empuja fuera del rango
  // 0..1. Un sample de textura ahí devolvería el borde estirado.
  vec2 bgUv = uv + offset;
  float band = 0.5 + 0.5 * sin(bgUv.y * 9.0 + bgUv.x * 3.0 + u_time * 0.12);
  vec3 bg = mix(u_bg0, u_bg1, smoothstep(0.0, 1.0, bgUv.y));
  bg = mix(bg, u_bg1, band * 0.18);

  // ── El titular, refractado ────────────────────────────────────────────────
  //
  // El texto se muestrea con el MISMO offset que el fondo, así que se dobla con
  // él. Es lo que separa esto de "un texto encima de un fondo animado": el
  // titular está DENTRO del vidrio, no delante.
  //
  // La textura viene con origen arriba-izquierda y gl_FragCoord con origen
  // abajo-izquierda, de ahí el flip en Y.
  vec2 tUv = vec2(bgUv.x, 1.0 - bgUv.y);
  float glyph = texture2D(u_text, tUv).a;

  // Aberración cromática en el borde del glifo: se vuelve a muestrear el texto
  // con el offset escalado distinto por canal. Solo se nota donde el gradiente
  // es fuerte, que es exactamente donde un vidrio real la produce.
  float gR = texture2D(u_text, tUv + offset * 0.35).a;
  float gB = texture2D(u_text, tUv - offset * 0.35).a;

  vec3 col = bg;
  col = mix(col, u_ink, glyph);
  col.r = mix(col.r, u_ink.r, gR * 0.5);
  col.b = mix(col.b, u_ink.b, gB * 0.5);

  // ── Brillo especular del borde ────────────────────────────────────────────
  //
  // La misma normal, contra una luz fija arriba-izquierda. Es lo que hace que
  // los pliegues tengan una cara iluminada y otra no — sin esto el vidrio se ve
  // como una distorsión y no como un relieve.
  float spec = clamp(dot(normalize(vec3(-grad, 1.0)), normalize(vec3(-0.6, 0.7, 0.55))), 0.0, 1.0);
  col += pow(spec, 22.0) * 0.30;

  gl_FragColor = vec4(col, 1.0);
}
`;
