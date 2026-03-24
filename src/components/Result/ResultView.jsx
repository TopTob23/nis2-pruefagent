import { getSektorNamen } from "../../logic/prueflogik";

export default function ResultView({ data, result, onEdit }) {
  const e = result.ergebnis;
  const schritte = result.schritte;
  const sektorNamen = getSektorNamen(data.spiA1_ids, data.spiA2_ids);

  const isJa = e.pflicht === "JA";
  const isNein = e.pflicht === "NEIN";
  const isGrenz = e.pflicht === "GRENZFALL";

  const statusIcon = isJa ? "gpp_bad" : isNein ? "verified_user" : "gpp_maybe";
  const statusLabel = isJa ? "BETROFFEN" : isNein ? "NICHT BETROFFEN" : "GRENZFALL";
  const statusColor = isJa ? "text-error" : isNein ? "text-primary" : "text-secondary";

  // Sector assignment info
  const hatA1 = (data.spiA1_ids || []).length > 0;
  const hatA2 = (data.spiA2_ids || []).length > 0;
  const hatSonder = (data.sondermerkmale || []).length > 0;

  // Groesse info from schritte
  const groesse = schritte?.groesse;
  const kennzahlen = groesse ? {
    ma: groesse.ma !== null ? `${Math.round(groesse.ma)} Mitarbeiter` : "nicht angegeben",
    um: groesse.umsatz !== null ? `${groesse.umsatz} Mio. €` : "nicht angegeben",
    bi: groesse.bilanz !== null ? `${groesse.bilanz} Mio. €` : "nicht angegeben",
    konsolidiert: groesse.basis === "konsolidiert (Konzern)",
  } : null;

  // NIS-2 threshold info
  let nis2Schwelle = null;
  if (e.klasseLabel?.includes("Besonders wichtige") || e.klasse === "bwE" || e.klasse === "KRITIS/bwE") {
    nis2Schwelle = "Besonders wichtige Einrichtung: ≥ 250 Mitarbeiter ODER (Umsatz > 50 Mio. € UND Bilanz > 43 Mio. €)";
  } else if (e.klasseLabel?.includes("Wichtige") || e.klasse === "wE") {
    nis2Schwelle = "Wichtige Einrichtung: ≥ 50 Mitarbeiter ODER (Umsatz > 10 Mio. € UND Bilanz > 10 Mio. €)";
  }

  // Indirekte Betroffenheit
  const lk = schritte?.lieferkette;
  const lkBeziehung = data.lieferkette?.hatBeziehung;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Print-only Header */}
      <div className="print-header">
        <img src="/sits logo.png" alt="SITS Group" style={{ height: 36 }} />
        <div>
          <div style={{ fontSize: "16pt", fontWeight: 800, color: "#005868", fontFamily: "Manrope, sans-serif" }}>
            NIS-2 Betroffenheitsprüfung
          </div>
          <div style={{ fontSize: "9pt", color: "#70797c" }}>
            {data.orgName || "Unternehmen"} · Erstellt am {new Date().toLocaleDateString("de-DE")} · SITS Group
          </div>
        </div>
      </div>

      {/* Result Header */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Status Indicator */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-primary/5 flex items-center justify-center relative border border-primary/10">
              <div className="absolute inset-3 md:inset-4 rounded-full border border-dashed border-primary/20" />
              <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-white flex flex-col items-center justify-center shadow-lg shadow-primary/5 border border-primary/10 z-10">
                <span
                  className={`material-symbols-outlined text-3xl md:text-5xl mb-1 md:mb-2 ${statusColor}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {statusIcon}
                </span>
                <span className={`${isJa ? "bg-error" : isNein ? "bg-primary" : "bg-secondary"} text-white px-2 md:px-3 py-0.5 rounded text-[10px] md:text-xs font-bold tracking-widest`}>
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-label font-semibold text-primary uppercase tracking-widest">
                Prüfergebnis
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight leading-tight font-headline">
              {isNein ? "Nicht erfasst" : e.klasseLabel}
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
              {isJa && "Basierend auf Ihren Angaben erfüllt Ihr Unternehmen die Kriterien gemäß BSIG in Verbindung mit der NIS-2-Richtlinie. Eine Registrierung beim BSI ist zwingend erforderlich."}
              {isNein && "Nach aktuellem Stand fällt Ihr Unternehmen nicht unter die NIS-2-Richtlinie. Wir empfehlen eine jährliche Wiederholung der Prüfung."}
              {isGrenz && "Die Schwellenwerte liegen nahe der Grenze. Eine vertiefte Prüfung durch einen Rechtsberater wird dringend empfohlen."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detail Table + Recommendations */}
        <div className="lg:col-span-2 space-y-8">
          {/* Analyse-Details */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 font-headline">
              <span className="material-symbols-outlined text-primary">fact_check</span>
              Analyse-Details
            </h3>
            <div className="divide-y divide-surface-container-high">
              <DetailRow label="Einrichtungstyp" value={e.klasseLabel || "Nicht erfasst"} />
              <DetailRow
                label="Sektorzuordnung"
                value={
                  <span className="flex flex-wrap gap-2">
                    {hatA1 && <span className="bg-error/10 text-error px-2 py-0.5 rounded text-xs font-medium">Anlage 1</span>}
                    {hatA2 && <span className="bg-accent/20 text-secondary px-2 py-0.5 rounded text-xs font-medium">Anlage 2</span>}
                    {!hatA1 && !hatA2 && <span className="text-outline">Kein NIS-2-Sektor</span>}
                  </span>
                }
                sub={(hatA1 || hatA2) ? sektorNamen.join(", ") : undefined}
              />
              <DetailRow
                label="Sondermerkmale"
                value={hatSonder ? <span className="text-error font-semibold">Ja</span> : "Kein Sondermerkmal"}
              />
              {nis2Schwelle && (
                <DetailRow
                  label="NIS-2-Schwelle"
                  value={
                    <span className="flex items-center gap-2">
                      <span className={`font-bold ${isJa ? "text-error" : isGrenz ? "text-secondary" : "text-primary"}`}>
                        {isJa ? "Erfüllt" : isGrenz ? "Grenzbereich" : "Nicht erfüllt"}
                      </span>
                      {isJa && <span className="material-symbols-outlined text-error text-sm">check_circle</span>}
                    </span>
                  }
                  sub={nis2Schwelle}
                />
              )}
              {kennzahlen && (
                <DetailRow
                  label="Unternehmensdaten"
                  value={
                    <span className="text-sm">
                      Mitarbeiter: <strong>{kennzahlen.ma}</strong>
                      {" · "}Umsatz: <strong>{kennzahlen.um}</strong>
                      {" · "}Bilanz: <strong>{kennzahlen.bi}</strong>
                      {kennzahlen.konsolidiert && <span className="text-outline ml-1">(konsolidiert)</span>}
                    </span>
                  }
                />
              )}
              {e.rechtsgrundlage && <DetailRow label="Rechtsgrundlage" value={<span className="font-mono text-sm">{e.rechtsgrundlage}</span>} />}
              <DetailRow
                label="Indirekte Betroffenheit"
                value={
                  lkBeziehung === "ja" && lk ? (
                    <span className={e.indirekteBetroffenheit === "HOCH" ? "text-error font-bold" : "text-secondary font-bold"}>
                      Risiko: {e.indirekteBetroffenheit}
                    </span>
                  ) : lkBeziehung === "unbekannt" ? (
                    <span className="text-outline">Nicht bewertet</span>
                  ) : (
                    "Keine relevanten Lieferbeziehungen"
                  )
                }
              />
            </div>
          </div>

        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6 no-print">
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-primary mb-4 font-headline">Aktionen</h3>
            <div className="space-y-3">
              <button
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-lg font-bold hover:shadow-md transition-shadow"
                onClick={() => window.print()}
              >
                <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                PDF Exportieren
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 py-4 border border-outline-variant text-primary rounded-lg font-bold hover:bg-surface-container-low transition-colors"
                onClick={onEdit}
              >
                <span className="material-symbols-outlined text-xl">edit</span>
                Bearbeiten
              </button>
            </div>
            <div className="mt-8 pt-6 border-t border-surface-container-high">
              <button
                className="flex items-center justify-center gap-2 text-primary hover:underline font-medium text-sm w-full"
                onClick={() => window.location.reload()}
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                Neue Prüfung starten
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-br from-primary to-primary-container rounded-xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-xl font-bold mb-2 font-headline">Benötigen Sie Hilfe oder haben Fragen zur Planung und Umsetzung von NIS-2?</h4>
          <p className="text-white/80 text-sm mb-6">
            Unsere Experten unterstützen Sie bei der NIS-2 Planung und Umsetzung, dem Aufbau eines ISMS, der GRC-Toolauswahl oder der Einführung eines Business Continuity Managements.
          </p>
          <a
            href="https://sits.group"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-lg hover:bg-accent transition-colors"
          >
            Jetzt Beratung anfragen
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <span className="material-symbols-outlined text-[120px]">shield</span>
        </div>
      </div>

      {/* Legal Footer */}
      <footer className="mt-16 text-center text-on-surface-variant text-xs">
        <p>
          Automatisiert erstellt durch den NIS-2 Prüfagenten der SITS GmbH. Keine Rechtsberatung. Rechtlich nicht bindend.
        </p>
        <p className="mt-2 text-outline">Status: Vorläufig · v2.2 · NIS-2 Prüfagent | SITS GmbH</p>
      </footer>
    </div>
  );
}

function DetailRow({ label, value, sub }) {
  return (
    <div className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
      <span className="text-on-surface-variant font-medium shrink-0 text-sm">{label}</span>
      <div className="sm:text-right">
        <div className="text-on-surface font-semibold text-sm">{value}</div>
        {sub && <div className="text-xs text-outline mt-1 break-words">{sub}</div>}
      </div>
    </div>
  );
}
