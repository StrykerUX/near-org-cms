import { GridOverlay } from "@/components/primitives/Grid";
import DatasheetHero from "@/components/sections/protocol-labs/a/DatasheetHero";
import Deployment from "@/components/sections/protocol-labs/a/Deployment";
import Appendix from "@/components/sections/protocol-labs/a/Appendix";
import ScaleClaim from "@/components/sections/protocol-labs/b/ScaleClaim";
import Assembly from "@/components/sections/protocol-labs/b/Assembly";
import DevRuntime from "@/components/sections/protocol-labs/b/DevRuntime";
import MachineClose from "@/components/sections/protocol-labs/b/MachineClose";

// Alternativa D — /prototype/protocol-d
//
// La selección hecha sobre A y B: hero y ecosistema/apéndice de A, propiedades,
// acto, developers y cierre de B.
//
// ── Por qué D IMPORTA en vez de copiar ─────────────────────────────────────
//
// La regla del laboratorio (ver `../README.md`) es que una versión que gana **se
// copia** a la carpeta que la reciba. Rige entre el laboratorio y una página
// real, y entre laboratorios distintos. Acá no aplica, y forzarla haría daño:
// D no es un fork de A y B, es una AFIRMACIÓN sobre ellas — que estas siete
// secciones funcionan juntas tal como están hoy. Copiadas, la primera corrección
// en A o B dejaría de llegar a D, y D pasaría a ser evidencia de una versión que
// ya no existe en ningún lado.
//
// La regla vuelve a aplicar en cuanto D gane: ahí sus siete secciones se copian
// a la carpeta de la página real, y ese es el momento en que dejan de moverse.
//
// ── Lo único que hubo que tocar ────────────────────────────────────────────
//
// `ScaleClaim` va con `proof={false}`. El hero de A ya presenta las seis cifras
// fundidas con el titular, y el acto las reparte otra vez como telemetría: con
// la banda encendida aparecerían tres veces, y a la tercera dejan de leerse como
// prueba. La prop tiene default `true`, así que B no cambia.
//
// ── El ritmo ────────────────────────────────────────────────────────────────
//
//   hero            crema     titular + las seis cifras, retícula de 12 columnas
//   propiedades     blanco    tres puntos con viñeta de cubo (sin banda)
//   ACTO            INK       seis pantallas, panel pegado, un objeto que muta
//   developers      crema     centrado — el corte contra el compás del acto
//   ecosistema      blanco    tres columnas cortas, numeradas 11 / 12 / 13
//   apéndice        crema     cinco referencias con su host
//   cierre          INK       el objeto completo, centrado
//
// Claro · claro · OSCURO · claro · claro · claro · OSCURO. Nada fuerte sigue a
// nada fuerte, que es la regla de ritmo que traen las páginas de quantum y
// protocol.
//
// ── Lo que hay que mirar de esta mezcla ────────────────────────────────────
//
// 1. **La retícula queda huérfana.** `ColumnRule` es la textura firmante de A y
//    aparece en su hero Y en su cierre. Acá el cierre es el de B, así que se ve
//    una sola vez y no vuelve. O se acepta como textura de entrada, o el cierre
//    tiene que recuperarla.
// 2. **Dos ejes de composición.** A alinea todo a la izquierda; B centra
//    developers y el cierre. En D conviven, y el cambio de eje cae justo después
//    del acto. Puede leerse como el corte que B buscaba, o como dos plantillas
//    pegadas. Es la pregunta principal de esta versión.
// 3. **El hero promete una ficha técnica** —titular + tabla de cifras— y lo que
//    sigue es un acto narrativo. Es una mezcla legítima (afirmar con datos,
//    después demostrar), pero hay que confirmar que el salto no se sienta como
//    un cambio de página.
export default function ProtocolLabDView() {
  return (
    <>
      <main>
        <DatasheetHero />
        <ScaleClaim proof={false} />
        <Assembly />
        <DevRuntime />
        <Deployment />
        <Appendix />
        <MachineClose />
      </main>
      <GridOverlay />
    </>
  );
}
