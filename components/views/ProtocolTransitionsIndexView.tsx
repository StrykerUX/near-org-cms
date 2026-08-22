import Link from "next/link";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import ArrowCircle from "@/components/sections/quantum/ArrowCircle";

// Índice del laboratorio de transiciones — /prototype/protocol-transitions
//
// Doce maneras de pasar del hero al contenido, agrupadas por lo que ocupan. La
// altura no es un detalle de implementación: **es la decisión**. Una banda de
// 28svh y una escena de siete pantallas no son la misma pieza a distinta escala,
// son dos respuestas distintas a la pregunta de cuánto vale este momento de la
// página.
//
// Por eso el índice agrupa por altura y no por técnica: lo primero que hay que
// decidir es cuánto recorrido merece la juntura, y recién después cómo se usa.

type Variant = {
  id: string;
  name: string;
  idea: string;
  risk: string;
};

const GROUPS: Array<{ band: string; premise: string; items: Variant[] }> = [
  {
    band: "25 – 30 svh",
    premise:
      "La juntura es un cambio de superficie, no un momento. Las cifras se leen enteras y el lector no se detiene: pasa.",
    items: [
      {
        id: "t1",
        name: "Fold",
        idea: "El papel se pliega. El crema del hero dobla en una franja con sombra dirigida y las cifras viven sobre el doblez; debajo empieza el blanco.",
        risk: "Es la más contenida de las doce. Elegirla es decir que la transición no debe llamar la atención.",
      },
      {
        id: "t2",
        name: "Aperture",
        idea: "Las cifras están compuestas a escala de cartel y la banda es más baja que ellas: se ve una franja de números gigantes, cortados arriba y abajo, desplazándose con el scroll.",
        risk: "Legibilidad. Cortar «<$0.002» por la mitad pierde más silueta que cortar un dígito.",
      },
      {
        id: "t3",
        name: "Seam",
        idea: "El campo de shards de la página publicada, recortado en una banda estrecha. La juntura pasa a ser el lugar donde la red se parte.",
        risk: "El mismo canvas a 26svh se lee como muestra y no como atmósfera. Hay que confirmar que sobreviva al recorte.",
      },
      {
        id: "t4",
        name: "Handoff",
        idea: "La única que hace el puente con lenguaje: una línea que toma la afirmación del hero y la convierte en la pregunta que el contenido responde.",
        risk: "Si la frase no funciona, no hay nada más. Máximo riesgo editorial, mínimo riesgo técnico.",
      },
    ],
  },
  {
    band: "≈ 50 svh",
    premise:
      "Media pantalla alcanza para una escena corta: hay lugar para que algo pase, sin que la transición se vuelva un capítulo.",
    items: [
      {
        id: "t5",
        name: "Fan",
        idea: "Seis planos isométricos llegan apilados en el centro y se abren en abanico. Seis que salen de uno es lo que hace la red de la que habla la página.",
        risk: "La geometría isométrica no tolera rotación libre: con más de unos grados los ejes dejan de coincidir.",
      },
      {
        id: "t6",
        name: "Split",
        idea: "Arriba el crema del hero, abajo el blanco del contenido, y las cifras partidas por esa línea con las mitades desalineadas. Al scrollear se alinean: la evidencia cose el corte.",
        risk: "Durante buena parte del recorrido las cifras son ilegibles — y ese es el estado que más se ve.",
      },
      {
        id: "t7",
        name: "Bridge",
        idea: "Una pregunta a escala de statement en el único momento donde el lector ya sabe qué se afirma y todavía no sabe cómo. Las cifras son el comienzo de la respuesta.",
        risk: "La pregunta retórica es un recurso gastado. Funciona sólo si es la que el lector realmente tiene ahí.",
      },
      {
        id: "t8",
        name: "Grid",
        idea: "Las doce columnas que gobiernan toda la página se dibujan una única vez, acá, y se desvanecen hacia abajo. Las cifras aterrizan en columnas alternas.",
        risk: "Mostrar el andamiaje puede leerse como recurso de portfolio si no queda claro que es el andamiaje real.",
      },
    ],
  },
  {
    band: "85 – 100 svh",
    premise:
      "La transición se vuelve una sección con derecho propio. Sólo se paga si el equipo cree que estas seis cifras son lo más importante de la página.",
    items: [
      {
        id: "t9",
        name: "Descent",
        idea: "Siete pantallas pegadas: cada cifra sola, a escala de cartel, y un séptimo tramo donde las seis se contraen a la fila que encabeza el contenido. El descenso aterriza.",
        risk: "Seis pantallas para seis datos es mucho recorrido. Sin el séptimo tramo sería un carrusel que deja al lector arriba.",
      },
      {
        id: "t10",
        name: "Curtain",
        idea: "Pantalla negra con el campo de shards y las cifras suspendidas; el negro se abre hacia el blanco por su borde inferior, ligado al scroll. Telón entre dos actos.",
        risk: "El acto y el cierre ya son oscuros y son escasos a propósito. Un tercer negro les baja el rango: hay que rehacer el ritmo de la página detrás.",
      },
      {
        id: "t11",
        name: "Mural",
        idea: "Una palabra del ancho de la página — «proven», extraída del hero, no inventada — y las seis cifras debajo como su aparato. Una pausa, no un efecto.",
        risk: "Es la más silenciosa de las cuatro grandes. Existe para preguntar si acá hace falta que la transición haga algo.",
      },
      {
        id: "t12",
        name: "Genesis",
        idea: "La plancha isométrica que protagoniza el acto central nace acá: el plano vacío, diez shards apareciendo en orden de profundidad, y el privado apoyándose al final.",
        risk: "Deja de ser un intervalo y pasa a ser el prólogo del acto. Si gana, `machineArt` debería exponer un estado vacío en vez de duplicar la pieza.",
      },
    ],
  },
];

