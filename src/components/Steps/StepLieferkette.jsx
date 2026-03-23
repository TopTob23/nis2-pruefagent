import Field from "../UI/Field";
import Input from "../UI/Input";
import RadioGroup from "../UI/RadioGroup";

export default function StepLieferkette({ data, setField }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <span className="text-primary font-label text-xs font-bold tracking-[0.1em] uppercase block mb-2">
          Risikomanagement
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Schritt 8: Lieferkette
        </h2>
        <p className="mt-4 text-on-surface-variant max-w-xl text-lg leading-relaxed">
          Bewertung der Abhängigkeiten und Sicherheitsanforderungen Ihrer externen Dienstleister (§ 30 Abs. 2 Nr. 4 BSIG).
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(0,31,38,0.08)] p-8 md:p-12">
        <div className="space-y-10">
          <Field label="Geschäftsbeziehungen zu NIS-2-pflichtigen Kunden?">
            <RadioGroup
              options={[
                ["ja", "Ja, wir sind Zulieferer"],
                ["nein", "Nein, aktuell nicht"],
                ["unbekannt", "Nicht sicher / In Prüfung"],
              ]}
              value={data.lieferbeziehung}
              onChange={(v) => setField("lieferbeziehung", v)}
            />
          </Field>

          {data.lieferbeziehung === "ja" && (
            <>
              <div className="h-px bg-surface-container-high w-full" />

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
                  placeholder="z.B. IT-Betrieb, Software, Managed Services"
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

    </div>
  );
}
