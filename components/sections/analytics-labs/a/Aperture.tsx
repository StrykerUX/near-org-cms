// An aperture of concentric hairline rings, in A's vocabulary: 1px stroke, no
// fill, the same language as the tick axis in `a/Hero`. It illustrates nothing
// literal — its job is to give a featured panel weight without a stock photo.
//
// PLACEHOLDER: if brand art ever arrives, it replaces this file and nothing
// else has to move.
//
// It lives in its own file rather than inside `a/Products` because the mix page
// mounts it inside C's products section. Two copies of a figure diverge without
// anyone noticing, which is the same reason the parent README gives for never
// forking a section.
//
// Server component. Colour comes from `currentColor`, so the caller sets it —
// A puts it at `text-white/35` on `--ink-slate`, and the mix at the same value
// on `--ink`.

const RINGS = [26, 42, 58, 74, 90];

export default function Aperture({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`w-full ${className}`} aria-hidden="true">
      {RINGS.map((r, i) => (
        <circle
          key={r}
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          // The open arc grows with the radius: the outer rings are cut back
          // further than the inner ones, so the figure opens toward the edge
          // instead of reading as a closed target.
          strokeDasharray={`${2 * Math.PI * r * (0.62 - i * 0.09)} ${2 * Math.PI * r}`}
          transform={`rotate(${-38 - i * 14} 100 100)`}
          opacity={0.85 - i * 0.11}
        />
      ))}
      <circle cx="100" cy="100" r="6" className="fill-near-green-accent" />
    </svg>
  );
}
