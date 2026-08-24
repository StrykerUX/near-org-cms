export type ChannelMarksProps = {
  /** Which family. Matches `CHANNEL_GROUPS[].id`. */
  id: string;
};

// One 1px drawing per family of channels — three, not eight.
//
// ── Why a family can have a mark and a platform cannot ────────────────────
// There is not a single platform logo anywhere on this page, in any variant,
// and the reason is arithmetic: `lucide-react` ships real marks for two of the
// eight destinations, a stale one for a third, and nothing for the rest. Half a
// row of invented logos reads as broken.
//
// A family is a different object. Nobody owns a symbol for "talk to someone",
// so there is nothing to falsify — and better than that, the drawing can BE the
// behaviour instead of standing for a brand. That is the only reason these
// three exist, and it is why there are three of them and not eight.
//
// ── The filter each one had to pass ───────────────────────────────────────
// The caption it would carry if it were a `Figure`. If that sentence came out
// tautological, the drawing was not showing anything and it was thrown away.
// The three that survived:
//
//   talk   — "Two people, taking turns."   Lines that alternate margin. What
//            went in the bin: a speech bubble, which is a picture of the word
//            "chat" and not of a conversation.
//   build  — "Each step stands on the last." Four treads that climb. Binned: a
//            hammer, a wrench, and a `</>`, all three of which say "developer"
//            rather than "learning".
//   follow — "It was already running when you got here." A dotted track that
//            enters and leaves the frame. Binned: the RSS fan, which is a logo
//            for a format nobody in the three destinations uses.
//
// They live in one file with one viewBox because they sit side by side in a row
// of cards: three drawings at three optical weights in three boxes is exactly
// the mismatched-logo problem in a different costume. Same box, same stroke,
// same margins.
//
// `aria-hidden` on all three. What each one says, the card's title and body say
// in words — a drawing that needs an alt text to be understood is a diagram
// with the caption missing.

const BOX = { w: 200, h: 120 } as const;

/** The frame both the transcript and the ladder are measured against. */
const PAD = 22;

/** Turn-taking: five lines, alternating margin, each shorter than a full row. */
const TALK_ROWS = [
  { y: 26, x: PAD, w: 96 },
  { y: 46, x: BOX.w - PAD - 78, w: 78 },
  { y: 66, x: PAD, w: 68 },
  { y: 86, x: BOX.w - PAD - 104, w: 104 },
] as const;

/** Four treads, each one starting where the last one stopped. */
const STEPS = 4;
const STEP_W = (BOX.w - PAD * 2) / STEPS;
const STEP_H = 18;

/** The feed: a dashed track that starts off-frame and leaves off-frame. */
const FOLLOW_Y = BOX.h / 2;
const FOLLOW_STOPS = [46, 84, 122, 160];

export default function ChannelMarks({ id }: ChannelMarksProps) {
  return (
    <svg
      viewBox={`0 0 ${BOX.w} ${BOX.h}`}
      className="w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      {id === "talk" &&
        TALK_ROWS.map((r) => (
          <line key={r.y} x1={r.x} y1={r.y} x2={r.x + r.w} y2={r.y} />
        ))}

      {id === "build" &&
        Array.from({ length: STEPS }, (_, i) => {
          const x = PAD + i * STEP_W;
          const y = BOX.h - PAD - i * STEP_H;
          return (
            <g key={i}>
              <line x1={x} y1={y} x2={x + STEP_W} y2={y} />
              {/* The riser to the next tread. The last step has nothing above
                  it — a ladder that closes at the top is a box. */}
              {i < STEPS - 1 && (
                <line x1={x + STEP_W} y1={y} x2={x + STEP_W} y2={y - STEP_H} />
              )}
            </g>
          );
        })}

      {id === "follow" && (
        <>
          {/* Runs edge to edge: the track has no beginning and no end inside
              the frame, which is the whole claim. */}
          <line
            x1={0}
            y1={FOLLOW_Y}
            x2={BOX.w}
            y2={FOLLOW_Y}
            strokeDasharray="2 7"
            opacity="0.55"
          />
          {FOLLOW_STOPS.map((x) => (
            <circle key={x} cx={x} cy={FOLLOW_Y} r={3.2} fill="currentColor" stroke="none" />
          ))}
        </>
      )}
    </svg>
  );
}
