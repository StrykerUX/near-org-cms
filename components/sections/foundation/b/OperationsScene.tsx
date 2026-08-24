"use client";

import { useState, type CSSProperties } from "react";
import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import Panel from "@/components/sections/shells/instrument/Panel";
import ActRail from "@/components/sections/shells/instrument/ActRail";
import { useMotionScope } from "@/components/primitives/motion/useMotionScope";
import { enableScene, trackTimeline } from "@/components/primitives/motion/stickyScene";
import { gsap } from "@/components/primitives/motion/gsapClient";
import { OPERATIONS, PLATES } from "@/components/sections/foundation/foundationContent";
import { face } from "@/components/sections/foundation/b/apparatus";

// §6 — the treasury, divided across three acts.
//
// ── What the scene claims, and why it needs three acts to claim it ─────────
// The copy says the Foundation's primary lever is its treasury and that it is
// spent on exactly three activities. Two of them are things it keeps doing:
// allocating and supporting are functions it performs again next year. The
// third — "the continuing devolution of functions and operations to the
// ecosystem itself" — is the one whose product does not come back, because
// what it hands over is the doing of the thing.
//
// So the parcels behave differently, and that difference IS the figure: three
// pieces leave the slab, two of them land inside the frame, and the third
// crosses the edge and is gone. A distribution diagram would have shown three
// arrows and said nothing about the third.
//
// ── Why `ActRail` and not just three headings ─────────────────────────────
// A panel that changes three times while the reader scrolls has to declare how
// many times it is going to change, or the reader cannot tell whether waiting
// is worth it. The rail states the duration up front. It is presentational by
// design — it receives `active`, so the timeline stays the only source of
// which act is running.
//
// ── Degradation ───────────────────────────────────────────────────────────
// Same contract as `a/HandoffScene`: the markup renders the FINAL state and
// the scene winds it back. Without JS, on a phone, or with reduced motion,
// `enableScene` never writes its attribute, the track has no extra height, the
// sticky child is a normal block and the three acts stack in flow — with the
// figure already resolved: two parcels delivered, three dashed vacancies where
// the treasury was, and nothing where the third one went. Nothing is pre-hidden
// in CSS, which is why there is no initial-state class anywhere in this file.
//
// The rail shows no act in that state. `active` starts out of range on
// purpose: with all three blocks of copy stacked and readable, lighting one of
// them would be claiming a step the reader is not on.

const STATION_SVH = 82;
const TRAVEL_SVH = STATION_SVH * OPERATIONS.activities.length;
const TRAVEL = `${TRAVEL_SVH}svh`;

// ── Figure ──────────────────────────────────────────────────────────────────
// The slab shares the vessel's footprint from `apparatus.ts`: this is what was
// being held in the sections above, seen as the thing it is spent as.
const SLAB = { w: 168, d: 96, h: 24 } as const;
const PARCELS = OPERATIONS.activities.length;
const PARCEL_W = SLAB.w / PARCELS;

const SCENE = { w: 640, h: 330, ox: 130, oy: 168 } as const;
const SCENE_BOX = `0 0 ${SCENE.w} ${SCENE.h}`;
const SCENE_ORIGIN = `translate(${SCENE.ox} ${SCENE.oy})`;

/**
 * Where each parcel ends up, in screen units.
 *
 * The first two stay inside the canvas because those two functions stay with
 * the Foundation; the third is placed far enough right that the viewBox clips
 * it. A parcel that stops just inside the edge has arrived somewhere, and this
 * one has not — it has left.
 */
const DEST = [
  { x: 214, y: -80 },
  { x: 250, y: 10 },
  { x: 436, y: 76 },
] as const;

const RETURNS = 2;

function parcelFaces(i: number) {
  const x0 = i * PARCEL_W;
  const x1 = x0 + PARCEL_W;
  return {
    top: face([
      [x0, 0, SLAB.h],
      [x1, 0, SLAB.h],
      [x1, SLAB.d, SLAB.h],
      [x0, SLAB.d, SLAB.h],
    ]),
    left: face([
      [x0, SLAB.d, SLAB.h],
      [x0, SLAB.d, 0],
      [x1, SLAB.d, 0],
      [x1, SLAB.d, SLAB.h],
    ]),
    right: face([
      [x1, 0, SLAB.h],
      [x1, 0, 0],
      [x1, SLAB.d, 0],
      [x1, SLAB.d, SLAB.h],
    ]),
    footprint: face([
      [x0, 0, 0],
      [x1, 0, 0],
      [x1, SLAB.d, 0],
      [x0, SLAB.d, 0],
    ]),
  };
}

