import MediaFrame from "@/components/primitives/MediaFrame";

// La celda del directorio: un logo servido, o su hueco declarado.
//
// Es un duplicado deliberado de `foundation/EcosystemMark`, no un import. Las
// dos resuelven lo mismo —wordmark que no se puede recortar, hueco que lleva su
// encargo— pero sobre fondos distintos y a proporciones distintas, y la de allá
// vive en una marquesina que corre. Compartirlas obligaría a un componente con
// cuatro props de variante para que cada página apague lo que no usa, que es
// peor que dos archivos de veinte líneas.
//
// `object-scale-down` y no `object-cover`: estos son WORDMARKS. Un recorte al
// tercio central de «Rainbow Bridge» no es un logo, es un error. Y `contain`
// tampoco — agranda una marca chica hasta que se ve blanda.

export type MarkCellProps = {
  name: string;
  /** El logo, si existe. Sin él la celda queda reservada con su encargo. */
  src?: string;
};

export default function MarkCell({ name, src }: MarkCellProps) {
  if (!src) {
    return (
      // El encargo va en UNA línea por lado, y no es una preferencia: a 5/2 la
      // celda mide ~150px de alto, y un `label` de dos renglones más su `spec`
      // ocupan casi la mitad de la caja — el pie deja de leerse como el pie de
      // un plano y se lee como el contenido. «Ref Finance» + «Wordmark · SVG»
      // dice exactamente lo mismo que «Ref Finance — wordmark» +
      // «Monochrome SVG», en la mitad del espacio.
      <MediaFrame label={name} spec="Wordmark · SVG" ratio="5/2" tone="light" />
    );
  }

  return (
    <div className="flex aspect-[5/2] items-center justify-center rounded-[1.25rem] bg-background px-6">
      {/* eslint-disable-next-line @next/next/no-img-element -- wordmark local de
          tamaño conocido; `next/image` con `fill` acá pediría un contenedor
          posicionado y no aporta nada sobre un PNG de 111×24 en public/. */}
      <img src={src} alt={name} className="max-h-10 w-auto max-w-full object-scale-down" />
    </div>
  );
}
