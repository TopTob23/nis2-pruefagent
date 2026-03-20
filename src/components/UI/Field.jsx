import { COLORS } from "../../constants/branding";

export default function Field({ label, hint, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 500,
          color: COLORS.T,
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <div style={{ fontSize: 12, color: "#7a9ca5", marginTop: 4, lineHeight: 1.4 }}>
          {hint}
        </div>
      )}
    </div>
  );
}
