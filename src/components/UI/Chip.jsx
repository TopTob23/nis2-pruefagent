import { cn } from "../../utils/cn";

/**
 * @param {Object} props
 * @param {boolean} props.active - Ob der Chip ausgewählt ist
 * @param {function} props.onClick
 * @param {"remove"|"add"} [props.variant] - "remove" = rot, default = grün/petrol
 * @param {React.ReactNode} props.children
 */
export default function Chip({ active, onClick, variant, children }) {
  return (
    <div
      className={cn("ch", active && (variant === "remove" ? "chr" : "cha"))}
      onClick={onClick}
    >
      {active && <span style={{ marginRight: 4 }}>{variant === "remove" ? "☒" : "✓"}</span>}
      {children}
    </div>
  );
}
