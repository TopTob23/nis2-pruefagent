import Field from "../UI/Field";
import Input from "../UI/Input";

export default function StepAllgemein({ data, setField }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-10">
        <span className="text-primary font-label text-xs font-bold tracking-widest uppercase mb-2 block">
          Assessment Setup
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Schritt 1: Unternehmensdaten
        </h2>
        <div className="mt-4 h-1 w-24 bg-accent" />
      </div>

      <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-[0px_12px_32px_rgba(0,31,38,0.08)]">
        <div className="space-y-6">
          <Field label="Name der Organisation *">
            <Input
              value={data.orgName}
              onChange={(v) => setField("orgName", v)}
              placeholder="z.B. SITS Security GmbH"
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="bg-surface-container-low p-6 rounded-lg flex gap-4 items-start mt-4">
            <span className="material-symbols-outlined text-primary mt-0.5">info</span>
            <div>
              <p className="text-sm font-medium text-primary">Datenschutzhinweis</p>
              <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                Diese Daten werden ausschließlich zur Identifikation im Rahmen der Prüfung verwendet und nicht an Dritte weitergegeben.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
