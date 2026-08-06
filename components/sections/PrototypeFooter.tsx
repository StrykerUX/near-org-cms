import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import Container from "@/components/primitives/Container";

const GROUPS = [
  {
    title: "About",
    links: ["Founders Hub", "Developers Hub", "NEAR Roadmap & History", "Blog"],
  },
  {
    title: "Tech Stack",
    links: ["Blockchain", "Chain Abstraction", "Intents", "AI"],
  },
  {
    title: "Social",
    links: ["X", "YouTube", "GitHub", "Reddit", "Telegram", "Discord"],
  },
];

const LEGAL = ["Privacy", "Terms of Use", "Cookie Policy"];

// El wordmark es 1440×359 (ratio 4.01:1) y se muestra al 100% del ancho, así
// que su alto crece con el viewport. Este techo es el alto que tendría a
// 1920px: 1920 × 359 / 1440. Más allá de ese ancho la imagen sigue creciendo y
// el contenedor la recorta por abajo, en vez de empujar el footer a un alto
// desproporcionado.
const WORDMARK_MAX_H = Math.round((1920 * 359) / 1440); // 479

export default function PrototypeFooter() {
  return (
    <footer className="bg-cream text-foreground">
      <Container className="grid gap-16 pb-24 pt-24 lg:grid-cols-[1fr_auto] lg:gap-24">
        <p className="text-h2 text-pretty">
          Where money
          <br />
          <Accent>actually moves.</Accent>
        </p>

        <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3 lg:gap-x-16">
          {GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-label">{group.title}</h2>
              <ul className="mt-3 flex flex-col gap-1.5">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>

      {/* `isolate` acota el grupo de blending del texto legal de abajo, y el
          max-height + overflow-hidden es lo que recorta el wordmark. */}
      <div
        className="relative isolate overflow-hidden"
        style={{ maxHeight: `${WORDMARK_MAX_H}px` }}
      >
        {/* Ancho completo y alto automático: la imagen manda el alto hasta que
            el contenedor topa su máximo y la corta. `priority={false}` a
            propósito — está al final de la página, no compite con el hero. */}
        <Image
          src="/prototype/near-wordmark.png"
          alt="NEAR"
          width={1440}
          height={359}
          className="h-auto w-full"
        />

        {/* El legal va ENCIMA del wordmark, y ahí hay un problema real: parte
            del texto cae sobre las letras negras y parte sobre el fondo claro,
            así que ningún color fijo se ve bien en los dos.
            `mix-blend-difference` lo resuelve invirtiendo contra lo que haya
            detrás, y con un GRIS de origen el resultado es gris en los dos
            casos —claro sobre el negro, oscuro sobre el cream— en vez del
            blanco/negro puro que daría un source blanco.
            `neutral-400` y no un gris más oscuro: bajo difference, un source
            medio (#737373) cae a ~4:1 de contraste contra los dos fondos,
            mientras este pasa AA en ambos (8.3:1 sobre negro, 6.9:1 sobre
            cream). */}
        <div className="absolute inset-x-0 bottom-6 mix-blend-difference">
          <Container className="flex flex-wrap items-center justify-end gap-x-8 gap-y-2 text-neutral-400">
            <p className="text-body-sm">© 2026 NEAR. All rights reserved.</p>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {LEGAL.map((item) => (
                <li key={item}>
                  <a href="#" className="text-body-sm transition-opacity hover:opacity-70">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      </div>
    </footer>
  );
}
