import { COLORS, LOGO } from "../../constants/branding";

export default function Header() {
  return (
    <header style={{ background: COLORS.T, padding: "0 24px" }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src={LOGO} alt="SITS" style={{ height: 34 }} />
          <div style={{ width: 1, height: 28, background: "#ffffff30" }} />
          <span style={{ color: "#fff", fontWeight: 500, fontSize: 15 }}>NIS-2 Prüfagent</span>
          <span
            style={{ color: "#ffffff60", fontSize: 12, fontFamily: "'DM Mono', monospace" }}
          >
            v2.0
          </span>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 6,
            padding: "4px 10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img src={LOGO} alt="SITS" style={{ height: 24 }} />
        </div>
      </div>
    </header>
  );
}