export default function ProtocolTransitionsIndexView() {
  return (
    <main className="bg-cream text-foreground">
      <Container className="flex flex-col gap-16 pb-28 pt-[calc(var(--site-header-block)+4rem)]">
        <div className="flex max-w-[68ch] flex-col gap-6">
          <p className="uppercase text-eyebrow-mono text-gray-intermediate">
            Protocol · hero → contenido
          </p>
          <h1 className="text-h1 text-balance">
            Doce maneras de <Accent display>entregar al lector</Accent>
          </h1>
          <p className="text-body-lg text-ink-soft text-pretty">
            No son separadores. Cada una introduce el contenido o hace de transición entre la
            afirmación del hero y la explicación que sigue, y todas cargan las mismas seis cifras
            como material.
          </p>
          <p className="text-body text-gray-intermediate text-pretty">
            Están agrupadas por altura porque la altura es la decisión, no un detalle: una banda de
            28svh y una escena de siete pantallas no son la misma pieza a distinta escala, son dos
            respuestas a cuánto vale este momento de la página. Cada una se ve entre el hero real y
            la sección real que sigue.
          </p>
        </div>

        {GROUPS.map((group) => (
          <section key={group.band} className="flex flex-col gap-8">
            <div className="flex flex-col gap-3 border-t border-ink pt-6">
              <h2 className="text-h3">{group.band}</h2>
              <p className="max-w-[62ch] text-body text-ink-soft text-pretty">{group.premise}</p>
            </div>

            <div className="flex flex-col">
              {group.items.map((v) => (
                <Link
                  key={v.id}
                  href={`/prototype/protocol-transitions/${v.id}`}
                  data-q-arrow-host
                  className="grid-ds gap-y-5 border-t border-rule py-8 transition-colors duration-500 hover:border-ink hover:bg-background"
                >
                  <div className="col-span-full flex items-baseline gap-4 lg:col-span-2">
                    <span className="uppercase text-micro-mono text-gray-intermediate">
                      {v.id.toUpperCase()}
                    </span>
                    <span className="text-h4">{v.name}</span>
                  </div>

                  <p className="col-span-full max-w-[58ch] text-body text-ink-soft text-pretty lg:col-span-5">
                    {v.idea}
                  </p>

                  <p className="col-span-full max-w-[52ch] text-body-sm text-gray-intermediate text-pretty lg:col-span-4">
                    {v.risk}
                  </p>

                  <span className="col-span-full lg:col-span-1 lg:justify-self-end">
                    <ArrowCircle />
                  </span>
                </Link>
              ))}
              <span aria-hidden="true" className="block h-px bg-ink" />
            </div>
          </section>
        ))}

        <p className="max-w-[68ch] text-body-sm text-gray-intermediate text-pretty">
          La copy de T4, T7 y T11 vive en{" "}
          <code className="text-caption-mono">transitionContent.ts</code> y{" "}
          <strong>no está aprobada</strong>: dos de esas variantes hacen el puente con lenguaje y
          sin una frase no existen. La palabra de T11 no se inventó — se extrajo del hero.
        </p>
      </Container>
    </main>
  );
}
