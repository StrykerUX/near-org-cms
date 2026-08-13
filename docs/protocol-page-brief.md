# Protocol page — design brief

Source copy: **"near.org - sitemap"** Google Doc → **Protocol** tab
(`near.org/protocol`). Route: `/prototype/protocol`.

This brief exists because the first attempt failed in an instructive way, and
the failure is worth not repeating.

---

## What went wrong the first time

The hero was built by *measuring the quantum hero and matching numbers* — h1
top at 128px, body column at 608px, same type tokens. Every number matched and
the two pages still looked nothing alike, because the differences were
structural, not metric:

| | Quantum hero | First Protocol hero |
|---|---|---|
| Height | `min-h-svh`, headline optically centred | Top-loaded against the nav |
| Headline | Animated gradient sheen through the first clause | Flat black |
| Background | Canvas lattice field, mouse-reactive | Bare cream |
| Body | Narrow ~6-line column, real vertical rhythm | 2 lines floating |
| Proof strip | Marquee, quiet, supporting | `text-h3` six-up, louder than the hero |

**The lesson: matching measurements is not matching design.** Study the whole
page's structure, motion vocabulary and pacing before building a single
section of a sibling page.

---

## Direction (decided with Lawrence)

1. **Signature idea: shards — splitting and reforming.** A field of cells that
   split, multiply and redistribute on scroll. Literal to the content (10
   shards + a private shard, dynamic resharding) and it gives sections 4–9 a
   shared evolving visual instead of six unrelated blocks. This is Protocol's
   equivalent of quantum's ring field + rotating band.
2. **A dark scroll-locked act** carrying the three featured blocks —
   Nightshade 3.0, Private Shard, Chain Signatures — with the shard field
   evolving between beats. Same role `ThreatSequence` plays on quantum.
3. **Generated assets: hero motion + section stills.** One hero loop plus
   isometric stills for the featured sections, art-directed to match the
   existing `iso-*` renders (black ground, hairline wireframe, one lit
   element in the CTA greens).
4. **Design-led structure.** The doc is the content inventory, not the running
   order. Reorder where the page reads better — and record every change and
   its reason.

---

## What to study before building

- **The whole quantum page**, not a section of it. Specifically its *pacing*:
  full-viewport hero → quiet marquee → statement wipe → dark locked act →
  statement → light proof sections → dark break → cards → table → timeline →
  cards → FAQ → closing ring. Light and dark alternate; loud and quiet
  alternate. Nothing loud follows anything loud.
- `components/sections/quantum/README.md` and the section files themselves.
- `/prototype/homepage-v2` — `NearStack`, `HeroVideo`, `ProofStepper`.
- **sui.io and the Sui rebrand** — named by Lawrence as a reference for
  modern, bespoke, non-generic work.

## Motion vocabulary already built and reusable

Read these before inventing anything; most of the hard problems are solved.

- `primitives/motion/useGsapContext` — StrictMode-safe `gsap.context()`
- `primitives/motion/maskedLines.allowDescenders` — SplitText line masks shear
  descenders at display line-heights
- `primitives/motion/videoScrub` — damped scrub with frame quantisation
- `quantum/wordField.ts` — measured character grid, resize-safe
- `quantum/quantumLattice.ts` — the hero's canvas field
- `[data-q-sheen]` in globals.css — the animated headline gradient
- **Sticky tracks, never `pin: true`** — pin-spacer fights Lenis + StrictMode

## Traps this codebase has already sprung

- The nav is `fixed`; the first section on a page must clear it itself.
- `Container` forwards `className` only — no event handlers, no other props.
- Layout classes on `Container` are unreliable; put spacing on the section.
- A `transform` or `will-change: transform` on an ancestor makes it a backdrop
  root and silently kills every `backdrop-filter` inside.
- `grid-cols-2` (`1fr 1fr`) collapses inside a shrink-to-fit absolute box.
- Typography gate: no `text-[Npx]`, `leading-*`, `tracking-*`, `font-<weight>`.
  Add a token instead, or `/* ds-exempt: reason */` on the same or previous line.

---

## Section plan

Doc order, with the featured/compact split. **The split is an editorial call
not present in the doc** — re-check it before building. Quantum-safe accounts
sitting in the compact row is the most questionable, given it has an entire
sibling page.

| # | Doc section | Treatment |
|---|---|---|
| 1 | Hero | Full-viewport, shard field, animated sheen on "agent economy" |
| 2 | Proof strip | Quiet 6-up. Supporting, not louder than the hero |
| 3 | Built for AI scale | Three points — `LiveToday`'s shape |
| 4 | Nightshade 3.0 | **Featured** — dark act, beat 1 |
| 7 | Private Shard | **Featured** — dark act, beat 2 |
| 9 | Chain Signatures | **Featured** — dark act, beat 3 |
| 5 | Dynamic resharding | Compact |
| 6 | Speed. Scale. Access. | Compact |
| 8 | Quantum-safe accounts | Compact — links to the quantum page |
| 10 | A blockchain for developers | Code sample, **real syntax highlighting** (Shiki) |
| 11 | A new operating layer for AI | — |
| 12 | NEAR One | — |
| 13 | Secure it, evolve it | Two points |
| 14 | Content gallery | `InTheNews`' shape, 5 links |
| 15 | Closing CTA | `ClosingRing`'s shape — **copy is truncated in the export, re-read it** |

## Open questions