const SLAB_FOOTPRINT = face([
  [0, 0, 0],
  [SLAB.w, 0, 0],
  [SLAB.w, SLAB.d, 0],
  [0, SLAB.d, 0],
]);

function Parcel({ index }: { index: number }) {
  const f = parcelFaces(index);
  const leaves = index === PARCELS - 1;

  return (
    // Two nested groups on purpose: GSAP owns the transform of the outer one,
    // and the inner one carries the destination offset as an attribute. Sharing
    // a single group would mean GSAP parsing and overwriting a transform the
    // markup also needs, which is how a figure silently loses its layout.
    <g data-parcel>
      <g
        transform={`translate(${DEST[index].x} ${DEST[index].y})`}
        className={leaves ? "text-near-green-accent" : undefined}
      >
        <polygon points={f.top} fill="currentColor" opacity="0.12" stroke="none" />
        <polygon points={f.left} fill="currentColor" opacity="0.06" stroke="none" />
        <polygon points={f.right} fill="currentColor" opacity="0.06" stroke="none" />
        <polygon points={f.top} fill="none" stroke="currentColor" opacity="0.7" />
        <polygon points={f.left} fill="none" stroke="currentColor" opacity="0.55" />
        <polygon points={f.right} fill="none" stroke="currentColor" opacity="0.55" />
      </g>
    </g>
  );
}

function TreasuryField() {
  return (
    <svg viewBox={SCENE_BOX} className="w-full" aria-hidden="true">
      <g transform={SCENE_ORIGIN} fill="none" stroke="currentColor" strokeWidth="1">
        {/* What the treasury occupied. It stays drawn after everything has
            left: the page's claim is that the Foundation gets smaller, not
            that it was never there. */}
        <polygon points={SLAB_FOOTPRINT} opacity="0.28" />

        {Array.from({ length: PARCELS }, (_, i) => (
          <polygon
            key={`vacancy-${i}`}
            points={parcelFaces(i).footprint}
            opacity="0.18"
            strokeDasharray="3 4"
          />
        ))}

        {/* Where the two that stay are going. Printed on the field before they
            get there, the way a bench marks its own stations. */}
        {Array.from({ length: RETURNS }, (_, i) => (
          <g key={`landing-${i}`} transform={`translate(${DEST[i].x} ${DEST[i].y})`}>
            <polygon points={parcelFaces(i).footprint} opacity="0.22" strokeDasharray="3 4" />
          </g>
        ))}

        {Array.from({ length: PARCELS }, (_, i) => (
          <Parcel key={`parcel-${i}`} index={i} />
        ))}
      </g>
    </svg>
  );
}

/** Each act owns an equal share of the track, and the departure sits inside it. */
const CUTS = OPERATIONS.activities.map((_, i) => i / PARCELS);
const DEPART_LEAD = 0.04;
const DEPART_DUR = 0.26;
const FADE = 0.05;

// A sticky element releases in one frame — held, then at full scroll speed.
// Lifting the content slightly over the last stretch means it is already moving
// when the release lands, so the two speeds meet instead of colliding. Same fix
// and same numbers as `quantum/ThreatSequence` and `a/HandoffScene`.
const RELEASE_SPAN = 0.14;
const RELEASE_LIFT = 0.055;

