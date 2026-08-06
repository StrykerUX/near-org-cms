// El value va en serif italic a escala display y el label en sans a h3. Ambos
// salen enteros de una utilidad del DS: ni `leading-none` (el token display ya
// trae line-height 1) ni `font-medium` (el token h3 ya trae weight 500).
export default function StatCallout({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="text-display-serif italic">{value}</span>
      <span className="text-h3">{label}</span>
    </p>
  );
}
