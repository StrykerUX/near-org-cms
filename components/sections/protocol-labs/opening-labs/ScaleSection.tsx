import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";
import { GreenCube, IsoFrame, isoAt } from "@/components/sections/protocol-labs/isoKit";
import { AI_SCALE } from "@/components/sections/protocol-labs/protocolContent";

// ── Built for AI scale ──────────────────────────────────────────────────────
//
// El papel limpio, sin superficie: es el final del descenso. Lo único que se
// cambió respecto de la versión actual es el peso de la viñeta —el cubo pasa de
// 20px a un plano isométrico de 56px— porque a tamaño de viñeta la pieza que
// gobierna toda la identidad de la página se leía como un bullet de color.
//
// ── Por qué vive en su propio archivo ──────────────────────────────────────
//
// Nació dentro de `OpeningA` y se exportaba desde ahí, porque las siete
// aperturas la compartían con variaciones mínimas y A era la primera. Al
// quedarse la carpeta con C, E y G —A se borró— esa casa desapareció y con ella
// el import de E y G. Sacarla acá es lo que corresponde de todos modos: una
// pieza compartida por varias aperturas no debería vivir dentro de una de
// ellas, que fue exactamente lo que la puso a un borrado de romper dos archivos.
//
// No lleva "use client": es JSX puro, sin hooks ni eventos. Sus consumidores
// son client components y la arrastran igual al bundle de cliente; declararlo
// acá sólo le quitaría la posibilidad de renderizarse en el servidor el día que
// alguien la monte desde una view que no lo sea.

const iso = isoAt(28, 20);

export function ScaleSection({ tone = "light" }: { tone?: "light" | "cream" }) {
  return (
    <section className={tone === "cream" ? "bg-cream text-foreground" : "bg-background text-foreground"}>
      <Container className="flex flex-col gap-16 py-28 lg:py-36">
        <div className="grid-ds gap-y-8">
          <h2 className="col-span-full text-h2 text-pretty lg:col-span-5">
            {AI_SCALE.title.lead}
            <br />
            <Accent>{AI_SCALE.title.accent}</Accent>
          </h2>
          <p className="col-span-full max-w-[40ch] text-body-lg text-ink-soft text-pretty lg:col-start-7 lg:col-span-5 lg:pt-2">
            {AI_SCALE.body}
          </p>
        </div>

        <ul className="grid gap-10 md:grid-cols-3 md:gap-12">
          {AI_SCALE.points.map((p) => (
            <li key={p.title} className="flex flex-col gap-4 border-t border-ink pt-5">
              <IsoFrame viewBox="0 0 56 40" className="h-10 w-14">
                <GreenCube iso={iso} s={11} />
              </IsoFrame>
              <h3 className="text-h4">{p.title}</h3>
              <p className="max-w-[36ch] text-body text-ink-soft text-pretty">{p.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default ScaleSection;
