"use client";

import HeroFoliage from "@/components/sections/homepage-shared/HeroFoliage";

// ⏸ SIN MONTAR — pendiente de dirección de arte.
//
// El componente funciona y está calibrado, pero ninguna de las versiones
// probadas convenció, así que la sección volvió al halo. Para encenderlo:
// `<StackAnchors flow />` en la view.
//
// Lo intentado, y por qué se descartó cada uno:
//
//   1. Abanico desde abajo con paleta oscura      → demasiado brillante.
//   2. Foco al centro, capas amplias, gradSpread    → verde plano, sin negro y
//      bajo                                          sin capas. Dos errores:
//      `gradSpread` bajo impide que el degradé llegue a sus paradas oscuras, y
//      el foco EXACTO en el centro degenera el campo (ver abajo).
//   3. Sólo tres cambios sobre la calibración del  → seguía muy iluminado; el
//      hero, negro vía paleta                        arreglo fue `lift`.
//   4. De follaje a seda: menos detalle, menos     → mejor, pero «poco premium».
//      grano, más blur, deriva lenta
//   5. Vórtice con el uniforme `u_swirl` nuevo     → no era la dirección.
//   6. Abanico suave con líneas duras por escalón  → donde quedó.
//      de paleta
//
// Lo que hay abajo es el estado 6, con el razonamiento de cada parámetro. La
// lección transversal: los quince parámetros están calibrados ENTRE SÍ contra
// un frame de referencia, y mover varios a la vez rompe el equilibrio del
// resto. Conviene tocar de a uno, y para bajar la luz usar `lift`, que es la
// única palanca sin efectos laterales.
//
// ── El fondo del NEAR Stack: el shader del hero, con la luz naciendo abajo ──
//
// ── Es el hero, no una calibración nueva ────────────────────────────────────
//
// Hubo dos intentos de recalibrar el shader entero para este sitio —foco al
// centro, curvas propias, contraste propio— y los dos salieron mal por el mismo
// motivo: los quince parámetros están calibrados ENTRE SÍ, contra un frame de
// referencia, y mover cuatro a la vez rompe el equilibrio de los once
// restantes. Uno terminó en una superficie lisa sin capas; el otro en un verde
// plano sin negro.
//
// Así que acá no hay calibración: hay tres cambios sobre la del hero, y el
// resto se hereda. `params` es parcial justamente para poder escribirlo así —
// lo que no está declarado es, literalmente, lo mismo que el hero.
//
// ── Los tres cambios ────────────────────────────────────────────────────────
//
// **El foco, abajo y fuera del cuadro.** Las estrías salen radialmente de él:
// ahí nace el abanico. Fuera, por el mismo motivo por el que el hero lo tiene
// fuera a la derecha — adentro se ve el punto del que todo sale.
//
// **El degradé, vertical.** El hero lo tiene en diagonal (`-0.72` rad), que es
// lo que le da la luz de tarde entrando por un lado. `π/2` alinea su eje con la
// pantalla: la luz abajo, la sombra arriba.
//
// **La curva, un punto más cerrada.** `1.9` contra `1.5` comprime la zona clara
// contra el borde inferior. Es el único ajuste de intensidad, y es chico a
// propósito: lo que hace que el cuadro sea oscuro no son los parámetros sino la
// paleta.
const FLOW = {
  // ── Abanico: el foco abajo, fuera del cuadro, y sin giro ─────────────────
  //
  // `swirl: 0` devuelve el flujo radial puro — el uniforme sigue en el shader y
  // el hero también lo usa en 0. Y el foco vuelve afuera por el motivo de
  // siempre: adentro se ve el punto del que todo sale.
  focusX: 0.5,
  focusY: -0.12,
  swirl: 0,

  // ── Suave ────────────────────────────────────────────────────────────────
  //
  // Formas grandes, casi sin capa de detalle, grano apenas suficiente para
  // romper el banding, y una deriva que hay que mirar a propósito para notar.
  // Nada de esto pelea con las líneas: lo suave es la FORMA, lo marcado es el
  // COLOR, y son dos cosas distintas.
  scale: 2.0,
  curl: 0.9,
  curlScale: 0.8,
  blur: 4.4,
  detail: 0.14,
  detailFall: 1.2,
  grain: 0.01,
  drift: 0.35,

  // ── Y marcado ────────────────────────────────────────────────────────────
  //
  // `gradMix` alto es lo que empuja las crestas del campo a cruzar el escalón
  // de la paleta. Sin él, el campo se queda dentro de un mismo tramo de la
  // rampa y lo que se ve es un degradé con textura; con él, las crestas saltan
  // al tramo luminoso y salen recortadas.
  //
  // `lift` y `gradGamma` deciden CUÁNTAS cruzan: los dos altos dejan pasar solo
  // las más altas, que es lo que hace que sean líneas finas sobre negro en vez
  // de manchas.
  gradAngle: Math.PI / 2,
  gradSpread: 1.15,
  gradGamma: 2.3,
  gradMix: 0.5,
  contrast: 1.3,
  lift: 0.18,
} as const;

