"use client";

import type { ReactNode } from "react";
import Container from "@/components/primitives/Container";
import { useScrollReveal } from "@/components/primitives/motion/useScrollReveal";

// The two-column rail that every block of variant B sits on, and the only piece
// of this folder that is pure layout.
//
// ── Why a component and not three copies of a grid ─────────────────────────
// The rail is the variant. If each section declared its own column spans, the
// left edge of the argument column would drift by a column somewhere in the
// page and the whole "this is one filed document" effect would go with it — a
// document is a document because its measure never changes. One component means
// one measure, enforced.
//
// ── The rule spans BOTH columns ────────────────────────────────────────────
// It is not a separator between sections; it is the ruling of the page, the
// thing the entries hang from. Ruling only the wide column would turn the rail
// into a margin note beside the document instead of part of it.
//
// The rail collapses above the argument on narrow windows rather than
// disappearing: its content is the record, not decoration, and a phone reader
// gets the same filing in one column.
//
// ── Why the reveal lives here and not in the sections ──────────────────────
// Two blocks of this variant are three clauses long. With one `useScrollReveal`
// per SECTION the trigger fires when its first row appears and the other two
// play out below the fold, so two thirds of the motion happens where nobody is
// looking. The row is the unit that enters the viewport, so the row is what
// owns the reveal — which also leaves every section that sits on `Clause` a
// plain server component with no hook of its own.

export type ClauseProps = {
  /** Clause number, set in mono at the head of the rail. */
  clause?: string;
  /** The section's own label — its heading in the table of contents. */
  label?: string;
  /** Term/value entries for the rail, in the order they should be read. */
  facts?: readonly { readonly id: string; readonly term: string; readonly value: string }[];
  children: ReactNode;
};

export default function Clause({ clause, label, facts, children }: ClauseProps) {
  const rootRef = useScrollReveal<HTMLDivElement>({ start: "top 84%" });

  return (
    <Container>
      <div ref={rootRef} className="grid-ds gap-y-8 border-t border-rule pb-[10svh] pt-8">
        <div data-reveal className="col-span-12 lg:col-span-3">
          {clause && <p className="text-caption-mono text-ink">{clause}</p>}
          {label && (
            <p className="mt-2 text-micro-mono uppercase text-gray-intermediate">{label}</p>
          )}

          {facts && (
            <dl className="mt-10 flex flex-col gap-4">
              {facts.map((fact) => (
                <div key={fact.id} className="flex flex-col gap-0.5">
                  <dt className="text-micro-mono uppercase text-gray-intermediate">
                    {fact.term}
                  </dt>
                  <dd className="text-caption-mono text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="col-span-12 lg:col-span-8 lg:col-start-5">{children}</div>
      </div>
    </Container>
  );
}
