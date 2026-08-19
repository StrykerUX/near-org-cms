"use client";

import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { DEBUG_MARKERS, EASE_OUT } from "@/components/primitives/motion/motionTokens";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { PROOF_STATS } from "@/components/sections/proof-alt/proofAltContent";

// ── C · Index ────────────────────────────────────────────────────────────────
//
// Seis renglones de un documento. Cada prueba es una fila —número, rótulo,
// cifra, cuerpo— separada por una regla de borde a borde.
//
// Es la más legible de las tres y la que menos pide: se lee de arriba abajo sin
// que el lector tenga que decidir por dónde entrar, y es la única en la que las
// seis cifras están alineadas entre sí, así que se COMPARAN. Las otras dos
// obligan a recorrer; esta deja leer.
//
// El precio, dicho de frente: se parece a una tabla porque es una tabla. Si lo
// que esta sección tiene que hacer es impresionar, la B y la D pegan más fuerte.
//
// ── Por qué la cifra va en `h2` y no en `h1` ────────────────────────────────
//
// Seis filas tienen que entrar en una pantalla. Con la cifra a escala de h1
// (hasta 88px) cada fila mide ~180px y las seis se comen 1080px sin contar el
// encabezado — o sea que en cualquier portátil la última fila queda fuera y hay
// que scrollear para ver la sexta prueba, que es exactamente lo que esta
// sección viene a evitar. A escala de h2 la fila mide ~130px y las seis caben.
//
// ── El ancho de la columna del rótulo está medido, no elegido ──────────────
//
// 13rem, porque "Built to connect" y "Built to privacy" son los dos rótulos más
// largos y a 11rem partían en dos líneas — y una fila con el rótulo en dos
// líneas y todo lo demás en una descoloca la línea de base de esa fila, que es
// justo lo que esta versión aporta: seis cifras alineadas entre sí.
//
// ── Cero recorrido, entrada al aparecer ─────────────────────────────────────
//
// `once: true` y nada colgado del scroll: la sección entra una vez y se queda.
// Un footer o una sección de datos que se re-anima cada vez que el lector sube
// dos líneas y vuelve a bajar es ruido.

export default function ProofIndex() {
  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk }) => {
    // Sin animación con reduced-motion: el contenido ya está completo en el
    // markup y los `from()` son lo único que lo mueve. No hacer nada ES la
    // degradación correcta.
    if (!motionOk) return;

    const rows = q("[data-row]");
    const rules = q("[data-rule]");
    if (rows.length === 0) return;

    const tl = gsap.timeline({
      defaults: { ease: EASE_OUT },
      scrollTrigger: { trigger: scope, start: "top 75%", once: true, markers: DEBUG_MARKERS },
    });

    // Las reglas primero y las filas detrás, escalonadas de arriba abajo: la
    // pauta se dibuja y después se llena, como un documento que se compone. Al
    // revés, el texto aparecería flotando sin estructura.
    tl.from(rules, { scaleX: 0, duration: 0.75, stagger: 0.07 }, 0);
    tl.from(rows, { autoAlpha: 0, x: -22, duration: 0.7, stagger: 0.07 }, 0.12);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([...rows, ...rules], { clearProps: "all" });
    };
  });

  return (
    <section
      ref={rootRef}
      className="flex min-h-svh flex-col justify-center bg-background py-20 text-ink"
    >
      <Container className="flex flex-col gap-8">
        <Eyebrow className="text-gray-intermediate">Built to</Eyebrow>

        <div className="flex flex-col">
          {PROOF_STATS.map((stat, i) => (
            <div key={stat.id} className="contents">
              {/* La regla es un nodo propio y no un `border-t` de la fila: se
                  anima escalando desde la izquierda, y un borde no se puede
                  escalar sin escalar su caja. La primera y la última son de
                  tinta; las intermedias, de regla — así el bloque tiene cierre. */}
              <span
                data-rule
                aria-hidden="true"
                className={`block origin-left border-t ${i === 0 ? "border-ink" : "border-rule"}`}
              />

              <article
                data-row
                // En móvil la fila se apila (rótulo, cifra, cuerpo); en desktop
                // son cuatro columnas alineadas por la línea de base, que es lo
                // que permite comparar las seis cifras entre sí.
                className="flex flex-col gap-3 py-6 lg:grid lg:grid-cols-[3.5rem_13rem_minmax(0,1fr)_26rem] lg:items-baseline lg:gap-x-8 lg:py-7"
              >
                <p className="text-caption-mono text-green-ink">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-h4 text-gray-intermediate">{stat.eyebrow}</p>
                <p className="text-h2-serif italic">
                  {stat.value}
                  <span className="text-green-ink">{stat.accent}</span>
                </p>
                <p className="text-body-sm text-gray-intermediate text-pretty">{stat.body}</p>
              </article>
            </div>
          ))}

          <span
            data-rule
            aria-hidden="true"
            className="block origin-left border-t border-ink"
          />
        </div>
      </Container>
    </section>
  );
}
