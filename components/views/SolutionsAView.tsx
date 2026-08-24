import IndexHero from "@/components/sections/solutions-a/IndexHero";
import ProofRow from "@/components/sections/solutions-a/ProofRow";
import SolutionsTable from "@/components/sections/solutions-a/SolutionsTable";
import ConfidentialSpotlight from "@/components/sections/solutions-a/ConfidentialSpotlight";
import BuilderWall from "@/components/sections/solutions-a/BuilderWall";
import ClosingCta from "@/components/sections/solutions-a/ClosingCta";

// Propuesta A para `/solutions` — «el índice».
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// **El lector llega con su caso de uso ya decidido, y la página entera es un
// directorio.**
//
// Un hub de soluciones no se lee: se consulta. Quien entra a `/solutions` casi
// nunca viene a enterarse de qué hay — viene con una pregunta concreta («¿esto
// sirve para pagos cross-border?») y su único trabajo es encontrar dónde se
// contesta. Todo en A sale de ahí: el índice completo entra sobre el fold con
// anclas reales, y lo que sigue es una tabla densa donde las cinco soluciones se
// comparan sin releerlas.
//
// ── La escena pegada que esto reemplazó ────────────────────────────────────
//
// Hubo una versión con las cinco soluciones en un índice PEGADO —lista quieta a
// la izquierda, cuerpos en crossfade a la derecha, 76svh por beat— y se descartó
// entera. Fallaba por los dos lados a la vez:
//
// · **Contradecía la tesis.** Cobraba cinco pantallas de scroll para entregar
//   cinco párrafos. Un directorio que se recorre como una presentación deja de
//   ser un directorio.
// · **Se veía vacía.** El contenido de un beat vive centrado en un contenedor de
//   100svh, así que al entrar en la sección lo primero que aparece es media
//   pantalla de crema y el texto llega mucho después de haberla «tocado». Con
//   cinco beats eso pasaba cinco veces seguidas.
//
// El detalle completo está en `SolutionsTable`. Lo que queda vale como regla
// para esta familia: **una escena pegada le sirve a una página que quiere
// enseñar una mecánica, no a una que quiere que la consulten.**
//
// ── El ritmo ────────────────────────────────────────────────────────────────
//
//   hero + índice   crema     pantalla completa, sin cifras, retícula a la vista
//   cifras          crema     cinco iguales, en una fila
//   tabla           crema     cinco filas densas, campos alineados en columna
//   spotlight       INK       Confidential Intents, texto y figura en paralelo
//   constructores   BLANCO    ocho fichas quietas — el único respiro claro
//   cierre          INK       el abanico: el índice leído al revés
//
// Claro · claro · claro · OSCURO · claro · OSCURO. Nada fuerte sigue a nada
// fuerte, que es la regla que traen quantum, chain y la homepage viva.
//
// El blanco de los constructores no es decorativo y no se puede mover a crema:
// es el único respiro claro del recorrido, y solo funciona porque llega
// inmediatamente después del corte oscuro. Sobre crema sería la cuarta sección
// seguida del mismo tono.
//
// ── Los cambios de suelo: corte seco ──────────────────────────────────────
//
// Sin transición ninguna. El crema termina, el negro empieza. El corte es el
// gesto, como pasar la página de una revista.
//
// **Acá hubo dos `InkCurtain`** —paneles `fixed` del tamaño del viewport,
// recortados con `clip-path` y atados al scroll, que subían tapando— y se
// borraron. El motivo no se arregla afinando el número: un panel opaco a
// pantalla completa **es** una pantalla vacía mientras dure. Se acortó su
// recorrido de 1357px a 620 y el síntoma no se movió: lo que se ve durante el
// gesto es un rectángulo de un color plano y, por encima de su borde, el aire
// de la sección que viene. Dos pantallas lisas, una negra y una blanca.
//
// El intento siguiente fue que el gesto lo hicieran las secciones —la saliente
// quieta en `sticky bottom-0`, la entrante subiéndole por encima— para tener
// contenido a los dos lados del borde que sube. No funciona con `bottom`: la
// spec constriñe el borde INFERIOR de una caja sticky a no bajar del viewport,
// o sea que la empuja hacia ARRIBA, y las tres secciones saltaron al tope de la
// página. Retenerlas de verdad pide un `top` negativo del alto de cada sección
// menos el viewport: un número por sección, medido en JS y re-medido en cada
// resize. Demasiada máquina para un cambio de fondo.
//
// Lo que se pierde está anotado: A entra y sale del negro sin gesto propio.
// Recuperarlo pide un mecanismo que lleve CONTENIDO y no color — el
// `StackOverture` de `homepage-fold` es el candidato: el negro llega detrás del
// titular de la sección entrante y el titular se invierte por donde el negro
// pasó, así que en ningún frame hay una pantalla lisa. Ése sería el camino si
// se quiere volver a intentarlo.

// ── Lo que queda abierto ───────────────────────────────────────────────────
//
// 1. **A es la sobria de las dos, y ese es su riesgo.** Sin superficie, con la
//    retícula como única textura, puede leerse como documentación en vez de
//    como una página de soluciones. Es exactamente lo que la comparación contra
//    B tiene que contestar — y por eso no se le agregó un shader «por las
//    dudas».
export default function SolutionsAView() {
  return (
    <main className="flex flex-col bg-cream">
      <IndexHero />
      <ProofRow />
      <SolutionsTable />
      <ConfidentialSpotlight />
      <BuilderWall />
      <ClosingCta />
    </main>
  );
}
