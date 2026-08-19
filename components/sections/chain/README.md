# `chain` — sections for `/chain-abstraction`

The general contract in [`../README.md`](../README.md) applies. This file only
documents what is specific to this page.

> **Language note.** Comments in this folder are in **English**, matching
> [`../quantum`](../quantum/README.md). The rest of the repo is still in
> Spanish; see that folder's note.

**The words are not owned here.** They come from the copy deck for the page and
live in `chainContent.ts`. Change copy there first. The headlines are still in
the JSX, for the reason the parent README gives: they carry `<Accent>` and
`<br />`, and moving them into data means choosing a schema for "text with an
accented run", which is a content-model decision rather than a refactor.

Two liberties were taken with the deck, both noted in the code where they land:

- The deck offers **two heroes**. The build uses the second ("The chain
  disappears. You don't."), because it is the one the hero's animation can
  perform; the first is a positioning line, not a picture.
- The forward turn's **last sentence was pulled out of its paragraph** and set
  as a coda (`FORWARD_CODA`). The words and their order are the deck's; buried
  at the end of a paragraph, the page's closing thought read as one more clause.
- The growth trajectory was a **sentence** (`$5B → $10B → $20B`) and is now a
  drawn line with those numbers as its labels. Nothing was cut — `GROWTH` in
  `chainContent.ts` carries the plotted value and the displayed string together,
  so the chart cannot drift from its own caption.

## The page's one idea, and where it repeats

Thirty-five chains become one account, and one account reaches thirty-five
chains. That is the whole argument, and it is drawn twice on purpose:

| | Section | Direction |
|---|---|---|
| Opening | `ChainHero` | 35 tickers collapse into a single point as you scroll |
| Release | `ForwardTurn` | a handful drift up and dissolve — the only one that resolves to empty |
| Closing | `BuildersCta` | one contract mark fans back out to 35 |

They are the only repeated ornament on the page. If one is edited, look at the
others — the rhyme is the point, and half a rhyme is just a leftover. The middle
one is the section's sentence as a picture: "the chain stops being something you
manage", so the marks are not collapsed by force or fanned out, they simply let
go.

## The hero field is three layers, and that is not redundancy

`ChainHero`'s tickers carry three motions that overlap in time, so each gets its
own element — GSAP cannot hold two tweens of the same property on one node:

| element | owner | when |
|---|---|---|
| `[data-ticker]` | the scroll collapse | scrubbed |
| `[data-ticker-drift]` | idle wander + cursor gravity | every frame |
| `[data-ticker-mark]` | the entrance | once |

A reader who scrolls immediately is mid-assembly when the collapse starts, and
the field wanders throughout, so all three can be live in the same frame.

**The gravity is capped, and the cap is the design.** Unbounded attraction
clumps: tickers pile onto the cursor, which destroys the even distribution the
jittered grid exists to guarantee and — worse for this page — reads as the
chains being captured rather than as a field acknowledging you. Bounded at 16px
with a squared falloff over a 260px radius, the field leans and never gathers.
`PULL_DIR` is a single sign: flipping it to `-1` parts the field around the
cursor instead, which is worth trying, since "the complexity gets out of your
way" is arguably the page's actual thesis.

Four things in the loop are load-bearing:

- **Force is measured from each ticker's RESTING centre, never its live one.**
  Live positions feed back — pulled closer, a ticker reads a shorter distance,
  so it pulls harder, so it moves closer — and the field collapses onto the
  cursor within a few frames. Against the static resting grid the motion is
  bounded by construction rather than by luck.
- **The field's box is cached** and refreshed on ScrollTrigger's `refresh`.
  A `getBoundingClientRect` inside the ticker is a forced layout sixty times a
  second for a value that only changes on resize.
- **`hasPointer` gates the gravity on a proven pointer.** `subscribePointer`
  seeds late subscribers with a last-known value defaulting to dead centre, and
  applying gravity to that default parks the whole field in a permanent lean
  toward the middle of the screen on any device that never fires `pointermove`
  — i.e. every phone. On touch, the field only ever wanders.
- **The follow constant is in seconds, not a per-frame fraction**, so the feel
  does not double on a 120Hz display. Same reasoning as `POINTER_TAU` in
  `glyphShine`.

It runs on `gsap.ticker` (never a private rAF — the toolkit's rule) and
`onViewportToggle` freezes it once the hero leaves the frame; verified as 0 of 8
sampled tickers moving off screen and 8 of 8 on.

`ChainHero` uses `gsap.matchMedia` with `MQ.motion` directly rather than
`useMotionScope`, for the same reason `ForwardTurn` does: it never asked about
the desktop breakpoint, and declaring `isDesktop` would tear down and rebuild the
ticker loop, the pointer subscription and the entrance on every crossing of
1024px. With reduced motion none of it is created at all, so the shared
`pointermove` listener never attaches on this page.

## `ForwardTurn` is the page's exhale, and it is built out of inversions

Everything above it is the page ARGUING: diagrams that assemble, hairlines, mono
labels, figures scrubbed to the wheel, a dark technical stack. `ForwardTurn` is
where the page stops arguing — the copy turns from what the system does to what
it means for a person — and originally nothing in the page's behaviour turned
with it. Same ground, same scale, same wheel-driven motion, so the emotional
beat arrived dressed as one more spec.

It is now its own section on its own ground, and every register is deliberately
inverted:

| the rest of the page | `ForwardTurn` |
|---|---|
| cream ground | white, with light growing into it |
| diagrams, rules, mono labels | none of the three |
| motion scrubbed to the wheel | **self-paced: plays once, on its own clock** |
| `h1`/`h2` at a reading measure | `text-statement` |
| marks assemble and accumulate | the marks let go and nothing replaces them |
| flat ink type | light passes THROUGH the words (`glyphShine`) |

**The self-paced motion is the load-bearing one.** Every other reveal on this
page is tied to the reader's wheel — they turn it, the page responds. Here the
reader stops steering and the section breathes on its own. Re-attaching it to a
scrub makes it one more section doing what it is told, and the section stops
being the thing it exists to be.

Three smaller things that are easy to undo:

- The heading's shine is `createGlyphShine`, whose `setFront` is documented for
  exactly this — a light front advancing in READING order, so a wrapping heading
  lights letter by letter instead of lighting both lines in parallel. It returns
  `null` without usable WebGL2, and that is a supported outcome: the DOM reveal
  is plain and runs either way. Keep the tint near white and the intensity low —
  saturated, the swept glyphs read as green TEXT rather than as ink with light
  crossing it, which is the entire distinction.
- `autoSplit` re-splits the heading on a width change and throws away the char
  elements the shine masks. `onSplit` hands it the new ones via `setChars`
  rather than rebuilding the WebGL context.
- The cream-to-white seam is dissolved by a gradient that fades cream to
  TRANSPARENT. To white it is an opaque band, and an opaque band over the bloom
  clips the bloom along its own bottom edge — trading the seam at the section
  boundary for a worse one in open space.

It uses `gsap.matchMedia` with `MQ.motion` directly rather than
`useMotionScope`, because it does not care about the desktop breakpoint and
declaring `isDesktop` would rebuild the scene when the window crosses 1024px —
which, for a `once: true` reveal, means replaying it in the reader's face. The
parent README calls this out.

## `CapabilityStack` is the section to be careful with

It is the sticky scene, and it holds three decisions that are easy to undo by
accident:

1. **The figure accumulates; it never resets between beats.** The copy says the
   four capabilities "share one foundation" and that each layer makes the others
   more useful. A diagram that wiped per beat would contradict that on screen
   while the type asserted it. By beat four every spoke drawn in beat one is
   still there, and authority finally travels down all of them at once.
2. **The JSX renders the FINAL state and the scene winds it back.** Never
   pre-hide any of it in CSS. Without JS, on a phone, or with reduced motion,
   the reader gets the completed diagram plus four stacked text blocks — which
   is the whole section, just not animated. This is the same rule
   `useScrollReveal` documents.
3. **Both columns are placed explicitly into row 1 at `lg`.** The figure carries
   `col-start-7`, which leaves grid auto-placement past column 12, so without
   `lg:row-start-1` on the text column the two stack instead of sitting side by
   side.

Sticky is CSS, never `pin: true`, and `data-stack` is written only by
`enableScene` — both for the reasons in the parent README.

## `ProofBand`: a uniform row, and deliberately no counter

Four figures, one row, one size, one even stagger. It was briefly tiered —
`$20B+` leading, `25M+`/`35+` supporting, `<$0.01` set apart after a beat — to
land the fee as a punchline. That worked and was still the wrong call: the
section's job is "one glance = this is real and used at scale", and four equal
figures deliver the whole claim in a single sweep where a staged version makes
the reader assemble it in three moves. Uniformity IS the argument — four facts of
equal standing, not a story with a punchline.

The evenness is load-bearing in both dimensions. Same size (the whole row steps
down to `text-h1-serif` together, because `<$0.01` at display scale overruns a
quarter-width column, and one cell at a different size is what this layout
exists to avoid) and even timing (the tiered version paused before the fee; in a
row of four equal figures that gap reads as a stutter, not as emphasis).

**A count-up was considered and rejected on a concrete ground.** `<$0.01` cannot
count — tallying up to a LESS-THAN threshold is meaningless, so a counter covers
three figures and has to special-case the fourth, which breaks exactly the
uniformity the row is built on. Beyond that: a counter withholds the number and
makes the reader wait, against the "one glance" goal; the time story is already
told directly below by the growth line with real dated points; and a tally is the
genre default for crypto stats, which is what this page was built to avoid.

Also rejected: a `$20B+` that ticks upward as you read. It would feel alive, but
animated upward movement implies real-time telemetry, and it would be wired to
nothing. That is fabricated liveness on a figure presented as fact.

What the figures do instead is arrive in the page's own vocabulary — the hairline
wipes and the number rises out of the space beneath it, the same line-mask
mechanism as the hero and `ForwardTurn` headings.

The growth chart has its **own** ScrollTrigger rather than sharing the section's:
it sits well below the fold when the figures animate, so on one shared trigger it
played out of sight and the reader arrived at a finished line.

## `pathLength={PATH_LEN}` is 100, and that is load-bearing

Every drawn stroke on this page — spokes, solver curves, the pulse, the glyph
ring, the growth line, the convergence, the fan — animates `stroke-dashoffset`.

**GSAP's CSSPlugin rounds pixel-unit values to whole numbers by default**
(`autoRound`), and `stroke-dashoffset` is a pixel property. Normalised to
`pathLength="1"`, every one of those draws SNAPPED: the offset rounded to 1
until it crossed 0.5 and then to 0, so a stroke was either undrawn or fully
drawn with nothing in between. It reads as a stagger of instant appearances,
which is exactly what it was, and nothing errors.

Normalising to **100** puts the whole animation on integers, so the rounding has
nothing left to destroy. `autoRound: false` per tween would also work, but it
has to be remembered on every tween that ever touches a dash, and forgetting it
fails silently in this same way.

## The geometry is rounded because `Math.sin` is not portable

`chainDiagram.ts` rounds every trig-derived coordinate to four decimals before
it reaches the DOM. `Math.sin`/`Math.cos` are explicitly **not** required by the
ECMAScript spec to be correctly rounded, so Node and the browser disagree in the
last ulp: the server rendered `cy="495.7217412552831"` while the client computed
`495.72174125528306`, and React failed to hydrate the whole client tree over it.

Four decimals is far below a pixel at any size the figure is drawn, and is
identical on both sides whatever libm is underneath. The hero's ticker field is
NOT rounded for this reason — its seeded generator is plain IEEE-754 arithmetic
and is bit-identical everywhere — only to keep the emitted markup readable.

## Why the page lives under `app/(motion)`

`app/(site)/layout.tsx` mounts `LenisProvider`, which deliberately omits
`ScrollTrigger.refresh()`. Four things here measure against the viewport — the
hero's collapse, the sticky track, the growth line and the convergence — and
without the coordinated refresh that `PrototypeMotionProvider` performs they
stay pinned to the first paint's height, i.e. before the font swap resizes every
heading. The route's own `layout.tsx` mounts that provider.

## Reused rather than copied

`BuildersCta` imports `CtaPill` from [`../quantum`](../quantum/README.md). The
parent contract allows `@/components/sections/*`, the whole hover mechanism
already lives in `[data-q-cta]` in `app/globals.css`, and a second copy here
would be a second thing to keep in step with that rule.
