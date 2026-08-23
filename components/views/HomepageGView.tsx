import HeroFold from "@/components/sections/homepage-fold/HeroFold";
import StatementPlain from "@/components/sections/homepage-fold/StatementPlain";
import OwnYourOwn from "@/components/sections/homepage-e/OwnYourOwn";
import SectionReveal from "@/components/sections/homepage-fold/SectionReveal";
import StackOverture from "@/components/sections/homepage-fold/StackOverture";
import StackAnchors from "@/components/sections/homepage-e/StackAnchors";
import ProofDatum from "@/components/sections/homepage-e/ProofDatum";
import BelongsNewsletter from "@/components/sections/homepage-e/BelongsNewsletter";
import CustomerStories from "@/components/sections/homepage-e/CustomerStories";
import PressCarousel from "@/components/sections/homepage-e/PressCarousel";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/homepage-e/UpdatesList";

// /prototype/homepage-g — el pliegue del hero, variante `frame`.
//
// De la cintura para abajo es EXACTAMENTE `homepage-e`: monta sus secciones sin
// copiarlas, porque no es otra línea de diseño sino la misma con otro hero. Un
// ajuste en cualquiera de esas secciones se ve acá también, que es lo que se
// quiere mientras las tres se comparen entre sí.
//
// Lo único propio son las dos primeras secciones, y van juntas por necesidad:
// `HeroFold` no congela el scroll ni dispara ninguna secuencia, así que el
// statement no puede seguir siendo el `AgentEconomy` de la línea viva —que
// espera un evento del hero y sin él se queda invisible—. `StatementPlain` es
// esa misma frase como sección que se sostiene sola.
export default function HomepageGView() {
  return (
    <main className="flex flex-col bg-cream">
      {/* `fade` y no `flip`: acá la palabra se desvanece y el objeto aparece,
          sin que nada rote.

          El recorrido es de 75svh contra los 130 de la variante `f`. Con
          `autoplay` ese número dejó de ser «cuánto scroll cuesta» para pasar a
          ser «cuánto camino recorre el tirón»: el viaje dura lo mismo (segundo
          y medio) mida lo que mida el tramo, así que estirarlo no lo hace más
          lento — lo hace más DETALLADO, porque el pliegue se despliega sobre
          más recorrido en el mismo tiempo.

          Las dos props van juntas: en un recorrido tan corto una rotación no
          llega a leerse como rotación, solo se percibe como un parpadeo.

          `autoplay`: el primer scroll hacia abajo completa el pliegue solo y el
          primero hacia arriba lo desarma, sin que el lector tenga que
          dosificarlo en ninguna de las dos direcciones.

          Y `chip={1.4}`: el objeto mide 1.4 veces el `em` del titular en vez de
          apenas 1. A ese tamaño deja de leerse como una palabra más de la frase
          y pasa a ser una pieza metida en ella — que es el punto, porque lo que
          está adentro es el paisaje entero del hero. */}
      <HeroFold contain="frame" exchange="fade" travel="75svh" chip={1.4} autoplay />
      <StatementPlain />
      <OwnYourOwn />
      {/* La obertura reemplaza a la cortina de bajada. El negro ya no sube
          sobre una pantalla vacía: el título llega antes, sobre crema, y el
          negro se desborda de él. `headEntrance={false}` porque el título de
          la obertura termina exactamente donde el de la sección empieza — la
          entrada propia haría parpadear el relevo. */}
      {/* El stack de siempre —mismas cuatro esquinas, mismo arte, mismo
          recorrido— con un solo cambio: `soloActive`. Se ve la ficha de la capa
          que el arte está mostrando, y las otras tres no están.

          Es la parte del audit de carga cognitiva que se podía aplicar sin
          mover nada de sitio, y es la que más pesaba: de cuatro bloques
          simultáneos a uno, y el contraste resuelto de raíz porque desaparece
          la necesidad de atenuar.

          La versión que SÍ movía todo de sitio —rótulos pegados al arte y un
          panel fijo— vive en `homepage-fold/StackAtlas.tsx`. Quedó fuera del
          árbol de rutas, no borrada: montarla es cambiar este import. */}
      <StackOverture mode="bleed" />
      {/* ⏸ PENDIENTE: el fondo del stack.
      
          Falta la prop `flow`, que cambia el halo por el shader del hero
          recalibrado (`StackFlow`). El componente está hecho y funciona, pero
          ninguna calibración convenció todavía: se probaron abanico desde
          abajo, vórtice con el foco al centro y líneas duras por escalón de
          paleta, y el resultado va de «demasiado brillante» a «se ve plano».
      
          `StackFlow.tsx` conserva todo lo aprendido en cada intento —qué
          parámetro hace qué y cuál rompe a cuál— para retomarlo sin repetir el
          camino. Encenderlo es agregar `flow` acá. */}
      <StackAnchors headEntrance={false} soloActive />
      {/* La salida del negro, con la gramática nueva.
      
          Acá estaba `InkCurtain direction="up"`, que hace el gesto contrario al
          que esta transición necesita: pinta crema encima en vez de retirar el
          negro. El resultado eran dos fallos que resultaron ser el mismo — el
          recorte no revelaba nada porque el panel estaba vacío, y `ProofDatum`
          corría su entrada entera detrás de él y aparecía hecha.
      
          Con `SectionReveal` el velo es el negro del que se sale y se abre
          desde abajo, así que lo que el recorte descubre es la sección de
          verdad; y la sección espera a que la descubran antes de animar. Las
          otras cuatro vistas siguen con la cortina: ver el docblock de
          `SectionReveal.tsx`. */}
      <SectionReveal>
        <ProofDatum />
      </SectionReveal>
      <CustomerStories />
      <PressCarousel />
      <BelongsNewsletter />
      <LatestUpdates />
      <UpdatesList />
    </main>
  );
}
