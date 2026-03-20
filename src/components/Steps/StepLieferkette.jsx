import { COLORS } from "../../constants/branding";
import Field from "../UI/Field";
import Input from "../UI/Input";
import RadioGroup from "../UI/RadioGroup";

export default function StepLieferkette({ data, setField }) {
  return (
    <div className="cd">
      <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.TD, marginBottom: 4 }}>
        Lieferkettenbeziehungen
      </h2>
      <p style={{ fontSize: 13, color: "#7a9ca5", marginBottom: 24 }}>
        Indirekte Betroffenheit gem. § 30 Abs. 2 Nr. 4 BSIG
      </p>
      <div style={{ display: "grid", gap: 18 }}>
        <Field label="Geschäftsbeziehungen zu NIS-2-pflichtigen Kunden?">
          <RadioGroup
            options={[
              ["ja", "Ja"],
              ["nein", "Nein"],
              ["unbekannt", "Unbekannt"],
            ]}
            value={data.lieferbeziehung}
            onChange={(v) => setField("lieferbeziehung", v)}
          />
        </Field>
        {data.lieferbeziehung === "ja" && (
          <>
            <Field label="NIS-2-pflichtige Kunden">
              <Input
                value={data.lieferKunden}
                onChange={(v) => setField("lieferKunden", v)}
                placeholder="z.B. Energieversorger, Krankenhaus"
              />
            </Field>
            <Field label="Sektoren der Kunden">
              <Input
                value={data.lieferSektoren}
                onChange={(v) => setField("lieferSektoren", v)}
                placeholder="z.B. Energie, Gesundheit"
              />
            </Field>
            <Field label="Welche Leistung erbringen Sie?">
              <Input
                value={data.lieferLeistung}
                onChange={(v) => setField("lieferLeistung", v)}
                placeholder="z.B. IT-Betrieb, Software"
              />
            </Field>
            <Field label="Zugriff auf Kunden-IT-Systeme?">
              <RadioGroup
                options={[
                  ["ja", "Ja"],
                  ["nein", "Nein"],
                ]}
                value={data.lieferZugriff}
                onChange={(v) => setField("lieferZugriff", v)}
              />
            </Field>
            <Field label="Vertragliche IT-Sicherheitsanforderungen?">
              <RadioGroup
                options={[
                  ["ja", "Ja"],
                  ["nein", "Nein"],
                ]}
                value={data.lieferAnforderungen}
                onChange={(v) => setField("lieferAnforderungen", v)}
              />
            </Field>
          </>
        )}
      </div>
    </div>
  );
}