- Section 15's closing CTA is cut off at *"The settlement layer for the agent"*.
- Is the hero's `Start building → docs.near.org` the only CTA above the fold?
- Does the compact row need its own visual, or is it deliberately plain to let
  the featured blocks carry the weight?

## Done means

Full design audit at the end: pacing (no two loud sections adjacent), contrast
(the `--gray-blue` 2.81:1 trap — use `--gray-intermediate`), motion under
`prefers-reduced-motion`, mobile at 390, and every measurement verified in the
browser rather than assumed.

---

## Handoff — start here

The page is built end to end and committed. **It has never been looked at by
the person who built it**, which is the single most important thing to know.

### 1. Fix the capture path first

Worth doing before any design work. The screenshot harness in the job tmp dir
broke on this page: Lenis transforms the scroll container, so
`Page.captureScreenshot` with document-coordinate clips no longer maps to what
is on screen — every slice came back blank. Until this works, design decisions
here are being made from measurements alone, and that is precisely how the
first hero ended up metrically correct and visually wrong.

Options: capture the viewport without a clip after driving Lenis' own scroll
API rather than `window.scrollTo`; or screenshot element-by-element via
`element.scrollIntoView()` plus an unclipped shot.

### 2. Then the two things still outstanding

- **Higgsfield assets** — a hero loop and isometric section stills, art-directed
  to match the existing `iso-*` renders (black ground, hairline wireframe, one
  lit element in the CTA greens).
- **The design audit** — pacing, contrast, motion under reduced motion, mobile
  at 390, and every measurement re-verified in a browser.

### 3. What makes the design work better, from Lawrence's feedback

- Reference images beat reference names. sui.io and the Sui rebrand were cited
  and never actually seen — "modern and bespoke" then resolves to priors, which
  is what produces generic work.
- Offering two or three directions with rationale worked (the shard field came
  out of that). Build-and-hope did not.
- "Avoid boring" is not actionable; "this grid is generic, that idea is right"
  is. Ask for specifics on specific moments.

### 4. Known compromises in the current build

- The code sample in `DeveloperBlock` is hand-tokenised. Real syntax
  highlighting (Shiki) was asked for; it is a build-time dependency for one
  twelve-line block and deserves its own change. The markup is token-per-span,
  so it is a swap, not a rewrite.
- The featured/compact split is an editorial call not present in the doc.
  Quantum-safe accounts sitting in the compact row is the weakest part of it.
- Section 15's closing copy was truncated in the doc export; the current
  closing statement is written to match the hero rather than transcribed.

---

## Revision — the spine (2026-08-12)

Lawrence pointed at Sui's stack section: cards that open on scroll to reveal an
animated element, collapse as you leave, and hand off to the next one. Plus:
*"make them all equal and have a custom animation for each one."*

### What changed

`FeaturedAct` + `CompactRow` are **gone**, replaced by
`components/sections/protocol/ProtocolSpine.tsx`. The featured/compact split
was an editorial call with no authority behind it — this brief already flagged
it as the weakest part of the build — and the doc treats all six as peers.

Six cards alternate either side of a centre spine, closed by default (numbered
header, footer fact). Exactly one is open at a time: each card's SLOT is a
fixed-height grid row, consecutive slots tile the scroll, so the reading line
at 55% is always inside exactly one of them. That is what makes "one at a time"
true by construction rather than by tuning.

**Equal means equal**: the open body is a fixed 27rem with a reserved slot for
the outbound link whether or not that card has one. Nothing is sized by how
long its sentence ran.

### The diagrams

`spineDiagrams.tsx` — six SVGs, one per claim, on the page's isometric
language. Hand-drawn rather than generated because they have to *move*: a still
can show a shard, only a moving one can show it splitting at its threshold.

They **play once and hold** their resolved state. An earlier version looped;
whether you saw the story or the reset came down to when you happened to
scroll, and watching a shard un-split is worse than not animating at all.

### Generated art

One Higgsfield render, `public/prototype/protocol/shard-field.webp` (90KB), as
the section's opening backdrop. It is the same subject the diagrams draw — a
lattice of shards with a few lit — so it reads as the wide shot to their
close-ups. The section ground went to `--ink` for it: on `--ink-slate` a
near-black image reads as a hole punched in the page.

### The grid

`components/primitives/Grid.tsx` + `--grid-cols` / `--grid-gutter`. Twelve
columns; the spine is the 5 | 2 | 5 split. `?grid` on any URL overlays it.
Added because sections were each inventing their own arithmetic
(`calc((100vw/7)*0.4667)`), which means column edges never line up between them.

### Two bugs worth remembering

- **`gsap.matchMedia()` only runs its callback while a query matches.** With
  `{ motionOk: "(prefers-reduced-motion: no-preference)" }` alone, a reader who
  asked for reduced motion runs *none* of the effect — so the "disarmed" branch
  inside it never executes. The diagrams sat at their JSX start styles, several
  of which are `opacity: 0`. Always pair it with `MQ.reduce`.
- **`Page.captureScreenshot` with document-coordinate clips is dead.** That is
  what broke the old harness, not Lenis. The fix is
  `$CLAUDE_JOB_DIR/tmp/look.mjs`: scroll through `window.__lenis` (exposed in
  dev by `PrototypeMotionProvider`), then take a plain unclipped viewport shot.
  Every capture reports `wanted` vs `landed` so a silent miss is impossible.

### Still open

- `DeveloperBlock`'s code sample is still hand-tokenised (Shiki was asked for).
- Section 15's closing copy was truncated in the doc export.