export default function OperationsScene() {
  const [active, setActive] = useState(-1);

  const rootRef = useMotionScope<HTMLElement>(({ q, scope, motionOk, isDesktop }) => {
    if (!motionOk || !isDesktop) return;

    const stations = q("[data-station]");
    const parcels = q<SVGGElement>("[data-parcel]");
    if (stations.length !== PARCELS || parcels.length !== PARCELS) return;

    const sceneOff = enableScene(scope, "ops");
    const tl = trackTimeline(scope, {
      scrub: 0.35,
      scrollTrigger: {
        onUpdate: (self) => {
          const i = Math.min(PARCELS - 1, Math.floor(self.progress * PARCELS));
          setActive(i);
        },
        onLeaveBack: () => setActive(-1),
      },
    });

    gsap.set(stations.slice(1), { autoAlpha: 0 });

    parcels.forEach((parcel, i) => {
      tl.from(
        parcel,
        {
          x: -DEST[i].x,
          y: -DEST[i].y,
          // `power2.inOut`: a parcel that leaves fast and coasts reads as
          // thrown. Easing both ends is a piece detaching, travelling and
          // settling, which is what a hand-over looks like.
          ease: "power2.inOut",
          duration: DEPART_DUR,
        },
        CUTS[i] + DEPART_LEAD
      );

      if (i > 0) {
        // Hard cut in, cross-fade out: with both fading at once there is a
        // stretch where neither act is legible, and the figure is moving
        // through exactly that stretch.
        tl.to(stations[i], { autoAlpha: 1, duration: FADE, ease: "none" }, CUTS[i]);
        tl.to(stations[i - 1], { autoAlpha: 0, duration: FADE, ease: "none" }, CUTS[i]);
      }
    });

    const stuck = q("[data-ops-content]")[0];
    if (stuck) {
      tl.fromTo(
        stuck,
        { y: 0 },
        // Function-based value plus the `invalidateOnRefresh` that
        // `trackTimeline` sets: GSAP does not parse `svh`, and the distance has
        // to survive a resize.
        { y: () => -window.innerHeight * RELEASE_LIFT, ease: "power2.in", duration: RELEASE_SPAN },
        1 - RELEASE_SPAN
      );
    }

    return () => {
      sceneOff();
      tl.scrollTrigger?.kill();
      tl.kill();
      setActive(-1);
      gsap.set(stations, { clearProps: "opacity,visibility" });
      gsap.set(parcels, { clearProps: "transform" });
      if (stuck) gsap.set(stuck, { clearProps: "transform" });
    };
  });

  return (
    // No `overflow-hidden` on the track: an ancestor with overflow other than
    // visible becomes the sticky child's scroll container and it stops sticking
    // in silence. `data-ops` is NOT declared here — `enableScene` writes it.
    <section
      ref={rootRef}
      style={{ "--travel": TRAVEL } as CSSProperties}
      className="group/ops relative bg-ink py-[12svh] text-cream data-[ops=on]:h-[calc(100svh+var(--travel))] data-[ops=on]:py-0"
    >
      <div className="relative group-data-[ops=on]/ops:sticky group-data-[ops=on]/ops:top-0 group-data-[ops=on]/ops:h-svh">
        <Container
          data-ops-content
          className="flex flex-col justify-center gap-[4svh] group-data-[ops=on]/ops:h-full group-data-[ops=on]/ops:pt-[10svh]"
        >
          <div className="grid-ds gap-y-5">
            <div className="col-span-12">
              <Eyebrow className="text-white/40">{OPERATIONS.eyebrow}</Eyebrow>
            </div>
            <h2 className="col-span-12 max-w-[20ch] text-h4 lg:col-span-4 text-pretty">
              {OPERATIONS.headline}
            </h2>
            <p className="col-span-12 max-w-[64ch] text-body-sm text-white/55 lg:col-span-7 lg:col-start-6 text-pretty">
              {OPERATIONS.intro}
            </p>
          </div>

          <Panel
            label={PLATES.operations.label}
            meta={PLATES.operations.meta}
            grid
            footer={
              <ActRail
                acts={OPERATIONS.activities.map((a) => ({ id: a.id, label: a.title }))}
                active={active}
              />
            }
          >
            <div className="grid-ds items-center gap-y-12 px-5 pb-10 pt-16 lg:px-7 lg:pb-12 lg:pt-20">
              {/* One grid cell for all three acts while the scene is armed, so
                  the panel never reflows between them; disarmed, they fall back
                  into normal flow and stack. */}
              <div className="col-span-12 grid gap-y-10 lg:col-span-4">
                {OPERATIONS.activities.map((activity) => (
                  <div
                    key={activity.id}
                    data-station
                    className="group-data-[ops=on]/ops:[grid-area:1/1]"
                  >
                    <p className="text-caption-mono text-white/40">{activity.index}</p>
                    <h3 className="mt-5 max-w-[16ch] text-h3 text-balance">{activity.title}</h3>
                    <p className="mt-5 max-w-[36ch] text-body text-white/60 text-pretty">
                      {activity.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="col-span-12 lg:col-span-7 lg:col-start-6">
                <TreasuryField />
              </div>
            </div>
          </Panel>
        </Container>
      </div>
    </section>
  );
}
