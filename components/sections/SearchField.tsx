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
        className="w-full px-4 py-3 border border-[#CAC8C8] rounded-xl bg-white/80 text-[#101010] placeholder-[#5A5A5A]/60 focus:outline-none focus:border-[#101010] transition-colors"
      />
    </form>
  );
}
