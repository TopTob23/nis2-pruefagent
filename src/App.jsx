import { useState, useCallback } from "react";
import { STEP_LABELS } from "./constants/formDefaults";
import { useFormData } from "./hooks/useFormData";
import { useAnalysis } from "./hooks/useAnalysis";
import Header from "./components/Layout/Header";
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
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f7f8",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      <Header />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 60px" }}>
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

        {!showResult && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <button
              className="btn bs"
              disabled={step === 0 || analysis.loading}
              onClick={() => setStep((x) => x - 1)}
            >
              ← Zurück
            </button>
            <div style={{ display: "flex", gap: 10 }}>
              {step === 0 && (
                <button className="btn bs" onClick={() => setStep(1)}>
                  Überspringen
                </button>
              )}
              {step === 0 && (
                <button
                  className="btn bl"
                  disabled={analysis.loading || !analysis.hasAnySources}
                  onClick={handleAnalyze}
                >
                  {analysis.loading ? "Analyse läuft..." : "Analysieren und weiter →"}
                </button>
              )}
              {step > 0 && step < maxStep && (
                <button className="btn bp" onClick={() => setStep((x) => x + 1)}>
                  Weiter →
                </button>
              )}
              {step === maxStep && (
                <button
                  className="btn bl"
                  onClick={() => {
                    setShowResult(true);
                    setStep(maxStep + 1);
                  }}
                >
                  Prüfung auswerten →
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
