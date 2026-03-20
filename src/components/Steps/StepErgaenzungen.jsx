import { COLORS } from "../../constants/branding";
import Field from "../UI/Field";
import Input from "../UI/Input";
import RadioGroup from "../UI/RadioGroup";

export default function StepErgaenzungen({ data, setField }) {
  return (
    <div className="cd">
      <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.TD, marginBottom: 4 }}>
        Ergänzende Hinweise
      </h2>
      <div style={{ display: "grid", gap: 18 }}>
        <Field label="Bestehende Zertifizierungen">
          <Input
            value={data.zertifizierungen}
            onChange={(v) => setField("zertifizierungen", v)}
            placeholder="z.B. ISO 27001, BSI IT-Grundschutz"
          />
        </Field>
        <Field label="Gemeldete Sicherheitsvorfälle?">
          <RadioGroup
            options={[
              ["nein", "Nein"],
              ["ja", "Ja"],
            ]}
            value={data.vorfaelle}
            onChange={(v) => setField("vorfaelle", v)}
          />
        </Field>
        <Field label="Sonstige Hinweise">
          <textarea
            rows={3}
            value={data.hinweise}
            onChange={(e) => setField("hinweise", e.target.value)}
            placeholder="Freitext"
          />
        </Field>
      </div>
    </div>
  );
}
