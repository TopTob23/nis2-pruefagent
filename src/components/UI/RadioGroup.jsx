import { cn } from "../../utils/cn";

export default function RadioGroup({ options, value, onChange }) {
  return (
    <div className="rg">
      {options.map(([v, label]) => (
        <div
          key={v}
          className={cn("rp", value === v && "ra")}
          onClick={() => onChange(v)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
