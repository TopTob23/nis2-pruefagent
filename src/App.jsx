import { useState, useCallback } from "react";
import { STEP_LABELS } from "./constants/formDefaults";
import { useFormData } from "./hooks/useFormData";
import { useAnalysis } from "./hooks/useAnalysis";
import Header from "./components/Layout/Header";
import MobileNav from "./components/Layout/MobileNav";
import StepIndicator from "./components/Wizard/StepIndicator";
import WelcomePage from "./components/Steps/WelcomePage";
import StepAllgemein from "./components/Steps/StepAllgemein";
import StepTaetigkeit from "./components/Steps/StepTaetigkeit";
import StepGroesse from "./components/Steps/StepGroesse";
import StepOeffentlich from "./components/Steps/StepOeffentlich";
import StepKonzern from "./components/Steps/StepKonzern";
import StepSondermerkmale from "./components/Steps/StepSondermerkmale";
import StepErgaenzungen from "./components/Steps/StepErgaenzungen";
import StepLieferkette from "./components/Steps/StepLieferkette";
import ResultView from "./components/Result/ResultView";

const maxStep = STEP_LABELS.length - 1;

export default function App() {
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { data, setField, toggleArrayItem, mergeData, result } = useFormData();
  const analysis = useAnalysis();

  const handleAnalyze = useCallback(async () => {
    if (!analysis.hasAnySources) {
      setStep(1);
      return;
    }
    const parsed = await analysis.runAnalysis();
    if (parsed) {
      mergeData(parsed);
    }
    setStep(1);
  }, [analysis, mergeData]);

  const renderStep = () => {
    const common = { data, setField, toggleArrayItem };
    switch (step) {
      case 0:
        return <WelcomePage analysis={analysis} />;
      case 1:
        return <StepAllgemein {...common} />;
      case 2:
        return <StepTaetigkeit {...common} />;
      case 3:
        return <StepGroesse {...common} />;
      case 4:
        return <StepOeffentlich {...common} />;
      case 5:
        return <StepKonzern {...common} />;
      case 6:
        return <StepSondermerkmale {...common} />;
      case 7:
        return <StepErgaenzungen {...common} />;
      case 8:
        return <StepLieferkette {...common} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-12 pb-32 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {!showResult && <StepIndicator step={step} onStepClick={setStep} />}

        <div className="fi" key={showResult ? "result" : step}>
          {showResult ? (
            <ResultView
              data={data}
              result={result}
              onEdit={() => {
                setShowResult(false);
                setStep(maxStep);
              }}
            />
          ) : (
            renderStep()
          )}
        </div>

        {/* Navigation Buttons */}
        {!showResult && (
          <div className="max-w-5xl mx-auto mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-surface-container-high">
            <button
              className="flex items-center gap-2 px-8 py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={step === 0 || analysis.loading}
              onClick={() => setStep((x) => x - 1)}
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Zurück
            </button>

            <div className="flex items-center gap-4">
              {step === 0 && (
                <button
                  className="text-primary font-semibold text-sm hover:underline underline-offset-4 decoration-2 decoration-accent flex items-center gap-2"
                  onClick={() => setStep(1)}
                >
                  Ohne Analyse direkt starten
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              )}

              {step === 0 && (
                <button
                  className="px-10 py-4 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={analysis.loading || !analysis.hasAnySources}
                  onClick={handleAnalyze}
                >
                  {analysis.loading ? "Analyse läuft..." : "Analysieren und weiter"}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              )}

              {step > 0 && step < maxStep && (
                <button
                  className="px-10 py-3 rounded-lg bg-primary-container text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary transition-all active:scale-95 flex items-center gap-2"
                  onClick={() => setStep((x) => x + 1)}
                >
                  Weiter
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              )}

              {step === maxStep && (
                <button
                  className="px-10 py-4 bg-accent hover:bg-accent-dark text-primary font-bold rounded-lg shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-lg"
                  onClick={() => {
                    setShowResult(true);
                    setStep(maxStep + 1);
                  }}
                >
                  Ergebnis berechnen
                  <span className="material-symbols-outlined">analytics</span>
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <MobileNav />

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
