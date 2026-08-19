// Los trazados de «World» en Kepler itálica, sacados del SVG de marca
// (`public/prototype/ex2/world.svg`) y convertidos a datos para poder usarlos
// como GEOMETRÍA y no solo como imagen.
//
// ── Por qué el titular deja de ser texto ────────────────────────────────────
//
// La transición del hero abre la contraforma de la «o» hasta convertirla en la
// ventana de la sección siguiente. Con texto vivo eso solo se puede aproximar:
// un `clip-path: circle()` nunca calza con una contraforma elíptica e
// inclinada, y encima hay que re-medir la letra cada vez que la fuente termina
// de cargar o cambia el ancho de la ventana.
//
// Con el trazado real, la máscara ES la letra: calza exacto a cualquier escala
// y no depende de ninguna métrica de fuente.
//
// El precio, entero: **este titular no es texto**. No se selecciona, no se
// traduce, no lo indexa nadie y no lo lee un lector de pantalla. Se paga como
// en `hero-alt/GlassHero`: el `<h1>` real va `sr-only` y el SVG `aria-hidden`,
// así el árbol de accesibilidad ve el titular y la pantalla ve el cartel.
//
// El otro precio: si cambia la copy, hay que regenerar el asset.

/**
 * Índice de la «o» dentro de `WORLD_LETTERS`. Sale de medir con `getBBox()` las
 * cinco letras ya montadas: el orden de los paths en el archivo no sigue el de
 * la palabra (queda d, l, r, o, W), así que no se puede deducir contando.
 */
export const WORLD_O_INDEX = 3;

/** El viewBox del SVG original. Todo lo de abajo está en estas unidades. */
export const WORLD_VIEWBOX = { w: 268, h: 118 } as const;

/**
 * Las cinco letras. La «o» va SIN su contraforma: acá está solo el contorno
 * exterior, y el hueco lo abre la máscara. Pintadas juntas dan la palabra
 * maciza; con la máscara aplicada, la palabra con su ojo.
 */
