import { COLORS } from "../../constants/branding";
import Field from "../UI/Field";
import Input from "../UI/Input";
import RadioGroup from "../UI/RadioGroup";

export default function StepKonzern({ data, setField }) {
  return (
    <div className="cd">
      <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.TD, marginBottom: 4 }}>
        Konzernangehörigkeit
      </h2>
      <p style={{ fontSize: 13, color: "#7a9ca5", marginBottom: 24 }}>
        Bei Konzernangehörigkeit werden konsolidierte Werte herangezogen
      </p>
      <div style={{ display: "grid", gap: 18 }}>
        <Field label="Gehört die Organisation zu einem Konzern?">
          <RadioGroup
            options={[
              ["ja", "Ja"],
              ["nein", "Nein"],
            ]}
            value={data.konzern}
            onChange={(v) => setField("konzern", v)}
          />
        </Field>
        {data.konzern === "ja" && (
          <>
            <Field label="Konzernname">
              <Input
                value={data.konzernName}
                onChange={(v) => setField("konzernName", v)}
                placeholder="Name des Mutterkonzerns"
              />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <Field label="Konzern-VZÄ">
                <Input
                  type="number"
                  value={data.konzernMA}
                  onChange={(v) => setField("konzernMA", v)}
                />
              </Field>
              <Field label="Konzernumsatz (Mio. €)">
                <Input
                  type="number"
                  step="0.1"
                  value={data.konzernUmsatz}
                  onChange={(v) => setField("konzernUmsatz", v)}
                />
              </Field>
              <Field label="Konzernbilanz (Mio. €)">
                <Input
                  type="number"
                  step="0.1"
                  value={data.konzernBilanz}
                  onChange={(v) => setField("konzernBilanz", v)}
                />
              </Field>
            </div>
            <Field
              label="IT-Systeme unabhängig vom Konzern?"
              hint="Relevant für Unabhängigkeitsklausel"
            >
              <RadioGroup
                options={[
                  ["ja", "Ja"],
                  ["nein", "Nein"],
                  ["unbekannt", "Unbekannt"],
                ]}
                value={data.itUnabhaengig}
                onChange={(v) => setField("itUnabhaengig", v)}
              />
            </Field>
          </>
        )}
      </div>
    </div>
  );
}
