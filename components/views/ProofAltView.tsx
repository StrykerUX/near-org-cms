import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import ProofDivider from "@/components/sections/proof-alt/ProofDivider";
import { PROOF_ALTS } from "@/components/sections/proof-alt/proofAltContent";

import CadenceStack from "@/components/sections/proof-alt/CadenceStack";
import HaloField from "@/components/sections/proof-alt/HaloField";
import StaircaseDrift from "@/components/sections/proof-alt/StaircaseDrift";

// Tres versiones de UNA sección: las seis pruebas de la homepage, en el sitio
// que hoy ocupa el `ProofStepper` de `/prototype/homepage-ab7` (325svh de
// recorrido para entregar cinco datos).
//
// ── Qué comparten, y por qué eso deja la comparación limpia ────────────────
//
// Las tres montan el MISMO componente de composición (`ProofComposition`) y dos
// de ellas la MISMA entrada (`diagonalReveal`). No es ahorro de código: es lo
// que hace que la única variable entre una y otra sea el mecanismo. Con tres
// markups parecidos, la comparación mediría también las diferencias de
// maquetación que se colaran sin querer.
//
// Reglas que las tres cumplen, y que ya no se discuten: las seis cifras
// visibles a la vez desde el primer frame, nada que dependa del puntero, light
// mode, el cuerpo completo de las seis, y 100svh de alto sin recorrido extra.
//
// ── Los tres están escritos a mano y no salen de un .map() ─────────────────
//
// Mismo criterio que `HeroAltView`: la correspondencia entre cada divider y su
// versión tiene que leerse de un tirón, no quedar implícita en el orden de dos
// arrays.
//
// ── Cómo mirarlas ──────────────────────────────────────────────────────────
//
// Apiladas, las tres se ven casi iguales durante los primeros segundos, y ESO ES
// EL PUNTO: la pregunta que responde este lab no es "cuál es más vistosa", es
// "cuánto aporta cada capa de mecanismo sobre la misma composición". Si al pasar
// de la 01 a la 02 no se nota nada, la capa de la 02 no vale su contexto WebGL.
//
// La 03 hay que juzgarla scrolleando de verdad, no saltando con el ancla: su
// gesto entero ocurre mientras la sección cruza el viewport.

export default function ProofAltView() {
  return (
    <main className="flex flex-col bg-cream">
      <Container as="header" className="py-20 md:py-28">
        <Eyebrow className="opacity-50">Proof lab · 3 versiones</Eyebrow>
        <h1 className="text-h1 mt-6 max-w-[20ch]">Seis pruebas, tres mecanismos</h1>
        <p className="text-body-lg mt-6 max-w-[62ch] opacity-70">
          La sección de pruebas de la homepage, tres veces, con la misma
          composición y las mismas seis cifras. Las seis están completas y
          visibles desde el primer frame en las tres: nada se revela al pasar el
          puntero. Lo único que cambia es de dónde sale el movimiento — de la
          entrada, de una capa de fondo, o del scroll. Las tres miden 100svh y
          ninguna alarga la página.
        </p>

        <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {PROOF_ALTS.map((alt) => (
            <a
              key={alt.id}
              href={`#${alt.id}`}
              className="text-label underline underline-offset-4"
            >
              {alt.index} {alt.title}
            </a>
          ))}
        </nav>
      </Container>

      {/* ── 01 · Cadence — entra en diagonal y se queda quieta ────────────── */}
      <ProofDivider spec={PROOF_ALTS[0]} />
      <CadenceStack />

      {/* ── 02 · Halo — la 01 más una capa de fondo que respira ───────────── */}
      <ProofDivider spec={PROOF_ALTS[1]} />
      <HaloField />

      {/* ── 03 · Staircase — el scroll la endereza, sin gastar recorrido ──── */}
      <ProofDivider spec={PROOF_ALTS[2]} />
      <StaircaseDrift />
    </main>
  );
}
