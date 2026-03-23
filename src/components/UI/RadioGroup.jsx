import { cn } from "../../utils/cn";

export default function RadioGroup({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map(([v, label]) => (
        <label
          key={v}
          className={cn(
            "relative flex items-center p-4 rounded-lg cursor-pointer transition-all border-2",
            value === v
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-surface-container-high bg-surface-container-low hover:bg-surface-container-high"
          )}
          onClick={() => onChange(v)}
        >
          <input
            type="radio"
            className="w-5 h-5 text-primary border-outline-variant focus:ring-primary bg-white"
            checked={value === v}
            readOnly
          />
          <span className="ml-3 font-semibold text-on-surface text-sm">{label}</span>
        </label>
      ))}
    </div>
  );
}
