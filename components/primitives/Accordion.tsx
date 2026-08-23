"use client";

import { useState } from "react";

// Acordeón genérico, `useState` interno (sin callbacks externos — el
// contrato de secciones prohíbe funciones como prop). `orientation`
// alterna entre lista vertical clásica y el acordeón horizontal masivo de
// borde a borde que pide el estilo Sui (columnas que compiten por ancho, el
// título rotado cuando está colapsado). `rounded` (solo aplica a
// `horizontal`) cambia el afilado `border-gray-800`/`rounded-none` de Sui
// puro por columnas separadas `rounded-3xl` con sombra difusa — la mezcla
// que pide el híbrido tech-cinematic (mecánica Sui, geometría Ondo).
export type AccordionItem = {
  id: string;
  title: string;
  body: string;
};

export type AccordionProps = {
  items: AccordionItem[];
  orientation?: "vertical" | "horizontal";
  defaultOpenId?: string;
  rounded?: boolean;
};

export default function Accordion({
  items,
  orientation = "vertical",
  defaultOpenId,
  rounded = false,
}: AccordionProps) {
  const [openId, setOpenId] = useState<string>(defaultOpenId ?? items[0]?.id ?? "");

  if (orientation === "horizontal") {
    return (
      <div className={rounded ? "flex w-full gap-4" : "flex w-full divide-x divide-gray-800 border border-gray-800"}>
        {items.map((item) => {
          const isOpen = item.id === openId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenId(item.id)}
              aria-expanded={isOpen}
              className={`flex min-h-96 flex-col justify-between p-8 text-left transition-[flex-grow] duration-500 ease-out ${
                isOpen ? "flex-[3]" : "flex-1"
              } ${rounded ? "rounded-3xl bg-ink-slate shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]" : ""}`}
            >
              <span
                className={`text-h4 text-pretty ${isOpen ? "" : "whitespace-nowrap [writing-mode:vertical-rl]"}`}
              >
                {item.title}
              </span>
              {isOpen && <p className="mt-6 text-body text-pretty">{item.body}</p>}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-800 border-y border-gray-800">
      {items.map((item) => {
        const isOpen = item.id === openId;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? "" : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-6 text-left"
            >
              <span className="text-h4">{item.title}</span>
              <span aria-hidden="true" className="text-label">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && <p className="pb-6 text-body text-pretty">{item.body}</p>}
          </div>
        );
      })}
    </div>
  );
}