// Las líneas de luz las hace ESTA rampa, no los parámetros.
//
// `ramp()` interpola las cinco paradas con `smoothstep` en cuatro tramos
// iguales. Repartidas parejo —como en el hero— el resultado es un degradé
// continuo y las estrías se leen como variaciones suaves dentro de él.
//
// Acá están repartidas a propósito de forma desigual:
//
//   c0 → c1   dos verdes luminosos casi iguales. El tramo entero es luz plana,
//             así que una cresta que llega no se degrada: se ve entera.
//   c1 → c2   el SALTO. De un verde brillante a uno muy oscuro dentro de un
//             solo tramo. Ahí está el borde: cualquier estría que cruce ese
//             umbral aparece recortada, con filo, en vez de desvanecerse.
//   c2 → c4   dos tramos de sombra para lo demás, que es la mayor parte del
//             cuadro.
//
// Es el mismo recurso que una curva de niveles con el punto negro y el blanco
// muy juntos: no cambia la imagen, cambia dónde está el borde. Y por eso el
// fondo puede ser a la vez suave de forma y duro de línea.
//
// La última parada es `#262626` —prácticamente `--ink` (#262626) con una pizca
// de verde— para que el borde del canvas no se note contra el fondo de la
// sección.
const FLOW_PALETTE = ["#00dc8d", "#00dc8d", "#00dc8d", "#00dc8d", "#262626"] as const;

export default function StackFlow({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <HeroFoliage
        className="absolute inset-0 h-full w-full"
        params={FLOW}
        palette={FLOW_PALETTE}
      />

      {/* El velo hace dos cosas a la vez.
      
          Arriba cierra la franja del encabezado y las dos fichas superiores,
          que viven sobre el fondo y no sobre crema.
      
          Y de la mitad para abajo no cae a transparente sino que se queda en un
          piso de 0.3: treinta por ciento de negro encima de todo el cuadro, un
          filtro de densidad neutra. Es lo que garantiza el nivel oscuro
          independientemente de la proporción de la ventana — el degradé del
          shader se mide contra el alto del CAMPO, no del viewport, así que en
          una ventana baja y ancha la misma curva deja más cuadro iluminado. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(16,16,16,0.92) 0%, rgba(16,16,16,0.58) 18%, rgba(16,16,16,0.26) 46%, rgba(16,16,16,0.26) 100%)",
        }}
      />

      {/* El viñeteado. Es lo último y lo más barato del archivo, y es lo que
          hace que el fondo se lea como una superficie con profundidad en vez de
          como una imagen pegada de borde a borde. Muy abierto y muy suave: si
          se nota como óvalo, está mal puesto. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 88% 76% at 50% 62%, rgba(16,16,16,0) 40%, rgba(16,16,16,0.42) 78%, rgba(16,16,16,0.72) 100%)",
        }}
      />
    </div>
  );
}
