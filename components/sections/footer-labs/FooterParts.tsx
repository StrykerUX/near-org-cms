import Image from "next/image";
import Accent from "@/components/primitives/Accent";
import {
  COPYRIGHT,
  GROUPS,
  HEADLINE,
  WORDMARK,
  type FooterGroup,
} from "./footerLabContent";
import { DEFAULT_EFFECTS, HoverLinkRow, type HoverEffect } from "./hoverEffects";

// Las piezas que las seis versiones comparten: columnas de links, headline,
// wordmark y línea legal.
//
// Lo que se comparte es el MATERIAL, no la composición. El lab decidió que la
// info fuera la misma en las seis y el layout libre, así que cada pieza acepta
// las pocas variantes que hacen falta (paleta, ancho de grid) y nada más — una
// versión que quiera acordeón o una sola columna escribe su propio layout con
// `GROUPS` directo, en vez de sumarle un booleano a esto.
//
// Server components a propósito: ninguna anima por su cuenta. La animación la
// pone la versión que las monta, desde su propio scope de GSAP.

// ── El layout de links, uno solo ───────────────────────────────────────────
//
// El lab probó seis repartos distintos (una variante por footer) y ganó éste,
// que es el que montaba `Sheet`. Los otros cinco se borraron: mantener cinco
// layouts vivos para que ninguno se use es deuda, no opciones.
//
// El problema que resuelve: `Resources` y `About` no son listas planas como
// `Products` — tienen sub-secciones (Build / Learn / Connect, Fundamentals /
// Ecosystem), y apiladas cada una cuesta su label MÁS sus links. Con el layout
// de producción, `Resources` mide doce renglones contra los cuatro de
// `Products`, así que el alto de todo el bloque lo fija la columna más
// desbalanceada — y ese alto es la causa de que el footer no entre en pantallas
// bajas.
//
// Acá el sub-label va en su propia columna a la izquierda y sus links corren en
// línea a la derecha: **un renglón por sub-sección**. `Resources` baja de doce
// renglones a cuatro, y los labels forman una vertical que se lee como índice.
//
// Dos columnas de grupos, no cinco: las líneas de links son largas, y con cinco
// tracks angostos "Chain Abstraction" y "NEAR Foundation" se parten en dos
// renglones — que es volver a gastar el alto que se venía de ahorrar.

/** Los grupos que tienen más de una sub-sección — los únicos que el problema afecta. */
const isWide = (group: FooterGroup) => group.sections.length > 1;

function SubLabel({ children, dark }: { children: string; dark: boolean }) {
  return (
    <span className={`text-caption uppercase ${dark ? "text-cream/50" : "text-gray-intermediate"}`}>
      {children}
    </span>
  );
}

function GroupBody({
  group,
  dark,
  effect,
}: {
  group: FooterGroup;
  dark: boolean;
  effect: HoverEffect;
}) {
  return (
    <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[6rem_1fr]">
      {group.sections.map((section, i) => (
        <div key={section.label || i} className="contents">
          {/* Un grupo SIN sub-label no deja la columna del label vacía: sus
              links se llevan los dos tracks y arrancan alineados con el título
              del grupo. Con el hueco, `Products` y `Stack` quedaban indentados
              respecto de su propio encabezado sin ninguna razón visible — la
              columna de labels solo tiene sentido donde hay labels que
              alinear. */}
          {section.label ? (
            <span className="pt-0.5">
              <SubLabel dark={dark}>{section.label}</SubLabel>
            </span>
          ) : null}
          <HoverLinkRow
            links={section.links}
            dark={dark}
            effect={effect}
            className={section.label ? "" : "sm:col-span-2"}
          />
        </div>
      ))}
    </div>
  );
}

