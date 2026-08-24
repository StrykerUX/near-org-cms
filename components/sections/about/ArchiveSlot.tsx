import MediaFrame, { type MediaFrameProps } from "@/components/primitives/MediaFrame";
import { ARCHIVE } from "@/components/sections/about/aboutContent";

// A chapter's archive frame, looked up by chapter id.
//
// Three layouts × eight chapters is twenty-four call sites, and every one of
// them would otherwise have to carry the same three strings. The moment one of
// them is edited — a spec corrected, a brief sharpened after talking to whoever
// has to shoot it — the other two silently disagree, and the whole point of a
// single content module is gone. So the layouts pass an id and decide only what
// is theirs to decide: where the frame lands, and on which ground.
//
// `ratio` is an override and it exists for exactly one case: a layout that
// crops. Variant C's index would print eight assets at thumbnail width, where a
// 21/9 panorama is a hairline and the register stops being scannable. Nothing
// else should reach for it — the asset's own proportion is declared once in
// ARCHIVE precisely so the same photograph is not a portrait on one page and a
// letterbox on the next.

type Entry = {
  label: string;
  spec: string;
  shape: MediaFrameProps["ratio"];
};

// `ARCHIVE` is keyed by chapter id, but a chapter arrives here typed as
// `AboutChapter`, whose `id` is a plain string. Widening the lookup once, here,
// is what lets a caller pass `chapter.id` without a cast at every call site —
// and returning null for an unknown id means a ninth chapter added without its
// asset renders nothing rather than crashing the page.
const ENTRIES: Record<string, Entry | undefined> = ARCHIVE;

export type ArchiveSlotProps = {
  /** The chapter's `id`, as declared in `CHAPTERS`. */
  id: string;
  tone?: "light" | "dark";
  /** Crop override. See the note above — only for layouts that print thumbnails. */
  ratio?: MediaFrameProps["ratio"];
  className?: string;
};

export default function ArchiveSlot({
  id,
  tone = "light",
  ratio,
  className = "",
}: ArchiveSlotProps) {
  const entry = ENTRIES[id];
  if (!entry) return null;

  return (
    <MediaFrame
      label={entry.label}
      spec={entry.spec}
      ratio={ratio ?? entry.shape}
      tone={tone}
      className={className}
    />
  );
}
