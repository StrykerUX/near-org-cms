# `quantum` — sections for `/prototype/quantum-security`

Port of the quantum-security rebuild, which arrived as a "design canvas" package
(`Quantum Security.dc.html` + `quantum-fx.js`, 710 + ~700 lines) onto this
repo's design system.

The general contract in [`../README.md`](../README.md) applies. This file only
documents what is specific to this port.

**The words on this page are not owned here.** Their source of truth is the copy
deck, transcribed at [`docs/quantum-security-brief.md`](../../../docs/quantum-security-brief.md)
— including which section maps to which component, where the build departs from
the deck and why, and one contradiction inside the deck that is still open.
Change copy there first.

> **Language note.** Comments in this folder, in
> `components/primitives/motion/videoScrub.ts`, and in the
> `/prototype/quantum-security` block of `app/globals.css` are in **English**,
> at Lawrence's request. Everything else in the repo is still in Spanish.
> Converting the rest is a separate, reviewable change — not something to do by
> drag-along.

## §3 and §4 are ours now, not the canvas's

The reference ships **two mutually exclusive** "Threat and answer" sections behind
an `sc-if`, and contradicts itself about which is live. The paired rows were
ported first (`ThreatDuel`), and **that treatment has since been replaced.**

What runs now is **`ThreatSequence`**: one pinned viewport holding both deck
sections as three beats — the mechanism, the attack, the answer. The frame never
moves; only the core changes. The reasoning, the treatments it beat and the
iteration before it are all on `/prototype/quantum-threat-concepts` while that
route survives.

Three things in it are load-bearing and easy to break:

- **There is no "before" ending.** Beat three opens on the head alone and the
  answer is written in; it does not show the wrong ending first and dissolve it.
  An earlier version did, and it cost the reader a beat of watching something
  they were about to be told was wrong. The answer's letters start at
  `autoAlpha: 0` rather than being absent, so they hold their line and the head
  never reflows as they arrive.
- **The beat label names the beat's role, never the section's topic.** A label
  reading "The quantum threat" directly above a headline reading "The quantum
  threat to blockchains" says the same words twice. This has now been the same
  mistake three times on this page — the FAQ eyebrow, the lede eyebrow, and
  here.
- **Nothing translates vertically.** Every transition is a fade or a colour
  change in place. A drifting line pulls the eye off the pivot word.
- **The rotating band's sector width is a constraint, not a taste call.** The
  ring centre sits past the right edge, so only ~153° of each ring is ever on
  screen. A narrow sector spends most of every revolution off-stage and the
  section reads as having no colour in it. The maths is written out above
  `SWEEP_ARC`.
- **The rotation is on its own clock, not the scrub.** Tying it to scroll
  progress freezes it whenever the reader stops, which reads as the page having
  died. `pauseOffscreen` parks it out of view and resumes at the same angle.
- **The ring wave IS on the scrub**, unlike the rotation — it is the reader's
  progress through the beat made visible, so it has to track the scroll. It runs
  outward through beat one and inward through beat two. `RINGS_LIT` is the only
  knob: it sets how many rings are lit at once, and therefore whether this reads
  as a travelling wave or as the whole field swelling at once. Below ~2 it
  stutters, above ~3.5 it stops travelling.

The band is HTML, not SVG, because it needs a conic gradient — SVG has no native
equivalent, and the alternative is slicing the annulus into dozens of
solid-filled sectors to fake the ramp.

This section also introduced the `solid` tone on `CtaPill`: a filled white pill
with black type that takes the gradient on hover. Its resting and hover fills are
declared together in `[data-q-cta-fill-white]` — they have to be, to animate.

`ThreatLede` and `RotationStatement` are the previous iteration. They are unused
by any real page and survive only so the concepts route can show what changed.

Why it was replaced — worth keeping, because these are the traps to avoid if
anyone rebuilds this passage:

- The merge cost **both** of the deck's headlines. §3's "The quantum threat to
  blockchains" and §4's "A key rotation, not a migration" are the two strongest
  lines in that part of the deck, and neither survived.
- The third card pair was not a correspondence. *$470B at stake* does not
  answer *Live today*; they were two facts placed adjacently, on the row meant
  to land hardest.
