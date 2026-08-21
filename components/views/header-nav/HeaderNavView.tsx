import Container from "@/components/primitives/Container";
import Eyebrow from "@/components/primitives/Eyebrow";
import HeaderNavMock from "./HeaderNavMock";
import HeaderNavMockV2 from "./HeaderNavMockV2";
import HeaderNavOriginal from "./HeaderNavOriginal";

// Test bed for a new header/nav design. All three mocks are self-contained
// replicas — the real SiteHeader (components/site/SiteHeader.tsx) stays
// untouched and keeps rendering above this page too (mounted by
// app/prototype/layout.tsx), unaffected by whatever changes here.
//
// HeaderNavMockV2 is a working copy of HeaderNavMock — the next round of
// changes lands there so the already-reviewed version keeps working exactly
// as it is. HeaderNavMockV2 is the one that got ported into the real header
// once approved; HeaderNavOriginal is a frozen backup of how the real header
// looked right before that port, kept here so it stays viewable instead of
// only living in git history. Delete whichever mocks don't matter anymore
// once this settles.
export default function HeaderNavView() {
  return (
    <main className="flex min-h-[80vh] flex-col pt-[var(--site-header-block)] pb-24">
      <Container className="flex flex-col gap-3 py-16">
        <Eyebrow>Prototype</Eyebrow>
        <h1 className="text-h2 text-foreground text-pretty">Header &amp; Nav</h1>
        <p className="max-w-2xl text-body-sm text-muted-foreground text-pretty">
          Mock nav bar below — menu opens on click instead of hover.
        </p>
      </Container>

      <div className="flex flex-col gap-16 bg-cream py-24">
        <HeaderNavMock />
        <HeaderNavMockV2 />
        <HeaderNavOriginal />
      </div>
    </main>
  );
}
