import { COLORS } from "../../constants/branding";
import Field from "../UI/Field";
import Input from "../UI/Input";

export default function StepGroesse({ data, setField }) {
  return (
    <div className="cd">
      <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.TD, marginBottom: 4 }}>
        Unternehmensgröße
      </h2>
      <p style={{ fontSize: 13, color: "#7a9ca5", marginBottom: 24 }}>
        Angaben aus dem letzten festgestellten Jahresabschluss
      </p>
      <div style={{ display: "grid", gap: 18 }}>
        <Field
          label="Anzahl Mitarbeiter (VZÄ) *"
          hint="Vollzeitäquivalente gem. KMU-Empfehlung 2003/361/EG"
        >
          <Input
            type="number"
            value={data.mitarbeiter}
            onChange={(v) => setField("mitarbeiter", v)}
            placeholder="z.B. 400"
          />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Jahresumsatz (Mio. EUR)">
            <Input
              type="number"
              step="0.1"
              value={data.umsatz}
              onChange={(v) => setField("umsatz", v)}
              placeholder="z.B. 18.5"
            />
          </Field>
          <Field label="Jahresbilanzsumme (Mio. EUR)">
            <Input
              type="number"
              step="0.1"
              value={data.bilanzsumme}
              onChange={(v) => setField("bilanzsumme", v)}
              placeholder="z.B. 12.0"
            />
          </Field>
        </div>
        <div
          style={{
            background: COLORS.TL,
            borderRadius: 10,
            padding: 16,
            border: `1px solid ${COLORS.TM}`,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.T, marginBottom: 8 }}>
            Schwellenwerte (es genügt EINE Schwelle)
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              fontSize: 12,
              color: "#4a7a84",
            }}
          >
            <div>
              <strong style={{ color: COLORS.T }}>Mittleres Unternehmen:</strong>
              <br />≥ 50 VZÄ ODER Umsatz ≥ 10 Mio. € ODER Bilanz ≥ 10 Mio. €
            </div>
            <div>
              <strong style={{ color: COLORS.T }}>Großes Unternehmen:</strong>
              <br />≥ 250 VZÄ ODER (Umsatz ≥ 50 Mio. € UND Bilanz ≥ 43 Mio. €)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