- The green hinge between the pairs reads as *becomes*. The content is a
  comparison, not a transformation — `secp256k1 4fA9…c21B` never becomes
  `alice.near`.

`ThreatDuel.tsx` is still in the folder, unused by any real page, because the
concepts route still renders it for comparison. It goes when that route goes.

The expanding-stack variant (`data-stack-root`: four numbered rows opening one at
a time, each with its own animated isometric SVG, driven by `initStack` +
`buildViz`) was **never** ported and is not planned. It is still in the source
HTML and in `quantum-fx.js` if it is ever wanted.

Note that the paired-rows branch is also what carried the "Mathematics" statement
section, so `MathStatement` outlives the treatment it arrived with.

## What is shared with the other prototypes

| Rebuild section | Component used |
|---|---|
| Footer (variant A) | `../PrototypeFooter` |

Variant A of the source footer is identical to the one already in the repo, down
to the link groups and the legal row, so it is imported rather than copied.
**If it ever diverges it gets copied into `quantum/` at that moment** — not
before. Two identical files in two folders diverge in silence, which is exactly
what the per-folder split exists to prevent.

The nav pill is **not** shared. `home-v2/NavPillV2` is a solid black
shrink-to-fit pill; this one is full width, frosted light, and flips its ink over
dark sections. Three real differences is a different component.

## Decisions taken against the original

### `pin: true` → `position: sticky` (`ThreatDuel`)

The original pins the threat scene for `innerHeight * 1.8`. This repo forbids the
pin: the pin-spacer fights Lenis, feeds back into `PrototypeMotionProvider`'s
`ResizeObserver`, and leaves ghost spacers under StrictMode. The full reasoning
lives in `../ProofStats.tsx`.

Here the travel is **declared** in CSS (`--travel: 180svh`) and the track height
derives from it, so nothing needs measuring. The read-only ScrollTrigger runs
`top top → bottom bottom` over the track.

Consequence to remember: **no ancestor of the stuck element may have `overflow`
other than `visible`**, or the sticky silently stops sticking. The
`overflow-hidden` lives on the stuck child, which is allowed to have it.

The vertical padding is dropped (`group-data-[duel=on]/duel:py-0`) once the
sticky layout is on. With it, the child is exactly one viewport tall, the content
does not fit, and the section header gets clipped off the top.

### The nav ink flip: restored, not ported

The original has the entire mechanism — `data-nav-dark` on the dark sections, a
logo filter, per-link colours, a scroll handler that computes `isDark` — and then
its `apply()` writes the **light** values down both branches. The flip never
happens in the source.

`NavPillQuantum` restores it, because an attribute with no effect is a bug rather
than a decision. It is the one place this port deliberately does not match the
reference's rendered behaviour. Reverting is a two-line change: drop the
`data-[tone=dark]:*` classes.

### `fetch → Blob → objectURL` for the break video: dropped

Same as `home-v2/HeroVideo`. The original downloads the whole mp4 into memory
before it can seek, because its preview server does not answer HTTP Range. Next
serves `public/` with Range in dev and in production, so `currentTime` is
scrubbed directly.

### Measured DOM → layout (several)

| Original | Here |
|---|---|
| `cloneNode` of the `<h2>` + `ResizeObserver` syncing `left/top/width` | two text layers in the same grid cell (`StatementWipe`) |
| `height: scrollHeight → auto` with a deferred `onComplete` | `grid-template-rows: 0fr → 1fr` (`QuantumFaq`) |
| measure, then replace, per text node | measure **all**, then replace (`wordField.ts`) |

That last one is a real performance fix, not a style preference: interleaving the
two invalidates layout at every node, and the next `Range.getBoundingClientRect()`
forces it again — thousands of synchronous reflows over ~10k characters.

## Deliberately lost

- **Smooth scroll on the hero's "See NEAR's quantum roadmap".** It is a plain
  anchor. Smooth scrolling means `lenis.scrollTo()`, Lenis is encapsulated in
  `PrototypeMotionProvider`, and sections may not import from
  `@/components/site/*`. Same limitation as `home-v2/NearStack`'s rail; restoring
  it means exposing a `useLenis()` from the provider.