export const WORLD_LETTERS: readonly string[] = [
  "M250.256 98.5589L251.441 100.252C246.191 111.09 238.74 117.017 232.136 117.017C225.701 117.017 227.225 105.671 229.087 98.5589C229.765 96.0187 230.442 93.6479 230.95 91.7851C225.023 103.131 215.032 116.509 203.008 116.509C195.896 116.509 193.694 109.566 193.694 102.623C193.694 85.5193 203.686 60.7949 218.419 48.6021C223.668 43.691 228.918 41.3202 234.337 41.3202C238.571 41.3202 241.958 43.3524 243.143 46.9086C249.578 24.8937 252.965 12.3622 253.981 7.1125C254.489 4.74167 253.981 4.40298 252.626 4.40298C251.102 4.40298 249.409 4.23363 245.175 4.23363L245.853 2.37083C252.796 2.03215 262.787 1.01608 267.868 0C264.311 9.31398 255.336 38.78 244.498 78.2374C241.619 88.5675 239.418 96.8654 238.232 102.792C237.555 105.333 236.031 111.26 238.74 111.26C242.466 111.26 247.715 103.978 250.256 98.5589ZM204.702 103.639V103.809C204.702 107.026 205.887 111.429 209.274 111.429C215.371 111.429 221.975 102.962 229.934 87.5514C233.829 79.5922 241.111 57.0693 241.111 50.6342C241.111 48.2634 239.756 43.6911 235.692 43.6911C232.136 43.6911 227.902 46.2312 223.499 51.6503C214.524 62.827 204.702 85.5193 204.702 103.639Z",
  "M185.28 4.40298L185.957 2.54018C193.577 2.37083 202.722 1.35476 207.802 0C204.754 7.78988 198.658 26.5872 191.207 53.5131C183.586 80.7776 179.014 96.5267 176.812 106.349C176.304 108.72 175.966 110.752 177.998 110.752C181.215 110.752 187.481 105.333 191.037 98.5589L192.392 100.252C187.481 109.228 179.014 116.509 171.055 116.509C163.773 116.509 165.466 108.55 167.16 102.623C171.732 87.5514 176.304 71.8023 181.554 54.1904C190.021 24.8937 192.9 13.5476 194.255 7.28185C194.594 5.08036 194.086 4.74167 192.223 4.57232L185.28 4.40298Z",
  "M134.803 46.9087L135.988 45.0459C141.915 44.7072 151.568 43.1831 155.632 41.3203C155.463 44.1992 151.737 58.9322 148.858 70.109H149.367C159.358 47.9248 165.116 41.3203 172.059 41.3203C175.446 41.3203 177.308 44.3685 177.308 47.078C177.308 52.4971 173.752 55.7146 170.704 55.7146C169.349 55.7146 168.333 54.6986 167.994 53.5132C167.148 51.1423 166.64 50.8036 165.285 50.8036C161.898 50.8036 155.463 61.303 150.044 74.512C145.81 85.0114 141.238 98.2203 136.666 114.647C132.94 114.647 128.537 115.155 125.658 116.002C132.093 97.7122 141.577 67.0608 143.947 49.6182C144.117 47.7554 143.439 47.078 141.915 47.078C140.053 47.078 136.496 46.9087 134.803 46.9087Z",
  "M113.279 41.3203H113.448C124.794 41.3203 128.351 50.1263 128.351 60.6257C128.351 75.8667 120.222 99.4057 109.215 109.397C103.796 114.477 99.0539 116.51 92.6188 116.51C85.845 116.51 77.2084 114.139 77.0391 97.2042C77.0391 82.1325 85.5063 58.4242 97.8685 48.0941C102.949 43.6911 107.86 41.3203 113.279 41.3203Z",
  "M0 10.8381L0.677382 8.97534C4.74167 9.31403 10.1607 9.48338 15.5798 9.48338C20.9988 9.48338 26.0791 9.31403 30.4821 8.97534L29.9741 10.8381C22.3536 11.8542 21.1681 12.3622 20.4908 17.6119C18.7973 30.6515 15.5798 63.1658 12.5315 95.68C21.8455 73.6652 37.2559 42.5057 47.9247 16.4265C48.602 14.7331 49.1101 13.0396 49.4488 10.6688C51.3116 10.8381 56.5613 9.99141 59.1014 8.97534C57.916 17.7813 54.8678 51.6503 50.8035 98.0509C73.8345 54.0211 83.9952 33.5304 89.7529 19.8134C92.4624 13.3783 92.1237 12.1929 88.7368 11.6849L82.1324 10.8381L82.9791 8.97534C85.1806 8.97534 90.9383 9.48338 95.172 9.48338C99.9136 9.48338 103.301 8.97534 107.703 8.97534L107.365 10.8381C99.9136 11.8542 98.5589 13.3783 95.5107 18.7974C73.6651 57.9161 54.6985 95.5107 46.4006 114.477C43.691 114.647 40.8122 116.001 39.2881 116.848L38.78 116.509C40.8122 98.7283 43.691 65.3673 47.0779 25.0631C29.6354 66.0447 15.0717 95.68 7.62053 114.477C5.75774 114.647 2.37083 115.832 0.508036 116.848L0 116.34C2.20149 98.0509 7.95922 38.4414 9.14464 16.0878C9.31398 13.209 9.14464 12.1929 5.92708 11.8542C3.55625 11.5155 1.52411 11.0075 0 10.8381Z",
];

/**
 * La contraforma de la «o» — el subpath interior del glifo.
 *
 * Es lo que se usa como `<clipPath>`: al escalarla desde su centro, el agujero
 * de la letra crece hasta cubrir la pantalla, y en el primer frame coincide con
 * la letra pixel a pixel porque ES la letra.
 */
export const WORLD_EYE = "M113.279 43.6911H113.11C109.384 43.6911 105.997 46.2313 101.763 52.8358C94.3123 64.3513 86.5224 89.753 86.5224 102.623C86.5224 111.091 89.5706 114.139 93.1268 114.139C96.5138 114.139 99.562 112.276 102.949 107.196C110.739 95.8494 119.037 66.5527 119.037 53.0051C119.037 47.078 117.343 43.6911 113.279 43.6911Z";

/**
 * Centro y semieje MENOR de la contraforma, en unidades del viewBox.
 *
 * Sale de `getBBox()` sobre el trazado ya montado en el navegador, no de leer
 * los números del atributo `d`: un trazado de curvas lleva puntos de control
 * que caen FUERA de la forma, así que contarlos como coordenadas da una caja
 * más grande y descentrada. La primera versión de este archivo lo hacía así y
 * ponía el centro en (78.9, 81.4) — 24 unidades a la izquierda del real. El
 * síntoma: al escalar, el agujero se iba hacia la «l» en vez de quedarse en la
 * «o».
 *
 * Caja real de la contraforma: x 86.5–119.0, y 43.7–114.1.
 *
 * `r` es el semieje MENOR (la mitad del ancho) y no el promedio: es la medida
 * que decide cuánto tiene que crecer el agujero para tapar la pantalla, y con
 * el promedio de una elipse tan alargada se queda corto por el lado estrecho.
 */
export const WORLD_EYE_CENTER = { x: 102.75, y: 78.9, r: 16.25 } as const;
