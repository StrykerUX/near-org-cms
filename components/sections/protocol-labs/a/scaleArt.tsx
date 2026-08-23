import { IsoFrame, isoAt, plane, type Iso } from "@/components/sections/protocol-labs/isoKit";

// El arte de las tres cards de «Built for AI scale».
//
// ── Por qué existe ────────────────────────────────────────────────────────
//
// Las cards copian el objeto de «Own Your Own» en la home, y ese objeto tiene
// tres partes: un panel con arte, un título y un cuerpo. Allá el arte son PNG
// propios; acá no hay assets, así que se dibuja — y el lenguaje ya está
// decidido, es el eje isométrico de `isoKit` que gobierna toda la página.
//
// El motivo de que sean tres figuras y no tres veces la misma es el mismo por el
// que la home tiene cuatro ilustraciones distintas: una card cuyo arte no dice
// nada de su título es una card con un adorno arriba.
//
// ── El vocabulario: marcos apilados ───────────────────────────────────────
//
// Las tres son variaciones de una sola idea —planos cuadrados huecos, apilados
// en profundidad, con el de arriba encendido en verde— que es exactamente la
// figura de la card «Data» de la home. Se toma prestada a propósito: repetir el
// vocabulario es lo que hace que dos páginas se lean como el mismo sitio.
//
// Lo que cambia entre las tres es lo que cada una le hace a la pila, y ahí es
// donde entra el contenido:
//
//   · **Sharding** — la pila CRECE. Cuatro niveles en vez de tres, y el de más
//     abajo asomando apenas: «more shards, more throughput».
//   · **Confidential** — uno de los planos está LLENO. Los demás dejan ver a
//     través; ése no. Es el shard privado dicho con la única herramienta que
//     tiene un dibujo: negarle al ojo lo que les da a los otros.
//   · **Quantum** — el plano de arriba está GIRADO respecto de la pila. La
//     estructura es la misma y la orientación cambió: «upgrading takes a single
//     key rotation», las cuentas quietas y la criptografía rotada.
//
// ── El grosor del plano verde es un truco, y se declara ───────────────────
//
// No es geometría: son dos marcos idénticos a alturas distintas, el de abajo en
// verde profundo. Un prisma hueco de verdad son doce caras con sus normales, y
// a este tamaño la diferencia con dos marcos superpuestos no se ve. Lo que sí se
// vería es el coste de mantener esa geometría cada vez que alguien mueva un
// nivel.

const iso = isoAt(120, 104);

// Un marco: el plano exterior y el interior en un solo path. Con
// `fillRule="evenodd"` el segundo perfora al primero, que es lo que lo convierte
// en marco en vez de en dos cuadrados uno encima del otro.
const frame = (i: Iso, half: number, inner: number, z: number) =>
  `${plane(i, half, z)} ${plane(i, inner, z)}`;

// El mismo marco girado 45°: en proyección isométrica, un cuadrado apoyado sobre
// sus vértices en vez de sobre sus lados. No hay rotación de matriz — se dibujan
// otros cuatro puntos, que es más barato y más legible que rotar el path.
const turned = (i: Iso, r: number, inner: number, z: number) =>
  `M ${i(-r, 0, z)} L ${i(0, -r, z)} L ${i(r, 0, z)} L ${i(0, r, z)} Z ` +
  `M ${i(-inner, 0, z)} L ${i(0, -inner, z)} L ${i(inner, 0, z)} L ${i(0, inner, z)} Z`;

const HALF = 44;
const INNER = 27;
// Separación vertical entre niveles de la pila.
const STEP = 21;
// Grosor aparente del plano encendido.
const LIFT = 4;

/** El plano encendido: cara superior en lima y su canto en verde profundo. */
function LitPlane({ z, d }: { z: number; d?: string }) {
  const top = d ?? frame(iso, HALF, INNER, z);
  const under = d
    ? turned(iso, HALF, INNER, z - LIFT)
    : frame(iso, HALF, INNER, z - LIFT);
  return (
    <>
      <path d={under} fillRule="evenodd" className="fill-cta-deep stroke-none" />
      <path d={top} fillRule="evenodd" className="fill-cta-lime stroke-none" />
    </>
  );
}

/** Un plano de la pila, en hairline. */
function WirePlane({ z }: { z: number }) {
  return (
    <path
      d={frame(iso, HALF, INNER, z)}
      fillRule="evenodd"
      fill="none"
      className="stroke-ink/45"
    />
  );
}

export function ShardingArt() {
  return (
    <IsoFrame viewBox="0 0 240 190" className="h-full w-full">
      {/* Cuatro niveles, de abajo hacia arriba. El más bajo va más apagado: la
          pila sigue hacia abajo fuera del encuadre, que es lo que dice que puede
          seguir creciendo. */}
      <path
        d={frame(iso, HALF, INNER, 0)}
        fillRule="evenodd"
        fill="none"
        className="stroke-ink/20"
      />
      <WirePlane z={STEP} />
      <WirePlane z={STEP * 2} />
      <LitPlane z={STEP * 3} />
    </IsoFrame>
  );
}

export function ConfidentialArt() {
  return (
    <IsoFrame viewBox="0 0 240 190" className="h-full w-full">
      <WirePlane z={0} />
      {/* El plano lleno. No es un marco: es un plano macizo, y por eso es el
          único de la pila cuyo interior no se puede mirar. */}
      <path d={plane(iso, HALF, STEP)} className="fill-ink/12 stroke-ink/45" />
      <LitPlane z={STEP * 2} />
    </IsoFrame>
  );
}

export function QuantumArt() {
  return (
    <IsoFrame viewBox="0 0 240 190" className="h-full w-full">
      <WirePlane z={0} />
      <WirePlane z={STEP} />
      {/* Girado, y a un radio algo mayor para que sus vértices sobresalgan de la
          pila: si cupiera dentro de la silueta, el giro no se vería. */}
      <LitPlane z={STEP * 2} d={turned(iso, HALF + 8, INNER + 5, STEP * 2)} />
    </IsoFrame>
  );
}

export const SCALE_ART = [ShardingArt, ConfidentialArt, QuantumArt];