- **`initDuel`'s "bottom center" safety net.** It force-shows every card if the
  scrub never ran. With sticky instead of pin there is no state where that can
  happen.
- **`data-threat-pulse`.** Dead in the original: `initDuel` looks for it, and the
  paired-rows HTML never defines it.
- **The `tickerSeconds` / `latticeStyle` / `pinnedScenes` design-canvas props.**
  Authoring-tool controls, not page behaviour. Their defaults are baked in as
  named constants (`LOOP_SECONDS`, the lattice `wave` flag, the reduced-motion
  branch).

## `quantumLattice.ts` and `wordField.ts`

Two imperative factories (`create…` → handle with `destroy()`), created and
destroyed by their section's `gsap.matchMedia()`. Never hooks with their own
`useEffect` — that would give a live `prefers-reduced-motion` change two
lifecycles to keep in sync instead of one. Same contract as
`primitives/motion/glyphShine.ts`.

Both seed their randomness from a fixed LCG rather than `Math.random()`. In the
lattice it stops a resize from reseeding the whole field and producing a visible
jump; in the word field it stops two page loads from composing two different
fields, which would make the "drawing" the words form an accident instead of a
design decision.

`quantumLattice` hooks into `gsap.ticker` rather than opening its own rAF, so it
shares the loop that already drives Lenis (same call as `flowField.ts`).

`wordField` implies the NEAR mark by lighting the letters that fall inside it. It
rasterises the mark's path into an offscreen canvas the size of the field and
samples the alpha channel at each character's centre. `background-clip: text` is
no use — the point is lighting *individual letters*, not clipping a continuous
fill.

**Invariant if anyone edits `MathStatement`:** the field host's inline
`font-size: 13px` / `line-height: 20px` / `letter-spacing: 0.12em` are geometry,
not styling. `wordField.ts` computes its row and column counts from `LINE_H = 20`
and `CHAR_W = 8.6`. Changing one side without the other leaves the weave short or
overrun, and nothing errors.

## `videoScrub.ts` lives in the toolkit, not here

`FieldBreak` needed the same damped, frame-quantised, backpressured scrub loop
`home-v2/HeroVideo` grew inline. Rather than copy 60 lines of subtle logic, it
was lifted to `components/primitives/motion/videoScrub.ts`.

**HeroVideo still has its own inline copy.** Migrating it to the shared module is
a follow-up, deliberately not bundled with the page that prompted the extraction.
Until then there are two implementations and they can drift.

The `fps` argument is not readable from any browser API. For
`quantum-field-grow-scrub.mp4` it is 24, measured by reading the mp4 atoms
directly (145 samples over 6.0417s). Re-encoding the file means updating the
constant by hand.

## Tokens added to the DS

All additive, in `app/globals.css`.

Colours: `--ink-slate`, `--ink-soft`, `--rule`, `--green-ink`, and the three CTA
sweep stops `--cta-lime` / `--cta-mint` / `--cta-deep`.

`--ink-slate` (#222627) is **not** an alias of `--ink` (#101010), and
`--green-ink` (#00a86b) is **not** an alias of `--near-green-accent` (#00DC8D) —
the reasons are written next to each token.

Typographic roles: `--text-label-lg` (body size at weight 500 — a section's
primary CTA and emphasised body copy) and the `text-body-serif` utility (serif at
body size, for the italic gloss beside a fact). Both were born the same way
`--text-label` was: the usage already existed in practice as
`text-body font-medium`, i.e. patching the token's weight by hand.

## Where the scale was approximated

The reference's `clamp()`s do not all land on a DS role. These four were mapped
to the nearest role rather than minting a token per heading:

| Reference | Role used | Delta at 1512px |
|---|---|---|
| hero `3.25 → 7rem` | `text-display` | +13% |
| Mathematics `2.5 → 4.625rem` | `text-h1` | +9% |
| closing CTA `2.25 → 4rem` | `text-h2` | −4% |
| roadmap lead `1.1875 → 1.375rem` @500 | `text-h4` | +11% |

If any of these reads wrong at review, the fix is a token in the DS, not a
`text-[Npx]` at the call site.
