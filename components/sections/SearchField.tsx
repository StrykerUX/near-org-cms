export type SearchFieldProps = {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
};

export default function SearchField({
  name = "q",
  defaultValue = "",
  placeholder = "Search posts...",
}: SearchFieldProps) {
  return (
    <form method="GET" className="mb-8">
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full px-4 py-3 border border-[#e1e1e1] rounded-xl bg-white/80 text-[#262626] placeholder-[#e1e1e1]/60 focus:outline-none focus:border-[#262626] transition-colors"
      />
    </form>
  );
}
