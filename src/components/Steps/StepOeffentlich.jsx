import { COLORS } from "../../constants/branding";
import Field from "../UI/Field";
import RadioGroup from "../UI/RadioGroup";

export default function StepOeffentlich({ data, setField }) {
  return (
    <div className="cd">
      <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.TD, marginBottom: 4 }}>
        Öffentliche Einrichtung
      </h2>
      <div style={{ display: "grid", gap: 18 }}>
        <Field label="Öffentliche Einrichtung?">
          <RadioGroup
            options={[
              ["ja", "Ja"],
              ["nein", "Nein"],
              ["teilweise", "Teilweise"],
            ]}
            value={data.oeffentlich}
            onChange={(v) => setField("oeffentlich", v)}
          />
        </Field>
        {data.oeffentlich !== "nein" && (
          <Field
            label="Ebene"
            hint='Sektor „Öffentl. Verwaltung" (Anlage 1) erfasst nur Bundesebene'
          >
            <RadioGroup
              options={[
                ["Bundesebene", "Bundesebene"],
                ["Landesebene", "Landesebene"],
                ["Kommunal", "Kommunal"],
              ]}
              value={data.oeffentlichEbene}
              onChange={(v) => setField("oeffentlichEbene", v)}
            />
          </Field>
        )}
      </div>
    </div>
  );
}
