import { cn } from "../../utils/cn";

export default function Chip({ active, onClick, variant, children }) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-2 px-5 py-3 rounded-full font-medium text-sm transition-all border-2",
        active && variant !== "remove" && "bg-primary text-white border-primary shadow-md",
        active && variant === "remove" && "bg-error/10 text-error border-error/30",
        !active && "bg-surface-container-highest text-on-surface-variant border-transparent hover:border-outline-variant"
      )}
      onClick={onClick}
    >
      {active && (
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          {variant === "remove" ? "cancel" : "check_circle"}
        </span>
      )}
      {!active && (
        <span className="material-symbols-outlined text-[18px]">add_circle</span>
      )}
      {children}
    </button>
  );
}
