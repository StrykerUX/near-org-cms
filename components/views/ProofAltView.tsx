import Link from "next/link";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import ProofDivider from "@/components/sections/proof-alt/ProofDivider";
import { PROOF_ALTS } from "@/components/sections/proof-alt/proofAltContent";

import ProofDatum from "@/components/sections/proof-alt/ProofDatum";
import ProofIndex from "@/components/sections/proof-alt/ProofIndex";
import ProofColumns from "@/components/sections/proof-alt/ProofColumns";

// Tres estructuras para las seis pruebas de la homepage, en el sitio que hoy
// ocupa el `ProofStepper` de `/prototype/homepage-ab7` (325svh de recorrido
// para entregar cinco datos).
//
// ── Este lab compara ESTRUCTURAS; las demos comparan convivencia ────────────
//
// Acá las tres se ven una detrás de otra, aisladas, que es la única forma de
// juzgar la estructura sin que el resto de la página opine. Para lo otro —cómo
// se lleva cada una con el hero, con el negro del NEAR Stack que la precede y
// con el stone que la sigue— están las tres rutas de
// `/prototype/homepage-proof/*`, que montan la misma sección dentro de la
// homepage entera.
//
// Las dos preguntas son distintas y ninguna sustituye a la otra: una sección
// puede ganar aislada y perder rodeada, que es exactamente lo que le pasó al
// stepper que esto viene a reemplazar.
//
// ── Los tres están escritos a mano y no salen de un .map() ─────────────────
//
// Mismo criterio que `HeroAltView`: la correspondencia entre cada divider y su
// versión tiene que leerse de un tirón, no quedar implícita en el orden de dos
// arrays.

export default function ProofAltView() {
  return (
    <main className="flex flex-col bg-cream">
      <Container as="header" className="py-20 md:py-28">
        <Eyebrow className="opacity-50">Proof lab · 3 structures</Eyebrow>
        <h1 className="text-h1 mt-6 max-w-[20ch]">Six proofs, three structures</h1>
        <p className="text-body-lg mt-6 max-w-[62ch] opacity-70">
          The homepage proof section, three times, with the same six figures and
          the full body in all of them. All six are visible from the first frame:
          nothing is revealed on hover. All three measure one screen, enter once
          and stay still. What changes is the structure.
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

        <p className="text-body-sm mt-8 max-w-[62ch] opacity-60">
          Para verlas dentro de la homepage entera —con el hero, el negro del
          NEAR Stack encima y la newsletter debajo—:{" "}
          <Link className="underline underline-offset-4" href="/prototype/homepage-proof/datum">
            datum
          </Link>
          ,{" "}
          <Link className="underline underline-offset-4" href="/prototype/homepage-proof/index">
            index
          </Link>
          ,{" "}
          <Link className="underline underline-offset-4" href="/prototype/homepage-proof/columns">
            columns
          </Link>
          .
        </p>
      </Container>

      {/* ── B · Datum — un eje y seis marcas ──────────────────────────────── */}
      <ProofDivider spec={PROOF_ALTS[0]} />
      <ProofDatum />

      {/* ── C · Index — seis renglones de un documento ────────────────────── */}
      <ProofDivider spec={PROOF_ALTS[1]} />
      <ProofIndex />

      {/* ── D · Columns — seis columnas del alto de la pantalla ───────────── */}
      <ProofDivider spec={PROOF_ALTS[2]} />
      <ProofColumns />
    </main>
  );
}
