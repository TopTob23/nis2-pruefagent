import Field from "../UI/Field";
import Input from "../UI/Input";

export default function StepGroesse({ data, setField }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-10">
        <span className="text-primary font-label text-xs font-bold tracking-widest uppercase mb-2 block">
          Unternehmensanalyse
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Schritt 3: Unternehmensgröße
        </h2>
        <p className="mt-4 text-on-surface-variant text-lg leading-relaxed max-w-xl">
          Angaben aus dem letzten festgestellten Jahresabschluss. Basis für die Größenklassifizierung nach EU 2003/361/EG.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(0,31,38,0.08)] p-8 md:p-12">
        <div className="space-y-10">
          <section>
            <h3 className="font-label text-xs font-bold tracking-widest text-primary uppercase mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">groups</span>
              Mitarbeiteranzahl (Vollzeitäquivalente)
            </h3>
            <Field
              label="Anzahl Mitarbeiter *"
              hint="Vollzeitäquivalente gem. KMU-Empfehlung 2003/361/EG"
            >
              <Input
                type="number"
                value={data.mitarbeiter}
                onChange={(v) => setField("mitarbeiter", v)}
                placeholder="z.B. 400"
              />
            </Field>
          </section>

          <section>
            <h3 className="font-label text-xs font-bold tracking-widest text-primary uppercase mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">payments</span>
              Jahresumsatz & Bilanzsumme
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Jahresumsatz (Mio. EUR)">
                <Input
                  type="number"
                  step="0.1"
                  value={data.umsatz}
                  onChange={(v) => setField("umsatz", v)}
                  placeholder="z.B. 18.5"
                />
              </Field>
              <Field label="Jahresbilanzsumme (Mio. EUR)">
                <Input
                  type="number"
                  step="0.1"
                  value={data.bilanzsumme}
                  onChange={(v) => setField("bilanzsumme", v)}
                  placeholder="z.B. 12.0"
                />
              </Field>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
