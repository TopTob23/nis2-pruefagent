import { STEP_LABELS } from "../../constants/formDefaults";
import { cn } from "../../utils/cn";

export default function StepIndicator({ step, onStepClick }) {
  const maxStep = STEP_LABELS.length - 1;

  return (
    <div className="flex flex-col items-center mb-12">
      <div className="flex items-center gap-3 mb-3">
        {STEP_LABELS.map((label, i) => (
          <div
            key={i}
            className={cn(
              "rounded-full transition-all cursor-pointer",
              i < step && "w-3 h-3 bg-primary-container",
              i === step && "w-4 h-4 bg-accent ring-4 ring-[#D8D800]/20",
              i > step && "w-3 h-3 bg-surface-container-highest"
            )}
            onClick={() => onStepClick(i)}
            title={label}
          />
        ))}
      </div>
      <span className="font-label text-xs font-bold tracking-[0.1em] text-on-surface-variant uppercase">
        {step === 0 ? "Assessment Setup" : `Schritt ${step} von ${maxStep}`}
      </span>
    </div>
  );
}
