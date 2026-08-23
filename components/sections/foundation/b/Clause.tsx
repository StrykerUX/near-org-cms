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
// ── Two columns, not four ──────────────────────────────────────────────────
// The rail was drafted at three of twelve columns, which is ~450px at 1440 and
// stops being a margin: at that width an entry of two mono lines leaves most of
// the column empty, and empty is what the eye reads — not "margin of a
// document" but "column nobody filled". A margin is narrow BY DEFINITION, and
// the width it gives back goes to the argument. Two columns fits the longest
// value in `STIFTUNG_FACTS` ("Swiss regulatory authority") on two lines of
// caption mono, which is the measure this rail is actually sized against.
//
// ── The rail carries the record, and it has to be full ─────────────────────
// The wide column is the argument; the rail is where the document's DATA lives
// — clause number, section label, legal facts, the names of the two governing
// bodies. A block whose rail holds only an eyebrow is an exception and should
// be rare: if a section has register material and it is set in the wide column
// instead, the variant has no reason to exist. `facts` covers the common case
// (term over value); `rail` is the slot for the shape that is not a list, which
// today is the Council's two bodies and the verbs between them.
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
  /** Register material that is not a term/value list. Renders under `facts`. */
  rail?: ReactNode;
  children: ReactNode;
};

export default function Clause({ clause, label, facts, rail, children }: ClauseProps) {
  const rootRef = useScrollReveal<HTMLDivElement>({ start: "top 84%" });

  return (
    <Container>
      <div ref={rootRef} className="grid-ds gap-y-8 border-t border-rule pb-[10svh] pt-8">
        <div data-reveal className="col-span-12 lg:col-span-2">
          {clause && <p className="text-caption-mono text-ink">{clause}</p>}
          {label && (
            <p className="mt-2 max-w-[22ch] text-micro-mono uppercase text-gray-intermediate">
              {label}
            </p>
          )}

          {facts && (
            <dl className="mt-10 flex flex-col gap-5">
              {facts.map((fact) => (
                <div key={fact.id} className="flex flex-col gap-1">
                  <dt className="text-micro-mono uppercase text-gray-intermediate">
                    {fact.term}
                  </dt>
                  <dd className="text-caption-mono text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {rail && <div className="mt-10">{rail}</div>}
        </div>

        <div className="col-span-12 lg:col-span-9 lg:col-start-4">{children}</div>
      </div>
    </Container>
  );
}
