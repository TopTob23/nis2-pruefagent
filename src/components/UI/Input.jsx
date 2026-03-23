export default function Input({ value, onChange, placeholder, type = "text", ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-surface-container-highest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-on-surface-variant/50"
      {...rest}
    />
  );
}
