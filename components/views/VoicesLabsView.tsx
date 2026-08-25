import LabDivider from "@/components/sections/closing-labs/LabDivider";
import TestimonialDeck from "@/components/sections/homepage-tuck/TestimonialDeck";
import VoicesRibbon from "@/components/sections/voices-labs/Ribbon";
import VoicesSwitchboard from "@/components/sections/voices-labs/Switchboard";
import VoicesStage from "@/components/sections/voices-labs/Stage";
import VoicesMarks from "@/components/sections/voices-labs/Marks";

// Cuatro alternativas para la sección de testimonios, con la sección VIVA
// montada arriba de todo como punto de comparación.
//
// ── Por qué el mazo va incluido ─────────────────────────────────────────────
//
// Es la única página de laboratorio del repo que monta la sección que está en
// producción junto a las propuestas, y no es una excepción caprichosa: acá no
// se está eligiendo entre cuatro opciones nuevas, se está decidiendo si alguna
// de las cuatro es MEJOR que lo que ya hay. Sin el mazo en la misma página esa
// pregunta se contesta de memoria, y la memoria siempre le da la razón a lo
// último que se vio.
//
// Es también el único punto donde el laboratorio depende de la línea viva. La
// dependencia va en la dirección permitida —el lab importa a la página real, no
// al revés— y se corta sola el día que el lab se borre.
export default function VoicesLabsView() {
  return (
    <main className="bg-cream">
      <header className="mx-auto flex w-full max-w-[1780px] flex-col gap-4 px-[60px] pb-16 pt-[calc(var(--site-header-block)+4rem)]">
        <p className="text-caption-mono uppercase text-ink/50">Voices labs</p>
        <h1 className="text-h1 max-w-[18ch] text-balance text-ink">
          Lo que otros dicen
        </h1>
        <p className="text-body max-w-[62ch] text-ink/70 text-pretty">
          Cuatro alternativas a la sección de testimonios de la home, más el mazo
          que está montado hoy en <code>/prototype/homepage-c</code>. Las cinco
          leen las mismas cuatro citas de{" "}
          <code>homepage-tuck/testimonialDeckContent.ts</code>.
        </p>
        <p className="text-caption max-w-[62ch] text-ink/50 text-pretty">
          La pregunta no es cuál gusta más: es qué le pide cada una a la página.
          Una cuesta cuatro pantallas de scroll, otra cabe en media y no se lee
          de corrido. Está anotado en la cabecera de cada archivo.
        </p>
      </header>

      <LabDivider
        index={0}
        name="deck · hoy"
        source="homepage-tuck/TestimonialDeck"
        note="Lo que está montado. Una cita grande a la izquierda y una cinta de cards que baja en diagonal: la card de adelante y la cita son la misma persona."
      />
      <TestimonialDeck />

      <LabDivider
        index={1}
        name="ribbon"
        source="referencia nueva · cinta de cards"
        note="Cuatro cards del mismo tamaño cruzando la pantalla a sangre, con la empresa arriba a la izquierda y una sola card de color. Ya no hay voz principal: hay más de las que entran."
      />
      <VoicesRibbon />

      <LabDivider
        index={2}
        name="switchboard"
        source="el índice del mazo, legible"
        note="La lista de los cuatro nombres a la izquierda y la cita grande a la derecha. Misma idea que el mazo —el índice manda— con el mecanismo dado vuelta: el lector elige y ve a quiénes."
      />
      <VoicesSwitchboard />

      <LabDivider
        index={3}
        name="stage"
        source="escena pegada, movida por scroll"
        note="Una voz por pantalla, a tamaño de titular, sin nada más en el cuadro. La más generosa con cada cita y la más cara: cuatro pantallas de scroll para ochenta palabras."
      />
      <VoicesStage />

      <LabDivider
        index={4}
        name="marks"
        source="la barra de logos que habla"
        note="La empresa como objeto principal y la cita como epígrafe. Cuatro pruebas en una banda de una pantalla — la más eficiente, y la única donde la cita no se lee de corrido."
      />
      <VoicesMarks />
    </main>
  );
}
