"use client";

import { useEffect, useRef, useState } from "react";
import { createGlyphShine, type GlyphShine } from "./motion/glyphShine";
import { subscribePointer } from "./motion/pointer";
import { gsap } from "./motion/gsapClient";
import { MQ } from "./motion/motionTokens";

export type ShineFieldProps = {
  placeholder: string;
  /** Etiqueta accesible del campo: el placeholder no alcanza, desaparece al
   *  escribir y acá además se pinta desde un overlay. */
  label: string;
  buttonLabel: string;
  name?: string;
};

// Campo de email con glyph-shine: un brillo
// WebGL2 recortado a la silueta exacta de los glifos.
//
// ── Por qué hay un overlay de texto ────────────────────────────────────────
// El shine necesita UN ELEMENTO POR GLIFO para medir posiciones y rasterizar la
// máscara. Un <input> no expone sus glifos: no hay nada que medir. Así que el
// input real queda con el texto transparente (solo se le ve el caret) y el
// texto visible lo pinta un overlay de <span>s, uno por carácter, que es lo que
// el shine mascara.
//
// El detalle que hace o rompe todo: al partir el texto en spans el navegador
// deja de aplicar kerning ENTRE caracteres, así que el overlay mide un poco más
// que el input y el caret se va despegando de las letras a medida que se
// escribe. Por eso los dos llevan `font-kerning: none`: no es un ajuste
// estético, es lo que mantiene las dos capas alineadas.
export default function ShineField({
  placeholder,
  label,
  buttonLabel,
  name = "email",
}: ShineFieldProps) {
  const [value, setValue] = useState("");
  const [active, setActive] = useState(false); // hover o foco

  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<GlyphShine | null>(null);

  // El texto que se pinta: el valor si hay algo, el placeholder si no. Se
  // renderiza SIEMPRE desde acá (el placeholder nativo va en transparente) para
  // que el shine tenga glifos que mascarar en los dos casos.
  const shown = value || placeholder;
  const isPlaceholder = value.length === 0;

  // ── Ciclo de vida del contexto WebGL: se crea UNA vez ─────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    const track = trackRef.current;
    if (!canvas || !box || !track) return;

    // El shine es movimiento: si el usuario pidió reducirlo, no se monta y el
    // campo queda como un input normal.
    if (!window.matchMedia(MQ.motion).matches) return;

    const shine = createGlyphShine(canvas, {
      chars: [], // los glifos los inyecta el efecto de abajo
      host: box,
      observe: track,
      tint: [0.34, 0.97, 0.72],
      intensity: 0.9,
      padEm: 0.5,
    });
    if (!shine) return; // sin WebGL2 utilizable: el campo funciona igual
    shineRef.current = shine;

    const unsubscribe = subscribePointer((x, y) => shine.setPointer(x, y));

    return () => {
      unsubscribe();
      shine.destroy();
      shineRef.current = null;
    };
  }, []);

  // ── El texto cambió: re-mascarar ──────────────────────────────────────────
  // `shown` en las deps y no un handler en onChange: así el efecto corre
  // DESPUÉS de que React pintó los spans nuevos, que es cuando existen en el
  // DOM para poder medirlos.
  useEffect(() => {
    const shine = shineRef.current;
    const track = trackRef.current;
    if (!shine || !track) return;
    shine.setChars(Array.from(track.querySelectorAll<HTMLElement>("[data-glyph]")));
  }, [shown]);

  // ── Encendido / apagado ───────────────────────────────────────────────────
  useEffect(() => {
    const shine = shineRef.current;
    if (!shine) return;
    shine.setVisible(active);

    if (!active) return;

    // Con el campo vacío no hay caret que seguir, así que el frente hace un
    // barrido en loop sobre el placeholder — es lo que invita a escribir. En
    // cuanto hay texto, manda el caret (ver syncCaret).
    if (!isPlaceholder) return;

    const state = { f: -0.25 };
    const tween = gsap.to(state, {
      f: 1.25,
      duration: 2.6,
      ease: "none",
      repeat: -1,
      repeatDelay: 0.5,
      onUpdate: () => shine.setFront(state.f),
    });
    // Llaves obligatorias: `kill()` devuelve el Tween y un cleanup de useEffect
    // tiene que devolver void.
    return () => {
      tween.kill();
    };
  }, [active, isPlaceholder]);

  // ── El frente sigue al caret ──────────────────────────────────────────────
  function syncCaret() {
    const shine = shineRef.current;
    const input = inputRef.current;
    const track = trackRef.current;
    if (!shine || !input || !track) return;

    // El input scrollea internamente cuando el texto excede su ancho. Sin
    // replicar ese offset, el overlay se queda quieto mientras el texto real se
    // desplaza y las dos capas se separan.
    track.style.transform = `translateX(${-input.scrollLeft}px)`;

    const glyphs = track.querySelectorAll("[data-glyph]").length;
    if (glyphs === 0 || input.value.length === 0) return;

    // El caret está entre caracteres; el frente se ubica en el glifo que se
    // acaba de escribir. En un email no hay espacios, así que el índice del
    // caret coincide con el índice de glifo.
    const caret = input.selectionStart ?? input.value.length;
    shine.setFront(glyphs > 1 ? (caret - 1) / (glyphs - 1) : 0.5);

    // El track se movió: la máscara quedó desalineada respecto al texto.
    shine.remeasure();
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()} // draft sin backend
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(document.activeElement === inputRef.current)}
      // `isolate` acota el grupo de blending del canvas, y el bg blanco entra
      // DENTRO de ese grupo para que `screen` tenga base: sobre blanco es
      // identidad, así que el brillo se ve solo dentro de los glifos negros.
      //
      // El ring de foco va acá y no en el input: el input tiene el texto
      // transparente, así que su outline nativo quedaría alrededor de algo
      // invisible. Antes este campo tenía `focus:outline-none` sin nada que lo
      // reemplace — no había ningún indicador de foco para teclado.
      className="relative isolate flex w-full max-w-sm items-center gap-2 rounded-full bg-white p-1.5 pl-6 ring-near-green-dark transition-shadow focus-within:ring-2"
    >
      {/* La caja del texto: el input y el overlay comparten exactamente este
          box, así que con la misma tipografía sus glifos caen en el mismo lugar. */}
      <div ref={boxRef} className="relative min-w-0 flex-1">
        <input
          ref={inputRef}
          type="email"
          name={name}
          aria-label={label}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          onSelect={syncCaret}
          onInput={syncCaret}
          onScroll={syncCaret}
          // El texto real es invisible: lo pinta el overlay. Queda el caret,
          // que es lo que no se puede replicar de forma creíble.
          // `placeholder:text-transparent` porque el placeholder también sale
          // del overlay — si no, se verían los dos.
          className="w-full bg-transparent text-body-sm text-transparent caret-black [font-kerning:none] placeholder:text-transparent focus:outline-none"
        />

        {/* Overlay de glifos. aria-hidden: el contenido accesible es el value
            del input y su aria-label; esto es una copia visual. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center overflow-hidden"
        >
          <div
            ref={trackRef}
            className={`whitespace-pre text-body-sm [font-kerning:none] ${
              isPlaceholder ? "text-muted-foreground" : "text-foreground"
            }`}
          >
            {Array.from(shown).map((ch, i) => (
              // Los espacios NO llevan data-glyph: no tienen silueta que
              // mascarar y desalinearían el índice del caret contra el de
              // glifo. Van como span suelto para conservar el ancho.
              <span key={i} {...(ch.trim() === "" ? {} : { "data-glyph": "" })}>
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* Después del overlay en el DOM: el orden de pintado lo pone encima sin
            z-index. Arranca en 0×0 vía clase — los estilos que glyphShine
            escribe imperativamente siempre ganan a los de la clase. */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-0 w-0 mix-blend-screen"
        />
      </div>

      {/* El botón lleva el verde de marca PLANO y texto NEGRO, no blanco.

          Fue un gradiente literal de lima a verde —los dos extremos del glifo
          NEAR—, y antes de eso `bg-near-green-dark` con texto blanco. Lo del
          texto sigue igual de vigente que entonces: blanco sobre este verde da
          2.1:1 y no pasa AA ni para texto grande; negro da 8.38:1. Acá lo
          legible y lo pedido coinciden, que no siempre pasa.

          Lo que cambió es el fondo: la marca no tiene degradé —los primitivos
          son cuatro colores planos—, así que el botón pinta el token en vez de
          dos hex sueltos. De paso deja de ser una excepción que había que
          explicar. */}
      <button
        type="submit"
        className="shrink-0 rounded-full bg-brand px-5 py-2 text-label text-ink transition-opacity hover:opacity-90"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
