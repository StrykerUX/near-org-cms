import type { Delta as DeltaData } from "@/components/sections/analytics-labs/analyticsContent";

// ── Proposal A · the change chip ───────────────────────────────────────────
// Colour is NOT what carries the data: the glyph does (▲ ▼ –), and so does the
// sign. Colour only reinforces.
//
// This is not box-ticking accessibility, it is the same rule that governs the
// whole proposal. Eight percent of men cannot tell red from green, and a chip
// reading "+2.4%" in green next to one reading "-6.1%" in red, with nothing
// else to separate them, is two identical chips with different numbers on that
// screen. With the triangle the data survives the colour; with colour alone it
// does not.
//
// The background is transparent rather than a tinted pill, which is the genre
// default: in a row of five figures, five coloured pills outweigh the figures
// they qualify and invert the section's hierarchy.

const TONE = {
  up: "text-green-ink",
  down: "text-destructive",
  flat: "text-gray-intermediate",
} as const;

const GLYPH = { up: "▲", down: "▼", flat: "–" } as const;
const SIGN = { up: "+", down: "−", flat: "" } as const;

export default function Delta({ delta }: { delta: DeltaData }) {
  const { window: win, direction, value } = delta;
  return (
    <span className="inline-flex items-baseline gap-1.5 text-caption-mono">
      <span className="text-gray-intermediate">{win}</span>
      <span className={TONE[direction]} aria-hidden="true">
        {GLYPH[direction]}
      </span>
      <span className={TONE[direction]}>
        {SIGN[direction]}
        {value}
      </span>
    </span>
  );
}
