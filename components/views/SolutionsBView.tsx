import SwitchHero from "@/components/sections/solutions-b/SwitchHero";
import Switchboard from "@/components/sections/solutions-b/Switchboard";
import ConfidentialPanel from "@/components/sections/solutions-b/ConfidentialPanel";
import BuilderTable from "@/components/sections/solutions-b/BuilderTable";
import ClosingCta from "@/components/sections/solutions-b/ClosingCta";

// Propuesta B para `/solutions` — «el conmutador».
//
// ── La tesis ────────────────────────────────────────────────────────────────
//
// **Un hub es una interfaz, no un artículo.**
//
// Las otras propuestas de esta familia son documentos: se recorren de arriba
// abajo y el orden lo pone la página. D parte de que el lector de un hub no
// viene a que le cuenten cinco cosas — viene a encontrar la suya, y elegir
// debería costarle un clic y cero scroll.
//
// De ahí sale todo: las cinco soluciones viven en UNA pantalla, la lista siempre
// visible a la izquierda y el contenido de la activa a la derecha, con
// navegación por teclado de verdad. Y la franja de cifras no es una sección: va
// dentro del hero, para que la primera vista entregue afirmación, argumento,
// acción y evidencia sin pedir scroll.
//
// ── En qué se diferencia de la escena pegada que se descartó en A ──────────
//
// El reparto se parece —lista quieta, contenido al lado— y el mecanismo no tiene
// nada que ver. Conviene tenerlo claro porque es la trampa obvia:
//
// · Aquella costaba **380svh de scroll** para entregar cinco párrafos, en el
//   orden que imponía la página. Ésta cuesta **una pantalla** y el orden lo
//   elige el lector.
// · Aquella centraba cada beat en un contenedor de 100svh, así que al entrar en
//   la sección lo primero que aparecía era media pantalla vacía. Ésta no se
//   mueve: el panel está lleno desde el primer frame.
//
// La regla que queda: una escena pegada le sirve a una página que quiere enseñar
// una MECÁNICA, no a una que quiere que la CONSULTEN.
//
// ── El ritmo ────────────────────────────────────────────────────────────────
//
//   hero + cifras   crema     una pantalla, todo el aparato de entrada
//   conmutador      crema     las cinco soluciones, una pantalla, sin scroll
//   confidencial    INK       el mismo panel con el tramo del medio ilegible
//   constructores   BLANCO    ocho filas — el único respiro claro
//   cierre          INK       el tablero con los cinco cables puestos
//
// Cinco secciones y ~4 pantallas de recorrido: es la propuesta más corta de las
// seis. El blanco de los constructores no es decorativo — llega justo después
// del corte oscuro y es el único respiro del recorrido.
//
// ── El dibujo es UNO solo ──────────────────────────────────────────────────
//
// Un panel de conexión con jacks arriba y abajo. No cambia de tema entre
// secciones: cambia de estado. Cinco parcheos en el conmutador, el tramo del
// medio velado en el corte oscuro, y todos los cables puestos a la vez en el
// cierre — que es el único estado que ninguna pestaña muestra.
//
// Si alguna variante mueve un jack de sitio, el efecto se cae: el ojo deja de
// reconocer el panel y las figuras vuelven a ser cinco dibujos sueltos.
//
// ── Lo que queda abierto ───────────────────────────────────────────────────
//
// 1. **Contenido detrás de pestañas.** Los cinco paneles están siempre en el DOM
//    (los inactivos con `hidden`), así que el HTML servido los trae todos. Aun
//    así, cuatro de cinco soluciones no se ven sin interactuar, y eso es un
//    costo real de descubrimiento que hay que pesar contra lo que gana en
//    velocidad de elección.
// 2. **Es la única de las seis sin superficie ni escala mural.** Su textura es
//    la propia UI. Si en pantalla se lee como un panel de control genérico y no
//    como una página de NEAR, el problema es ése y no una card suelta.
export default function SolutionsBView() {
  return (
    <main className="flex flex-col bg-cream">
      <SwitchHero />
      <Switchboard />
      <ConfidentialPanel />
      <BuilderTable />
      <ClosingCta />
    </main>
  );
}
