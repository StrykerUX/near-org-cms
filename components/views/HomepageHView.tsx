import HeroFold from "@/components/sections/homepage-fold/HeroFold";
import StatementPlain from "@/components/sections/homepage-fold/StatementPlain";
import OwnYourOwn from "@/components/sections/homepage-e/OwnYourOwn";
import InkCurtain from "@/components/sections/homepage-e/InkCurtain";
import StackOverture from "@/components/sections/homepage-fold/StackOverture";
import StackAnchors from "@/components/sections/homepage-e/StackAnchors";
import ProofDatum from "@/components/sections/homepage-e/ProofDatum";
import BelongsNewsletter from "@/components/sections/homepage-e/BelongsNewsletter";
import CustomerStories from "@/components/sections/homepage-e/CustomerStories";
import PressCarousel from "@/components/sections/homepage-e/PressCarousel";
import LatestUpdates from "@/components/sections/LatestUpdates";
import UpdatesList from "@/components/sections/homepage-e/UpdatesList";

// /prototype/homepage-h — duplicado de `/prototype/homepage-g`.
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
export default function HomepageHView() {
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
      {/* LO ÚNICO que distingue esta ruta de `/prototype/homepage-g`: cómo
          llega el negro — acá, el objeto del hero baja cruzando la pantalla y deja el negro detrás, como un pincel. Todo lo demás, hero incluido, es
          idéntico. */}
      <StackOverture mode="brush" />
      <StackAnchors headEntrance={false} />
      <InkCurtain direction="up" span={45} />
      <ProofDatum />
      <CustomerStories />
      <PressCarousel />
      <BelongsNewsletter />
      <LatestUpdates />
      <UpdatesList />
    </main>
  );
}
