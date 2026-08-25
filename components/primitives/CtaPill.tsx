import type { ReactNode } from "react";

// The sweeping CTA used across the quantum page: on hover a lime-to-green
// gradient enters from the left and the label turns black at the same rate. The
// whole mechanism lives in `[data-q-cta]` in app/globals.css — this component
// only assembles the DOM that rule expects.
//
// Server component on purpose: it is pure :hover, no JS. That is also why the
// label is a `string` and not a `ReactNode` — it has to be rendered TWICE (base
// layer plus clipped black layer), and duplicating an arbitrary React tree
// would duplicate its keys and ids too.
//
// A separate file rather than a variant of `@/components/primitives/Button`:
// Button is a solid single-colour button, this is an outlined pill with two
// animated background layers and two text layers. Sharing the file would leave
// two different components behind a three-value enum.

const SIZE = {
  // A section's primary CTA.
  lg: "px-7 py-3 text-label-lg",
  // The one that sits inside a card or a row.
  sm: "px-6 py-2.5 text-label",
} as const;

const TONE = {
  // On cream or white: black outline, and the fill passes through a black-plate
  // stage before revealing the gradient.
  light: "border-foreground",
  // On the dark section: white outline and label, no black stage.
  dark: "border-white",
  // Like `light` but with the outline dialled down — for the secondary CTA of a
  // pair, where two full-weight outlines compete with each other.
  quiet: "border-foreground/35 text-ink-soft",
  // Solid black with white type, filling with the gradient on hover. The
  // default for CTAs on the cream and white sections: an outlined pill there
  // reads as an empty shape rather than a button.
  filled: "border-transparent",
  // Solid white with black type, filling with the gradient on hover. For a dark
  // ground where an outlined pill would recede. Colours come from the
  // `[data-q-cta-fill-white]` rule in globals.css, not from here — the resting
  // fill and the hover fill have to be declared together to animate.
  solid: "border-transparent",
} as const;

export type CtaPillProps = {
  children: string;
  href: string;
  size?: keyof typeof SIZE;
  tone?: keyof typeof TONE;
  /** External links: open in a new tab and carry the security rel. */
  external?: boolean;
  icon?: ReactNode;
  className?: string;
};

export default function CtaPill({
  children,
  href,
  size = "lg",
  tone = "light",
  external = false,
  icon,
  className = "",
}: CtaPillProps) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      data-q-cta
      {...(tone === "dark" ? { "data-q-cta-on-dark": "" } : {})}
      {...(tone === "solid" ? { "data-q-cta-fill-white": "" } : {})}
      {...(tone === "filled" ? { "data-q-cta-filled": "" } : {})}
      // No overflow-hidden: it would clip the fill at the padding box and leave
      // the border's 1px ring showing (see the long comment in globals.css).
      className={`relative inline-flex w-fit items-center justify-center gap-2 rounded-full border text-center ${SIZE[size]} ${TONE[tone]} ${className}`}
    >
      {icon}
      <span className="relative">
        {children}
        {/* The black layer that clip-path reveals. aria-hidden because it is the
            SAME text: without it a screen reader announces the label twice. */}
        <span data-q-cta-top aria-hidden="true">
          {children}
        </span>
      </span>
    </a>
  );
}
