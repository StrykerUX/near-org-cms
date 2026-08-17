import Container from "@/components/primitives/Container";

// El separador entre pruebas del laboratorio: quién es la animación que viene
// abajo, con qué parámetros, y por qué.
//
// ── Qué problema resuelve, porque no es decoración ───────────────────────────
//
// La primera versión de esta página encadenaba los colores (cream → stone → ink →
// …) y reusaba cada banda como "el después" de una prueba Y "el antes" de la
// siguiente. Eso ahorraba altura y hacía que la página se leyera como un sitio
// real, pero costaba lo único que el laboratorio tiene que dar: a mitad de scroll,
// con la etiqueta de la prueba ya fuera de cuadro, no había forma de saber si la
// transición que estabas mirando era la 03 o la 04. Comparar cuatro patrones exige
// poder decir cuál es cuál.
//
// De ahí las dos decisiones que van juntas y que este componente hace cumplir:
//
//  1. CADA PRUEBA ES AUTOCONTENIDA — su propia banda de arriba y su propia banda
//     de abajo, sin compartir ninguna con la vecina. Cuesta altura y no importa:
//     esto es un laboratorio, no una página que alguien tenga que recorrer.
//  2. EL SEPARADOR NO PUEDE PARECERSE A LA PÁGINA. Va en `--ink-slate`, que no lo
//     usa ninguna banda de esta ruta, con una regla punteada y la copy en eyebrow.
//     Tiene que leerse como instrumental, no como una sección más — si se pareciera
//     a una banda, sería un quinto color en la cadena y volveríamos al problema.
//
// El color es también la razón de que el separador vaya ENTRE grupos y no pegado a
// la transición: el `from` de una transición tiene que ser el color de lo que está
// inmediatamente arriba. Un separador metido entre la banda y la transición
// obligaría a que ese `from` fuera `--ink-slate`, y el bloque dejaría de continuar
// la sección de arriba — que es su contrato entero.

export type LabDividerProps = {
  /** Número de la prueba, en dos dígitos. También arma el ancla (`#test-03`). */
  index: string;
  title: string;
  /** Los parámetros, tal cual se le pasan al componente. `stair · ink → cream · peak edges` */
  spec: string;
  note: string;
};

export default function LabDivider({ index, title, spec, note }: LabDividerProps) {
  return (
    <div
      id={`test-${index}`}
      // Las dos reglas de acento NO son adorno, son lo que hace que el límite no
      // dependa del color del vecino. Con solo el fondo `--ink-slate` (#222627)
      // el separador se distinguía perfecto entre bandas cream y quedaba casi
      // invisible entre bandas `--ink` (#101010) — medido en pantalla, dos negros
      // a 1.3:1. Un separador que se ve en la mitad de los casos no separa.
      //
      // `scroll-mt` y no `scroll-m`: el header del sitio es `fixed`, así que un
      // salto por ancla dejaría el separador debajo de él. Es el mismo despeje que
      // usa el resto del frontend, solo que acá aplicado al destino del salto.
      className="scroll-mt-[var(--site-header-block)] border-y-2 border-near-green-accent bg-ink-slate text-cream"
    >
      <Container className="py-8 md:py-10">
        <h2 className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="text-h3">{index}</span>
          <span className="text-eyebrow uppercase">{title}</span>
          {/* La regla punteada es lo que lo hace leer como "cortar acá". Ocupa el
              resto de la línea, así que también separa el título del spec sin un
              divisor extra. `border-dashed` sin color explícito toma
              `currentColor` en Tailwind v4. */}
          <span aria-hidden="true" className="min-w-8 flex-1 border-t border-dashed opacity-30" />
          <span className="text-caption opacity-60">{spec}</span>
        </h2>
        <p className="text-body mt-5 max-w-[80ch] opacity-70">{note}</p>
      </Container>
    </div>
  );
}
