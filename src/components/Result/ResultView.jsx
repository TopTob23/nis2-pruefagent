import { COLORS } from "../../constants/branding";
import { getSektorNamen } from "../../logic/prueflogik";

export default function ResultView({ data, result, onEdit }) {
  const r = result;
  const sektorNamen = getSektorNamen(data.spiA1, data.spiA2);

  const ampelBg =
    r.p === "JA"
      ? "linear-gradient(135deg,#fef2f2,#fee2e2)"
      : r.p === "NEIN"
        ? `linear-gradient(135deg,${COLORS.TL},#d0ece8)`
        : `linear-gradient(135deg,${COLORS.LL},#fef3c7)`;

  const ampelBorder =
    r.p === "JA" ? "#c0392b" : r.p === "NEIN" ? COLORS.T : COLORS.LD;

  const ampelTextColor =
    r.p === "JA" ? "#991b1b" : r.p === "NEIN" ? COLORS.T : "#92400e";

  const ampelValueColor =
    r.p === "JA" ? "#c0392b" : r.p === "NEIN" ? COLORS.T : COLORS.LD;

  return (
    <div>
      {/* Ampel-Box */}
      <div
        style={{
          padding: 28,
          borderRadius: 14,
          textAlign: "center",
          marginBottom: 24,
          background: ampelBg,
          border: `2px solid ${ampelBorder}`,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: ampelTextColor,
            textTransform: "uppercase",
            letterSpacing: ".05em",
            marginBottom: 4,
          }}
        >
          NIS-2-Pflicht
        </div>
        <div style={{ fontSize: 36, fontWeight: 600, color: ampelValueColor }}>
          {r.p}
        </div>
        {r.p !== "NEIN" && (
          <div style={{ fontSize: 16, color: "#4a5568", marginTop: 4 }}>{r.k}</div>
        )}
      </div>

      {/* Detail-Tabelle */}
      <div className="cd">
        <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.TD, marginBottom: 16 }}>
          Prüfergebnis im Detail
        </h3>
        <table className="rt">
          <tbody>
            <tr>
              <td>S1: Sondermerkmale</td>
              <td>
                {r.hs ? (
                  <span style={{ color: "#c0392b", fontWeight: 500 }}>Ja</span>
                ) : (
                  <span style={{ color: COLORS.T }}>Kein Sondermerkmal</span>
                )}
              </td>
            </tr>
            <tr>
              <td>S2: Sektorzuordnung</td>
              <td>
                {r.h1 && (
                  <span
                    style={{
                      background: "#fef2f2",
                      color: "#991b1b",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      marginRight: 6,
                    }}
                  >
                    Anlage 1
                  </span>
                )}
                {r.h2 && (
                  <span
                    style={{
                      background: COLORS.LL,
                      color: COLORS.LD,
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      marginRight: 6,
                    }}
                  >
                    Anlage 2
                  </span>
                )}
                {!r.h1 && !r.h2 && (
                  <span style={{ color: "#9ca3af" }}>Kein NIS-2-Sektor</span>
                )}
                {(r.h1 || r.h2) && (
                  <span
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      display: "block",
                      marginTop: 4,
                    }}
                  >
                    {sektorNamen.join(", ")}
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>S3: Größenklasse</td>
              <td>
                <span style={{ fontWeight: 500 }}>
                  {r.gr
                    ? "Großes Unternehmen"
                    : r.mi
                      ? "Mittleres Unternehmen"
                      : "Klein-/Kleinstunternehmen"}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    display: "block",
                    marginTop: 2,
                  }}
                >
                  {r.ma > 0 ? `${Math.round(r.ma)} VZÄ` : "VZÄ: k.A."}
                  {r.um > 0 ? ` · ${r.um} Mio. € Umsatz` : ""}
                  {r.bi > 0 ? ` · ${r.bi} Mio. € Bilanz` : ""}
                  {data.konzern === "ja" ? " (kons.)" : ""}
                </span>
              </td>
            </tr>
            <tr>
              <td>S4: Einrichtungsklasse</td>
              <td style={{ fontWeight: 500 }}>{r.k}</td>
            </tr>
            <tr>
              <td>S5: Grenzfall?</td>
              <td>
                {r.p === "GRENZFALL" ? (
                  <span style={{ color: COLORS.LD, fontWeight: 500 }}>Ja</span>
                ) : (
                  <span style={{ color: COLORS.T }}>Nein</span>
                )}
              </td>
            </tr>
            {r.rg && (
              <tr>
                <td>Rechtsgrundlage</td>
                <td style={{ fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
                  {r.rg}
                </td>
              </tr>
            )}
            <tr>
              <td>Indirekte Betroffenheit</td>
              <td>
                {data.lieferbeziehung === "ja" ? (
                  <span
                    style={{
                      color: r.lr === "HOCH" ? "#c0392b" : COLORS.LD,
                      fontWeight: 500,
                    }}
                  >
                    Risiko: {r.lr}
                  </span>
                ) : data.lieferbeziehung === "unbekannt" ? (
                  <span style={{ color: "#9ca3af" }}>Nicht bewertet</span>
                ) : (
                  <span style={{ color: "#6b7280" }}>
                    Keine relevanten Lieferbeziehungen
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Handlungsempfehlungen */}
      <div className="cd">
        <h3 style={{ fontSize: 16, fontWeight: 600, color: COLORS.TD, marginBottom: 16 }}>
          {r.p === "JA"
            ? "Handlungsbedarf"
            : r.p === "GRENZFALL"
              ? "Vertiefte Prüfung"
              : "Empfehlung"}
        </h3>
        {r.p === "JA" && (
          <div style={{ display: "grid", gap: 10 }}>
            {[
              "Registrierung beim BSI bis spätestens 06.03.2026 (Bußgeld: bis 500.000 €)",
              "GAP-Analyse gegen § 30 BSIG durchführen",
              "ISMS aufbauen (ISO 27001 / BSI IT-Grundschutz)",
              "Incident-Response mit 24/72h-Meldefristen (§ 32 BSIG)",
              "Geschäftsleitung: Cybersicherheits-Schulung (§ 38 BSIG-E)",
              "Dokumentation mit Managementbeschluss sicherstellen",
            ].map((text, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#4a5568",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    background: COLORS.L,
                    flexShrink: 0,
                  }}
                />
                <span>{text}</span>
              </div>
            ))}
          </div>
        )}
        {r.p === "NEIN" && (
          <p style={{ fontSize: 13, lineHeight: 1.8, color: "#4a5568" }}>
            Nach aktuellem Stand keine NIS-2-Pflicht. Empfehlung: Jährlich wiederholen,
            Prüfprozess dokumentieren, freiwillige Maßnahmen prüfen.
          </p>
        )}
        {r.p === "GRENZFALL" && (
          <p style={{ fontSize: 13, lineHeight: 1.8, color: "#4a5568" }}>
            Schwellenwerte nahe der Grenze. Dringend: Rechtsberater einbinden, Kennzahlen
            exakt ermitteln, im Zweifel vorsorglich registrieren.
          </p>
        )}
      </div>

      {/* Rechtshinweis */}
      <div
        style={{
          background: COLORS.LL,
          border: `1px solid ${COLORS.L}`,
          borderRadius: 12,
          padding: 20,
          fontSize: 12,
          lineHeight: 1.7,
          color: "#5a5a00",
        }}
      >
        <strong>Rechtlicher Hinweis:</strong> Automatisiert erstellt durch den NIS-2
        Prüfagenten der SITS GmbH. Keine Rechtsberatung. Rechtlich nicht bindend. Bei
        Grenzfällen Rechtsberater einbinden.
        <div style={{ marginTop: 8, color: "#7a7a00", fontSize: 11 }}>
          Status: Vorläufig · v2.0 · NIS-2 Prüfagent | SITS GmbH
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button className="btn bs" onClick={onEdit}>
          ← Bearbeiten
        </button>
        <button className="btn bp" onClick={() => window.print()}>
          Drucken / PDF
        </button>
      </div>
    </div>
  );
}
