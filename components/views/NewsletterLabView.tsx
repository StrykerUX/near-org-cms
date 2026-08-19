import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import NewsletterLabFrame from "@/components/sections/newsletter-labs/NewsletterLabFrame";
import { NEWSLETTER_VARIANTS } from "@/components/sections/newsletter-labs/newsletterLabContent";

import Belongs01Marquee from "@/components/sections/newsletter-labs/Belongs01Marquee";
import Belongs02Rule from "@/components/sections/newsletter-labs/Belongs02Rule";
import Belongs03Split from "@/components/sections/newsletter-labs/Belongs03Split";
import Belongs04Inline from "@/components/sections/newsletter-labs/Belongs04Inline";
import Belongs05Halo from "@/components/sections/newsletter-labs/Belongs05Halo";
import Belongs06Grain from "@/components/sections/newsletter-labs/Belongs06Grain";
import Belongs07Column from "@/components/sections/newsletter-labs/Belongs07Column";
import Belongs08Field from "@/components/sections/newsletter-labs/Belongs08Field";
import Belongs09Teletype from "@/components/sections/newsletter-labs/Belongs09Teletype";
import Belongs10Ascii from "@/components/sections/newsletter-labs/Belongs10Ascii";
import Belongs11Curtain from "@/components/sections/newsletter-labs/Belongs11Curtain";
import Belongs12Sonar from "@/components/sections/newsletter-labs/Belongs12Sonar";
import Belongs13Ticker from "@/components/sections/newsletter-labs/Belongs13Ticker";
import Belongs14Shutter from "@/components/sections/newsletter-labs/Belongs14Shutter";

// Ocho versiones de la banda "NEAR belongs to you", cada una con sus dos vecinas
// de la homepage alrededor.
//
// ── Las ocho en UNA ruta, al revés que el lab del stack ────────────────────
//
// `stack-labs` reparte sus cinco variantes en cinco rutas porque cada una monta
// ~287KB de paths y un track sticky. Acá no hay nada de eso: la sección más
// pesada es la que anima un radial, y solo cinco de las ocho montan el
// `ShineField` (que sí abre un contexto WebGL2 por instancia — cinco está
// holgadamente por debajo del límite del navegador).
//
// Y hay una razón positiva, no solo la ausencia de un impedimento: estas ocho se
// diferencian sobre todo por el FONDO, y el fondo se juzga comparando. Cambiar
// de página entre una y otra obliga a recordar el color en vez de verlo.
//
// ── Los ocho están escritos a mano y no salen de un .map() ────────────────
//
// Mismo criterio que `HeroAltView` y `ProofAltView`: la correspondencia entre
// cada ficha y su variante tiene que leerse de un tirón.
export default function NewsletterLabView() {
  return (
    <main className="flex flex-col bg-cream">
      <Container as="header" className="py-20 md:py-28">
        <Eyebrow className="opacity-50">Newsletter lab · 14 variants</Eyebrow>
        <h1 className="text-h1 mt-6 max-w-[22ch]">Fourteen ways to ask for an email</h1>
        <p className="text-body-lg mt-6 max-w-[62ch] opacity-70">
          The «NEAR belongs to you» band, fourteen times, with the same copy:
          wordmark, claim, paragraph and field. What changes is the composition,
          the background and the shape of the field — and in the last six,
          something moves as well.
        </p>
        <p className="text-body-sm mt-5 max-w-[62ch] opacity-60">
          The staircases that open and close the section today are OUT of all
          eight: each one resolves the seam another way, or with a straight cut.
          Every variant comes with its two homepage neighbours —the white of the
          proof section above, the cream of customer stories below— so the cut is
          visible.
        </p>

        <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {NEWSLETTER_VARIANTS.map((v) => (
            <a
              key={v.id}
              href={`#${v.id}`}
              className="text-label underline underline-offset-4"
            >
              {v.index} {v.title}
            </a>
          ))}
        </nav>
      </Container>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[0]}>
        <Belongs01Marquee />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[1]}>
        <Belongs02Rule />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[2]}>
        <Belongs03Split />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[3]}>
        <Belongs04Inline />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[4]}>
        <Belongs05Halo />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[5]}>
        <Belongs06Grain />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[6]}>
        <Belongs07Column />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[7]}>
        <Belongs08Field />
      </NewsletterLabFrame>

      {/* ── Las tres con movimiento ────────────────────────────────────── */}
      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[8]}>
        <Belongs09Teletype />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[9]}>
        <Belongs10Ascii />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[10]}>
        <Belongs11Curtain />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[11]}>
        <Belongs12Sonar />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[12]}>
        <Belongs13Ticker />
      </NewsletterLabFrame>

      <NewsletterLabFrame spec={NEWSLETTER_VARIANTS[13]}>
        <Belongs14Shutter />
      </NewsletterLabFrame>
    </main>
  );
}
