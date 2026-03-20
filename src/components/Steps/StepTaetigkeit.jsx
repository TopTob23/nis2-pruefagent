import { COLORS } from "../../constants/branding";
import { ANLAGE1, ANLAGE2 } from "../../constants/sectors";
import Field from "../UI/Field";
import Input from "../UI/Input";
import Chip from "../UI/Chip";

export default function StepTaetigkeit({ data, setField, toggleArrayItem }) {
  return (
    <div className="cd">
      <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.TD, marginBottom: 4 }}>
        Tätigkeit und Sektorzuordnung
      </h2>
      <p style={{ fontSize: 13, color: "#7a9ca5", marginBottom: 24 }}>
        Ordnen Sie Ihre Tätigkeit den NIS-2-Sektoren zu
      </p>
      <div style={{ display: "grid", gap: 18 }}>
        <Field label="Kurzbeschreibung der Tätigkeit *">
          <textarea
            rows={3}
            value={data.taetigkeit}
            onChange={(e) => setField("taetigkeit", e.target.value)}
            placeholder="Welche Waren/Dienstleistungen bieten Sie an?"
          />
        </Field>
        <Field label="NACE-Code (falls bekannt)">
          <Input
            value={data.naceCode}
            onChange={(v) => setField("naceCode", v)}
            placeholder="z.B. 38.12, 62.01"
          />
        </Field>
        <Field
          label="Sektoren hoher Kritikalität – Anlage 1 BSIG"
          hint="Mehrfachauswahl möglich (Mischsektor)"
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ANLAGE1.map((x) => (
              <Chip
                key={x.id}
                active={data.spiA1.includes(x.id)}
                onClick={() => toggleArrayItem("spiA1", x.id)}
              >
                {x.l}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Sonstige kritische Sektoren – Anlage 2 BSIG">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ANLAGE2.map((x) => (
              <Chip
                key={x.id}
                active={data.spiA2.includes(x.id)}
                onClick={() => toggleArrayItem("spiA2", x.id)}
              >
                {x.l}
              </Chip>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}
