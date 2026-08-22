import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import RoadmapVertical from "./RoadmapVertical";
import RoadmapVerticalV2 from "./RoadmapVerticalV2";
import RoadmapHorizontal from "./RoadmapHorizontal";

// Test bed for new scroll-driven section designs. Sections get added here as
// they're built, following the sticky-scroll pattern in
// components/primitives/motion/stickyScene.ts (position: sticky, never
// pin: true — see components/sections/README.md).
//
// Roadmap A/B: two layouts of the same "post-quantum roadmap" section, for
// the team to compare and pick one.
//
// RoadmapVerticalV2 is a working copy of RoadmapVertical — the next round of
// changes lands there so the already-reviewed version keeps working exactly
// as committed. Delete whichever one doesn't win once this settles.
export default function ScrollSectionsView() {
  return (
    <main className="flex flex-col pt-[var(--site-header-block)]">
      <Container className="flex flex-col gap-3 py-16">
        <Eyebrow>Prototype</Eyebrow>
        <h1 className="text-h2 text-foreground text-pretty">Scroll Sections</h1>
      </Container>

      <div className="h-16 lg:h-24" />
      <RoadmapVertical />
      <div className="h-16 lg:h-24" />
      <RoadmapVerticalV2 />
      <RoadmapHorizontal />

      <p className="py-16 text-center text-caption uppercase text-muted-foreground">
        scroll continues normally ↓
      </p>
    </main>
  );
}
