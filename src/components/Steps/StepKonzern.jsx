import Field from "../UI/Field";
import Input from "../UI/Input";
import RadioGroup from "../UI/RadioGroup";

export default function StepKonzern({ data, setField }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-10">
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Schritt 5: Konzernzugehörigkeit
        </h2>
        <p className="mt-4 text-on-surface-variant text-lg leading-relaxed">
          Bei Konzernangehörigkeit werden konsolidierte Werte herangezogen.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(0,31,38,0.08)] p-8 md:p-12">
        {/* Decorative left border */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-container to-accent rounded-full -ml-8 hidden md:block" />

          <div className="space-y-8">
            <Field label="Gehört die Organisation zu einem Konzern?">
              <RadioGroup
                options={[
                  ["ja", "Ja, gehört einem Konzern an"],
                  ["nein", "Nein, eigenständig"],
                ]}
                value={data.konzern}
                onChange={(v) => setField("konzern", v)}
              />
            </Field>

            {data.konzern === "ja" && (
              <>
                <Field label="Name des Mutterunternehmens">
                  <Input
                    value={data.konzernName}
                    onChange={(v) => setField("konzernName", v)}
                    placeholder="z.B. Global Cyber Solutions Holding"
                  />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Konzern-Mitarbeiter">
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
                <Field label="IT-Systeme unabhängig vom Konzern?" hint="Relevant für Unabhängigkeitsklausel">
                  <RadioGroup
                    options={[
                      ["ja", "Ja"],
                      ["nein", "Nein"],
                      ["unbekannt", "Nicht sicher / In Prüfung"],
                    ]}
                    value={data.itUnabhaengig}
                    onChange={(v) => setField("itUnabhaengig", v)}
                  />
                </Field>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-on-surface-variant/60 text-xs">
        Ihre Daten werden nach höchsten Sicherheitsstandards (ISO 27001) verschlüsselt verarbeitet.
      </p>
    </div>
  );
}
