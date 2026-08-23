import H2Count from "@/components/sections/protocol-labs/hero-labs/H2Count";
import KeyRotationField from "@/components/sections/protocol-labs/combo-labs/KeyRotationField";

// El hero H2 · Count con la superficie de rotación de claves detrás.
//
// Tres líneas y un archivo propio en vez de armar el par dentro de la view:
// `ProtocolComboLabView` mapea cada combo a un componente sin props, y meterle un
// caso especial al mapa para uno de los cinco lo convierte en cinco casos el día
// que el segundo tenga fondo.
//
// El hero es el MISMO de `/prototype/protocol-heroes/h2` — se importa, no se
// copia. Lo que agrega esta ruta son dos cosas: lo que va detrás, y el modo
// `peek` del marcador — el hero mide un poco más que la pantalla y las seis
// cifras quedan cortadas por el borde inferior, sin regla ni separadores, a
// opacidad baja, subiendo de a una al scrollear. `/protocol-heroes/h2` sigue con
// la banda entera.
//
// `tone="light"` porque el hero es crema: el campo dibuja en tinta y las cuentas
// en `--green-ink`. La calibración clara no es la oscura con otro color; está
// explicada en `KeyRotationField`.
//
// `pointer-events-none` en el canvas, y no es contradictorio con que la
// superficie responda al puntero: los eventos se escuchan en la SECCIÓN del
// hero, no en el canvas. Si el canvas los capturara, el titular y el CTA que
// tiene encima quedarían fuera de la zona sensible — y el CTA, además, dejaría
// de recibir sus propios clics.
export default function HeroCountRotating() {
  return (
    <H2Count
      proof="peek"
      surface={
        <KeyRotationField
          tone="light"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        />
      }
    />
  );
}
