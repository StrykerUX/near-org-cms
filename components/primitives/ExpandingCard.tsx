// Card que crece horizontalmente al pasar el mouse — mecánica firma de
// "Why it matters" en el estilo Ondo (y su híbrido institucional-amigable).
// Puro CSS, sin JS: 3 de estas en un `flex` ganan espacio del resto vía
// `flex-grow` en hover, así que no hace falta estado ni "use client".
export type ExpandingCardProps = {
  title: string;
  body: string;
  className?: string;
};

export default function ExpandingCard({ title, body, className = "" }: ExpandingCardProps) {
  return (
    <div
      className={`flex-1 basis-0 rounded-3xl p-8 transition-[flex-grow] duration-500 ease-out hover:flex-[1.6] ${className}`}
    >
      <h3 className="text-h3-serif italic text-pretty">{title}</h3>
      <p className="mt-4 text-body text-pretty">{body}</p>
    </div>
  );
}
