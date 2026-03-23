import { ANLAGE1, ANLAGE2 } from "../../constants/sectors";
import Field from "../UI/Field";
import Input from "../UI/Input";
import Chip from "../UI/Chip";

export default function StepTaetigkeit({ data, setField, toggleArrayItem }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <span className="text-primary font-label text-xs font-bold tracking-widest uppercase mb-2 block">
          Sektorklassifizierung
        </span>
        <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          Schritt 2: Branche & Sektor
        </h2>
        <p className="mt-4 text-on-surface-variant text-lg leading-relaxed max-w-2xl">
          Ordnen Sie Ihre Tätigkeit den NIS-2-Sektoren zu. Diese Information hilft uns, die relevanten Regularien zu identifizieren.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(0,31,38,0.08)] overflow-hidden">
        <div className="p-8 md:p-12 space-y-10">
          <Field label="Kurzbeschreibung der Tätigkeit *">
            <textarea
              rows={3}
              value={data.taetigkeit}
              onChange={(e) => setField("taetigkeit", e.target.value)}
              placeholder="Welche Waren/Dienstleistungen bieten Sie an?"
              className="w-full bg-surface-container-highest border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-on-surface-variant/50"
            />
          </Field>

          <Field label="NACE-Code (falls bekannt)">
            <Input
              value={data.naceCode}
              onChange={(v) => setField("naceCode", v)}
              placeholder="z.B. 38.12, 62.01"
            />
          </Field>

          <div>
            <label className="font-label text-xs font-bold tracking-[0.1em] text-outline mb-4 block uppercase">
              KRITIS Kernsektoren – Anlage 1 BSIG
            </label>
            <div className="flex flex-wrap gap-3">
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
          </div>

          <div>
            <label className="font-label text-xs font-bold tracking-[0.1em] text-outline mb-4 block uppercase">
              Sonstige kritische Sektoren – Anlage 2 BSIG
            </label>
            <div className="flex flex-wrap gap-3">
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
          </div>

          {(data.spiA1.length > 0 || data.spiA2.length > 0) && (
            <div className="bg-surface-container-low rounded-lg p-6 flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Unternehmen in den gewählten Sektoren unterliegen spezifischen Sicherheitsanforderungen. Der Assessment-Katalog wird automatisch angepasst.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
