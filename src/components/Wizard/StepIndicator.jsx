import { COLORS } from "../../constants/branding";
import { STEP_LABELS } from "../../constants/formDefaults";
import { cn } from "../../utils/cn";

export default function StepIndicator({ step, onStepClick }) {
  const maxStep = STEP_LABELS.length - 1;

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginBottom: 12,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {STEP_LABELS.map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div
              className={cn("dt", i < step ? "dd" : i === step ? "dc" : "df")}
              onClick={() => onStepClick(i)}
              title={label}
            >
              {i < step ? "✓" : i + 1}
            </div>
            {i < maxStep && (
              <div
                style={{
                  width: 20,
                  height: 2,
                  background: i < step ? COLORS.T : COLORS.TM,
                  borderRadius: 1,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="pg">
        <div
          className="pf"
          style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ fontSize: 13, color: COLORS.T, fontWeight: 500 }}>
          {step === 0 ? "Willkommen" : `Block ${step}: ${STEP_LABELS[step]}`}
        </span>
        <span style={{ fontSize: 12, color: "#7a9ca5" }}>
          {step} / {STEP_LABELS.length - 1}
        </span>
      </div>
    </div>
  );
}
