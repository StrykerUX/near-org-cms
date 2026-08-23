import type { ComponentType } from "react";
import Figure from "@/components/primitives/Figure";
import { FIGURES } from "@/components/sections/about/aboutContent";
import ConvergenceDiagram from "@/components/sections/about/figures/ConvergenceDiagram";
import ShardingDiagram from "@/components/sections/about/figures/ShardingDiagram";

// A chapter's drawn figure, or nothing.
//
// Six of the eight chapters get nothing, and the component returning null for
// them is the point: the three layouts can put `<ChapterFigure id={…} />` in
// the same slot of the same loop without any of them carrying a list of which
// chapters are drawn. Which chapters are drawn is an argument about the
// content, so it lives with the content (`FIGURES` in `aboutContent.ts`), not
// three times in three layouts that would drift.
//
// The layouts still decide the two things that are theirs: how many columns the
// figure spans, and which ground it sits on.

const DIAGRAMS: Record<string, ComponentType | undefined> = {
  sharding: ShardingDiagram,
  ai: ConvergenceDiagram,
};

const CAPTIONS: Record<string, { caption: string } | undefined> = FIGURES;

export type ChapterFigureProps = {
  /** The chapter's `id`, as declared in `CHAPTERS`. */
  id: string;
  tone?: "light" | "dark";
  className?: string;
};

export default function ChapterFigure({
  id,
  tone = "light",
  className = "",
}: ChapterFigureProps) {
  const Diagram = DIAGRAMS[id];
  const entry = CAPTIONS[id];
  if (!Diagram || !entry) return null;

  // No `index`. Both figures are the only one in their section, and numbering
  // a series the prose never references is a caption pretending to be a
  // cross-reference.
  return (
    <Figure caption={entry.caption} tone={tone} className={className}>
      <Diagram />
    </Figure>
  );
}
