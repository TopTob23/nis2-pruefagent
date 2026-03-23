import Field from "../UI/Field";
import Input from "../UI/Input";
import RadioGroup from "../UI/RadioGroup";

export default function StepErgaenzungen({ data, setField }) {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto items-start">
      {/* Left: Context */}
      <div className="lg:col-span-5">
        <span className="font-label text-sm tracking-[0.2em] text-primary uppercase font-semibold mb-4 block">
          Cybersecurity Maturity
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary leading-[1.1] tracking-tighter mb-6">
          Schritt 7: Ergänzungen
        </h2>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Angaben zu bestehenden Zertifizierungen, Vorfällen und weiteren relevanten Informationen.
        </p>
      </div>

      {/* Right: Form */}
      <div className="lg:col-span-7">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(0,31,38,0.08)] p-8 md:p-12">
          <div className="space-y-8">
            <Field label="Bestehende Zertifizierungen">
              <Input
                value={data.zertifizierungen}
                onChange={(v) => setField("zertifizierungen", v)}
                placeholder="z.B. ISO 27001, BSI IT-Grundschutz, TISAX"
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
                rows={4}
                value={data.hinweise}
                onChange={(e) => setField("hinweise", e.target.value)}
                placeholder="Geben Sie hier zusätzliche Details zu Ihrer Infrastruktur ein..."
                className="w-full bg-surface-container-highest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/50 min-h-[120px]"
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
