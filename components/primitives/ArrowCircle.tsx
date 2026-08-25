// The green disc whose arrow hands off: hovering the ancestor marked
// `data-q-arrow-host` sends the visible arrow out to the right while a second
// one enters from the left. Both are the same glyph — the effect is continuity,
// not an icon swap.
//
// The trigger is a data-attribute on the ANCESTOR rather than the disc's own
// :hover because the gesture belongs to the whole row or link, not to the
// circle: moving the mouse over the words "Read the coverage" has to move it
// too.
//
// The rule lives in `[data-q-arrow]` in app/globals.css. Server component.

function Arrow({ slot }: { slot: "in" | "out" }) {
  return (
    <svg
      {...(slot === "in" ? { "data-q-arrow-in": "" } : { "data-q-arrow-out": "" })}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function ArrowCircle({ className = "" }: { className?: string }) {
  return (
    // overflow-hidden IS wanted here: it is what crops the arrows against the
    // edge of the disc as they cross it.
    <span
      data-q-arrow
      aria-hidden="true"
      className={`relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-near-green-accent text-black ${className}`}
    >
      <Arrow slot="out" />
      <Arrow slot="in" />
    </span>
  );
}
