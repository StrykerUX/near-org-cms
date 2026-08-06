"use client";

// Un solo `pointermove` para toda la página, compartido por N suscriptores.
// Dos instancias de glyphShine (una por línea de heading) no justifican dos
// listeners, y el día que haya un tercer consumidor tampoco.
//
// Lazy-attach / lazy-detach: el listener se agrega con el PRIMER suscriptor y
// se saca con el ÚLTIMO. En una página donde nadie se suscribe (reduced
// motion, o sin WebGL2) este módulo no toca `window` jamás.

export type PointerListener = (x: number, y: number) => void;

const listeners = new Set<PointerListener>();

// Último valor conocido, normalizado a [0,1] de la ventana. Se guarda a nivel
// de módulo para que un suscriptor que llega tarde (o que se re-crea en el
// segundo mount de StrictMode) arranque desde la posición REAL del mouse y no
// desde un centro arbitrario que después salta.
let lastX = 0.5;
let lastY = 0.5;
let attached = false;

function onPointerMove(e: PointerEvent) {
  // innerWidth/innerHeight y no el rect de ningún elemento: el spotlight es
  // global — reacciona al mouse en TODA la pantalla, sin pasar por el texto.
  lastX = e.clientX / (window.innerWidth || 1);
  lastY = e.clientY / (window.innerHeight || 1);
  // Iterar un Set mientras un callback se da de baja es seguro por spec.
  for (const fn of listeners) fn(lastX, lastY);
}

/**
 * Devuelve la función de baja. Es IDEMPOTENTE: en StrictMode el cleanup puede
 * correr dos veces, y sin el flag `live` el segundo `delete` de un Set vacío
 * dispararía el detach del listener que el remount ya volvió a necesitar.
 */
export function subscribePointer(fn: PointerListener): () => void {
  listeners.add(fn);

  if (!attached) {
    attached = true;
    // passive: nunca llamamos preventDefault; sin esto el navegador no puede
    // asumirlo y el scroll pierde el fast-path.
    window.addEventListener("pointermove", onPointerMove, { passive: true });
  }

  // Empuje inicial sincrónico: el suscriptor queda con un estado válido sin
  // tener que esperar a que el usuario mueva el mouse.
  fn(lastX, lastY);

  let live = true;
  return () => {
    if (!live) return;
    live = false;
    listeners.delete(fn);
    if (listeners.size === 0) {
      attached = false;
      window.removeEventListener("pointermove", onPointerMove);
    }
  };
}
