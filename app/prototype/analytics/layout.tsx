import PrototypeMotionProvider from "@/components/site/providers/PrototypeMotionProvider";

// Same reasoning as `app/prototype/homepage-update/layout.tsx` and
// `app/prototype/chain-ab-propuesta-a/layout.tsx`: the provider lives here and
// not in `app/prototype/`, so that `/prototype` and `/prototype/components`
// keep running without Lenis and without a coordinated
// `ScrollTrigger.refresh()`.
//
// Proposal C needs it — it is the only one of the three that animates. Its two
// ScrollTrigger scenes (`c/CoreStats` and `c/ToolsMural`) measure against the
// viewport, and without the coordinated refresh they stay pinned to the first
// paint's height: that is, before the font swap resizes every heading and
// before C's hero SVG settles at its final height. The symptom is a reveal that
// fires late, or one that has already finished by the time the section reaches
// the edge.
//
// A and B do not need it (neither mounts a single scene), but inheriting it
// changes nothing for them: the provider only installs Lenis and the refresh,
// it does not animate.
export default function AnalyticsLabsLayout({ children }: { children: React.ReactNode }) {
  return <PrototypeMotionProvider>{children}</PrototypeMotionProvider>;
}
