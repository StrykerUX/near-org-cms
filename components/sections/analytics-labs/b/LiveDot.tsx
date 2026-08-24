// ── Proposal B · the status dot ────────────────────────────────────────────
// The ONLY thing that moves in the whole proposal, and the exception is
// reasoned.
//
// The repo has a written rule (see `chain/ProofBand`) against fabricated
// liveness: nothing is animated to imply telemetry that does not exist. A
// count-up over a static figure breaks it; this dot does not, and the
// difference is not one of degree:
//
//   · A counter animates the DATUM — it says "this number is changing right
//     now", which is false while the source is a snapshot.
//   · The dot animates the STATE — it says "something is watching", which is
//     what monitoring means by definition and what the status-page convention
//     has signified for twenty years. It does not promise the number moves; it
//     promises that if it breaks, somebody finds out.
//
// The halo is Tailwind's `animate-ping`, i.e. CSS: it does not touch
// `globals.css` (a file shared across worktrees) and `prefers-reduced-motion`
// switches it off on its own through the `motion-reduce` variant, leaving the
// solid dot — which still says the same thing, only without the pulse.
export default function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`relative flex size-2.5 ${className}`}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-ink opacity-60 motion-reduce:hidden" />
      <span className="relative inline-flex size-2.5 rounded-full bg-green-ink" />
    </span>
  );
}
