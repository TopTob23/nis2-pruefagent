import { SONDERMERKMALE } from "../../constants/sectors";
import Chip from "../UI/Chip";

export default function StepSondermerkmale({ data, setField, toggleArrayItem }) {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto items-start">
      {/* Left: Context */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <h2 className="font-headline text-4xl font-extrabold tracking-tight text-primary leading-tight">
          Schritt 6: Besondere Merkmale
        </h2>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Identifizieren Sie spezifische regulatorische Rahmenbedingungen, die für Ihre Sicherheitsbewertung relevant sind.
        </p>
        <div className="bg-surface-container-low p-6 rounded-xl mt-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary">info</span>
            <div>
              <h4 className="font-headline font-bold text-primary mb-1">Warum das wichtig ist</h4>
              <p className="text-sm text-on-surface-variant">
                Bestimmte Merkmale wie KRITIS-Status erfordern spezifische Prüfkriterien – unabhängig von der Unternehmensgröße.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="lg:col-span-8">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_12px_32px_rgba(0,31,38,0.08)] p-8 md:p-10">
          <h3 className="font-headline font-bold text-primary mb-6 text-lg">
            Größenunabhängige Sondermerkmale
          </h3>
          <div className="flex flex-wrap gap-3 mb-8">
            {SONDERMERKMALE.map((x) => (
              <Chip
                key={x.id}
                active={data.sondermerkmale.includes(x.id)}
                variant="remove"
                onClick={() => {
                  toggleArrayItem("sondermerkmale", x.id);
                  setField("keinesSonder", false);
                }}
              >
                {x.l}
              </Chip>
            ))}
          </div>

          <div className="border-t border-surface-container-high pt-6">
            <Chip
              active={data.keinesSonder}
              onClick={() => {
                setField("keinesSonder", !data.keinesSonder);
                setField("sondermerkmale", []);
              }}
            >
              Keines der genannten Merkmale
            </Chip>
          </div>
        </div>
      </div>
    </div>
  );
}
