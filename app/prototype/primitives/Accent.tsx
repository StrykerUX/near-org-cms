export default function Accent({
  display,
  children,
}: {
  display?: boolean;
  children: string;
}) {
  return (
    <span
      className={`${display ? "font-display" : "font-serif"} italic tracking-normal text-[1.18em]`}
    >
      {children}
    </span>
  );
}
