export default function StatCallout({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <p className="flex items-baseline gap-2">
      <span className="font-display italic text-display leading-none">{value}</span>
      <span className="font-sans text-h3 font-medium">{label}</span>
    </p>
  );
}
