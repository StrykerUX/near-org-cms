"use client";

import { useEffect } from "react";
import type { ElementType, ReactNode } from "react";
import Container from "@/components/primitives/Container";

/**
 * The site's column grid.
 *
 * Twelve columns with a tokenised gutter (`--grid-cols` / `--grid-gutter` in
 * globals.css). Children position themselves with Tailwind's own
 * `col-span-*` / `col-start-*` — this component only establishes the tracks,
 * so there is no second vocabulary to learn and no props to keep in sync.
 *
 *   <Grid>
 *     <div className="col-span-5">…</div>
 *     <div className="col-start-8 col-span-5">…</div>
 *   </Grid>
 *
 * The point is that column edges become shared: a card here and a heading two
 * sections down land on the same line without either one knowing about the
 * other. That is the whole return on having a grid at all.
 */
export default function Grid({
  as: Tag = "div",
  children,
  className = "",
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}) {
  return <Tag className={`grid-ds ${className}`}>{children}</Tag>;
}

/**
 * Dev-only column ruler. Mount once per page; `?grid` in the URL turns it on.
 *
 * It exists so "does this line up with the grid" is a thing anyone can check
 * in a second rather than a thing that gets asserted in a commit message.
 */
export function GridOverlay() {
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("grid")) return;
    document.documentElement.dataset.grid = "on";
    return () => {
      delete document.documentElement.dataset.grid;
    };
  }, []);

  return (
    <div data-grid-overlay aria-hidden="true">
      <Container className="h-full">
        <div className="grid-ds h-full">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </Container>
    </div>
  );
}