export function FooterLinks({
  dark = false,
  itemAttr,
  effects = DEFAULT_EFFECTS,
}: {
  dark?: boolean;
  /** `data-*` que la versión que anima usa para seleccionar cada columna. */
  itemAttr?: string;
  /** Efecto de hover por grupo, en el orden de `GROUPS`. Ver `hoverEffects.tsx`. */
  effects?: HoverEffect[];
}) {
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 lg:gap-x-16">
      {GROUPS.map((group, i) => (
        <nav
          key={group.title}
          aria-label={group.title}
          // Los grupos con sub-secciones son más altos: en un grid de dos
          // columnas eso los ordena solo si van intercalados con los planos,
          // que es el orden en que `GROUPS` ya los tiene.
          className={isWide(group) ? "" : undefined}
          {...(itemAttr ? { [itemAttr]: "" } : {})}
        >
          <h2 className={`text-label ${dark ? "text-cream" : ""}`}>{group.title}</h2>
          <GroupBody group={group} dark={dark} effect={effects[i % effects.length]} />
        </nav>
      ))}
    </div>
  );
}

export function FooterHeadline({
  dark = false,
  className = "text-h2",
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <p className={`${className} text-pretty ${dark ? "text-cream" : ""}`}>
      {HEADLINE.lead}
      <br />
      <Accent>{HEADLINE.accent}</Accent>
    </p>
  );
}

/**
 * El mismo titular, pero con cada línea en su propia máscara y marcada con
 * `data-line`, para animarlas escalonadas.
 *
 * Es la alternativa a `SplitText.create(el, { mask: "lines" })` cuando el
 * quiebre de línea NO es del navegador sino nuestro: acá las dos líneas son un
 * dato (`HEADLINE.lead` y `HEADLINE.accent`), así que partirlas en runtime
 * significaría medir texto para reconstruir algo que ya sabíamos. Y traería el
 * problema que SplitText tiene que resolver con `autoSplit`: un split hecho
 * antes del swap de la fuente mide las máscaras contra el fallback y corta las
 * líneas por la mitad.
 *
 * `pb-[0.2em] mb-[-0.2em]` es el mismo truco que `allowDescenders` aplica sobre
 * los wrappers de SplitText: la caja de recorte es exactamente el alto de línea
 * y con el interlineado de los tokens display la cola de la "y" de "money" cae
 * fuera y se cercena. Crecer la máscara hacia abajo y devolver el mismo valor
 * como margen negativo agranda el clip sin mover el layout.
 */
export function FooterHeadlineLines({
  dark = false,
  className = "text-h1",
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <p className={`${className} ${dark ? "text-cream" : ""}`}>
      {[HEADLINE.lead, HEADLINE.accent].map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.2em] mb-[-0.2em]">
          <span data-line className="block">
            {i === 0 ? line : <Accent>{line}</Accent>}
          </span>
        </span>
      ))}
    </p>
  );
}

export function FooterWordmark({
  invert = false,
  alt = "NEAR",
  className = "",
  style,
}: {
  invert?: boolean;
  alt?: string;
  className?: string;
  /** Para topes de ancho o alto que dependen de la versión que lo monta. */
  style?: React.CSSProperties;
}) {
  return (
    <div className={`overflow-hidden ${className}`} style={style}>
      <Image
        src={WORDMARK.src}
        alt={alt}
        width={WORDMARK.width}
        height={WORDMARK.height}
        unoptimized
        priority={false}
        className={`block h-auto w-full ${invert ? "invert" : ""}`}
        style={{ marginBottom: `-${WORDMARK.cropPct}%` }}
      />
    </div>
  );
}

/**
 * El pie: solo el copyright, alineado a la derecha.
 *
 * Los links legales ya no viven acá — son el grupo `Terms and Policies` de
 * `GROUPS`, con el mismo tratamiento que Products o Stack. Lo que queda es la
 * única línea del footer que no es un destino, y por eso puede irse al borde.
 */
export function FooterLegal({ tone = "light" }: { tone?: "light" | "dark" | "blend" }) {
  // `blend` es para las versiones que lo montan sobre `mix-blend-difference` y
  // no saben si abajo hay cream o negro: con source gris el filtro cae oscuro
  // sobre claro y claro sobre oscuro, así que un solo color resuelve los dos
  // estados sin animar el texto junto con el fondo.
  const TONE = {
    light: "text-gray-intermediate",
    dark: "text-cream/50",
    blend: "text-neutral-400",
  } as const;

  return (
    <p className={`text-body-sm text-right ${TONE[tone]}`}>{COPYRIGHT}</p>
  );
}
