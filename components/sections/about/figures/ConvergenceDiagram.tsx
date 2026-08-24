// The page's shape, drawn once: two people set out to make models write code,
// the models were not ready, the detour became a network, and the models came
// back needing it.
//
// ── Why this is not an ouroboros ───────────────────────────────────────────
// "It is a circle" is the sentence the README uses about this history, and a
// circle is exactly the wrong drawing for it: a closed loop says the story
// returns to where it started, and this one does not. It arrives somewhere the
// beginning could not have reached. So the figure is two lines that CONVERGE
// and then keep going off the right edge — the same "line that does not stop at
// the edge of its box" the chain page uses, here carrying the fact that 2026 is
// not an ending.
//
// ── Every mark is a claim from the chapters ────────────────────────────────
//   the upper line starts   — 2017: NEAR AI, models that write code
//   it stops                — 2018: "the models didn't scale… it was too early"
//   the vertical            — the pivot. The obstacle became the project
//   the lower line          — the network, built while waiting
//   the upper line resumes  — the LLMs finally arrive
//   the two meet            — 2024: blockchain for AI
//   the line leaves         — it does not resolve, it continues
//
// Nothing here is decorative: remove any one segment and the drawing stops
// saying something the chapters say.
//
// Static, for the same reason as ShardingDiagram: an animated version would
// need a resting state, and every candidate resting state is a false version of
// the argument. It enters with the host section's own reveal.

const W = 640;
const H = 160;

const Y_MODELS = 24;
const Y_NETWORK = 136;
const Y_MEET = 80;

const X_START = 8; // the models line begins
const X_PIVOT = 132; // it stops, and the detour drops from here
const X_RETURN = 404; // the models come back
const X_BEND = 540; // both lines start turning toward each other
const X_MEET = 604;
const X_EDGE = 636; // past the viewBox's own margin, on purpose

// Half-height of the tick that marks where the upper line picks up again. The
// gap between X_PIVOT and X_RETURN is the years the models did not exist, and
// an unmarked gap in a stroke reads as a rendering fault rather than as an
// absence someone drew.
const TICK = 8;

export default function ConvergenceDiagram() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      {/* the models: set out, stop */}
      <path d={`M ${X_START} ${Y_MODELS} H ${X_PIVOT}`} />
      {/* the pivot */}
      <path d={`M ${X_PIVOT} ${Y_MODELS} V ${Y_NETWORK}`} />
      {/* the models, returning */}
      <line x1={X_RETURN} y1={Y_MODELS - TICK} x2={X_RETURN} y2={Y_MODELS + TICK} />
      <path
        d={`M ${X_RETURN} ${Y_MODELS} H ${X_BEND} C 576 ${Y_MODELS} 576 ${Y_MEET} ${X_MEET} ${Y_MEET}`}
      />

      {/* the network, unbroken from the pivot on */}
      <path
        d={`M ${X_PIVOT} ${Y_NETWORK} H ${X_BEND} C 576 ${Y_NETWORK} 576 ${Y_MEET} ${X_MEET} ${Y_MEET}`}
      />

      {/* and out of the frame */}
      <path d={`M ${X_MEET} ${Y_MEET} H ${X_EDGE}`} />

      <circle cx={X_START} cy={Y_MODELS} r="1.8" fill="currentColor" stroke="none" />
      <circle cx={X_RETURN} cy={Y_MODELS} r="1.8" fill="currentColor" stroke="none" />
      <circle cx={X_PIVOT} cy={Y_NETWORK} r="1.8" fill="currentColor" stroke="none" />
      {/* the meeting is the only mark with weight in the drawing */}
      <circle cx={X_MEET} cy={Y_MEET} r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}
