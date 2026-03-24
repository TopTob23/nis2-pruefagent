import Field from "../UI/Field";
import Input from "../UI/Input";
import RadioGroup from "../UI/RadioGroup";

export default function StepLieferkette({ data, setField }) {
  const lk = data.lieferkette || {};

  const setLkField = (key, value) => {
    setField("lieferkette", { ...lk, [key]: value });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <span className="text-primary font-label text-xs font-bold tracking-[0.1em] uppercase block mb-2">
          Risikomanagement
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Schritt 7: Lieferkette
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
              value={lk.hatBeziehung || "unbekannt"}
              onChange={(v) => setLkField("hatBeziehung", v)}
            />
          </Field>

          {lk.hatBeziehung === "ja" && (
            <>
              <div className="h-px bg-surface-container-high w-full" />

              <Field label="Sektoren der Kunden">
                <Input
                  value={(lk.kundenSektoren || []).join(", ")}
                  onChange={(v) => setLkField("kundenSektoren", v.split(",").map(s => s.trim()).filter(Boolean))}
                  placeholder="z.B. Energie, Gesundheit"
                />
              </Field>
              <Field label="Welche Leistung erbringen Sie?">
                <Input
                  value={lk.artLeistung || ""}
                  onChange={(v) => setLkField("artLeistung", v)}
                  placeholder="z.B. IT-Betrieb, Software, Managed Services"
                />
              </Field>
              <Field label="Zugriff auf Kunden-IT-Systeme?">
                <RadioGroup
                  options={[
                    ["ja", "Ja"],
                    ["nein", "Nein"],
                  ]}
                  value={lk.itZugriff || "nein"}
                  onChange={(v) => setLkField("itZugriff", v)}
                />
              </Field>
              <Field label="Vertragliche IT-Sicherheitsanforderungen?">
                <Input
                  value={lk.vertraglicheAnforderungen || ""}
                  onChange={(v) => setLkField("vertraglicheAnforderungen", v)}
                  placeholder="z.B. ISO 27001 gefordert"
                />
              </Field>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
