import Field from "../UI/Field";
import RadioGroup from "../UI/RadioGroup";

export default function StepOeffentlich({ data, setField }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-10">
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Schritt 4: Öffentliche Einrichtung
        </h2>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(0,31,38,0.08)] p-8 md:p-12">
        <div className="space-y-8">
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
    </div>
  );
}
