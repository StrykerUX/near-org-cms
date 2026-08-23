"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Pantalla dividida tipo terminal — mecánica firma de Capabilities en el
// estilo Sui: índice vertical a la izquierda, panel negro a la derecha con
// el detalle del ítem activo. `useState` interno para el ítem activo (sin
// callbacks externos, por el contrato de secciones).
//
// `children` es el slot para lo que va debajo del link en el panel (el
// placeholder de gráfico/blueprint) — TerminalSplit no importa `Placeholder`
// directamente: es un primitivo, y los primitivos no dependen de
// `components/sections/*` (la dirección de import va al revés). El caller
// (una sección) decide qué placeholder pasar.
export type TerminalSplitItem = {
  id: string;
  kicker: string;
  header: string;
  body: string;
  link: string;
};

export type TerminalSplitProps = {
  items: TerminalSplitItem[];
  children?: ReactNode;
  /** `rounded-3xl` en vez de esquinas rectas — mezcla con la geometría Ondo
   *  que pide el híbrido tech-cinematic. Default `false` (Sui puro). */
  rounded?: boolean;
};

export default function TerminalSplit({ items, children, rounded = false }: TerminalSplitProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const active = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <div
      className={`grid grid-cols-1 border border-gray-800 lg:grid-cols-[minmax(0,1fr)_2fr] ${rounded ? "overflow-hidden rounded-3xl" : ""}`}
    >
      <div className="flex flex-col divide-y divide-gray-800 border-b border-gray-800 lg:border-b-0 lg:border-r">
        {items.map((item) => {
          const isActive = item.id === active?.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              aria-current={isActive}
              className={`px-6 py-5 text-left text-caption-mono uppercase transition-colors ${
                isActive ? "bg-white/5 text-near-green" : "text-gray-blue hover:text-cream"
              }`}
            >
              {item.kicker}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-6 bg-black p-10">
        {active && (
          <>
            <h3 className="text-h3 text-cream text-pretty">{active.header}</h3>
            <p className="text-body text-cream/70 text-pretty">{active.body}</p>
            <Link
              href="#"
              className="inline-flex w-fit items-center gap-1 text-label text-near-green transition-transform hover:translate-x-0.5"
            >
              {active.link}
              <ArrowUpRight className="size-4" />
            </Link>
          </>
        )}
        {children}
      </div>
    </div>
  );
}
