import MediaFrame from "@/components/primitives/MediaFrame";
import type { MediaFrameProps } from "@/components/primitives/MediaFrame";

// One cell of the dApps grid, shared by the three layouts.
//
// ── Why the three variants share this and not just `MediaFrame` ────────────
// The grid is half real and half commissioned, and the two halves need
// different handling that has nothing to do with layout: a served logo has to
// be scaled DOWN into its cell and a reserved one has to print its work order.
// Getting that wrong in one variant and right in the other two would show up as
// a difference between A, B and C — which is exactly the kind of noise the
// shared content module exists to keep out of this comparison. The cell is one
// decision; where the cells go is three.
//
// ── `object-scale-down`, not `object-contain` ─────────────────────────────
// `MediaFrame` serves its image with `object-cover`, which is right for a photo
// and destroys a wordmark: at 111×24 the mark would be cropped to the middle
// third of itself. `contain` fixes the cropping and introduces a worse problem
// — it scales the mark UP to fill an axis, so a 24px-tall logotype arrives at
// 45px and visibly soft. `scale-down` is `contain` with an upper bound of the
// asset's own size, which is how these same five files are set on the homepage.
// The consequence is deliberate: the marks do not come out at one optical
// weight, because they are not one mark.
//
// The descendant variant wins over the `object-cover` on the image without
// depending on class order — `.cell img` is one specificity step above `.cover`.
//
// ── A reserved cell is never revealed ─────────────────────────────────────
// No cell of this grid — and no `MediaFrame` anywhere in this folder — carries
// `data-reveal`. `useScrollReveal` pre-hides its targets at mount (`.from()`
// renders its start state immediately, which is documented in the hook), so a
// reserved cell inside a reveal is invisible until the stagger reaches it, and
// what the reader gets in the meantime is a hole the exact size of the missing
// asset. That is the one failure a placeholder cannot have: the whole point of
// the frame is to DECLARE the gap, and a declaration that fades in is not a
// declaration for as long as it is missing. The cells are painted at rest.

export type EcosystemMarkProps = {
  /** One entry of `ECOSYSTEM_MARKS`. `src` present means the asset exists. */
  mark: { readonly id: string; readonly name: string; readonly src?: string };
  ratio?: MediaFrameProps["ratio"];
  tone?: MediaFrameProps["tone"];
};

export default function EcosystemMark({
  mark,
  ratio = "5/2",
  tone = "light",
}: EcosystemMarkProps) {
  return (
    <MediaFrame
      label={mark.name}
      // The name is the label, and nothing outside the frame repeats it: all
      // five served assets are WORDMARKS, so the cell that has its mark is
      // already saying its name. A caption under it would be a caption of a
      // caption, and it would also make the served cells taller than the
      // reserved ones, which is the one thing a grid cannot survive.
      spec="Monochrome SVG"
      ratio={ratio}
      tone={tone}
      src={mark.src}
      alt={mark.name}
      className={mark.src ? "[&_img]:object-scale-down [&_img]:p-4" : ""}
    />
  );
}
