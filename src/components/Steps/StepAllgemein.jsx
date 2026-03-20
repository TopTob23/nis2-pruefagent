import { COLORS } from "../../constants/branding";
import Field from "../UI/Field";
import Input from "../UI/Input";

export default function StepAllgemein({ data, setField }) {
  return (
    <div className="cd">
      <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.TD, marginBottom: 4 }}>
        Allgemeine Angaben
      </h2>
      <p style={{ fontSize: 13, color: "#7a9ca5", marginBottom: 24 }}>
        Grundlegende Informationen zur Organisation
      </p>
      <div style={{ display: "grid", gap: 18 }}>
        <Field label="Name der Organisation *">
          <Input
            value={data.orgName}
            onChange={(v) => setField("orgName", v)}
            placeholder="z.B. Muster GmbH"
          />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Rechtsform">
            <Input
              value={data.rechtsform}
              onChange={(v) => setField("rechtsform", v)}
              placeholder="z.B. GmbH, AG, KG"
            />
          </Field>
          <Field label="Bundesland / Sitz">
            <Input
              value={data.bundesland}
              onChange={(v) => setField("bundesland", v)}
              placeholder="z.B. Bayern, München"
            />
          </Field>
        </div>
        <Field label="Ansprechpartner">
          <Input
            value={data.ansprechpartner}
            onChange={(v) => setField("ansprechpartner", v)}
            placeholder="Name, Funktion"
          />
        </Field>
      </div>
    </div>
  );
}
