import { getSektorNamen } from "../../logic/prueflogik";

export default function ResultView({ data, result, onEdit }) {
  const r = result;
  const sektorNamen = getSektorNamen(data.spiA1, data.spiA2);

  const isJa = r.p === "JA";
  const isNein = r.p === "NEIN";
  const isGrenz = r.p === "GRENZFALL";

  const statusIcon = isJa ? "gpp_bad" : isNein ? "verified_user" : "gpp_maybe";
  const statusLabel = isJa ? "BETROFFEN" : isNein ? "NICHT BETROFFEN" : "GRENZFALL";
  const statusColor = isJa ? "text-error" : isNein ? "text-primary" : "text-secondary";

  return (
    <div className="max-w-5xl mx-auto">
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
              {isNein ? "Nicht erfasst" : r.k}
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
              <DetailRow label="Einrichtungstyp" value={r.k} />
              <DetailRow
                label="Größenklasse"
                value={
                  r.gr ? "Großunternehmen" : r.mi ? "Mittleres Unternehmen" : "Klein-/Kleinstunternehmen"
                }
                sub={`${r.ma > 0 ? `${Math.round(r.ma)} VZÄ` : "VZÄ: k.A."}${r.um > 0 ? ` · ${r.um} Mio. € Umsatz` : ""}${r.bi > 0 ? ` · ${r.bi} Mio. € Bilanz` : ""}${data.konzern === "ja" ? " (kons.)" : ""}`}
              />
              <DetailRow
                label="Sektorzuordnung"
                value={
                  <span className="flex flex-wrap gap-2">
                    {r.h1 && <span className="bg-error/10 text-error px-2 py-0.5 rounded text-xs font-medium">Anlage 1</span>}
                    {r.h2 && <span className="bg-accent/20 text-secondary px-2 py-0.5 rounded text-xs font-medium">Anlage 2</span>}
                    {!r.h1 && !r.h2 && <span className="text-outline">Kein NIS-2-Sektor</span>}
                  </span>
                }
                sub={(r.h1 || r.h2) ? sektorNamen.join(", ") : undefined}
              />
              <DetailRow
                label="Sondermerkmale"
                value={r.hs ? <span className="text-error font-semibold">Ja</span> : "Kein Sondermerkmal"}
              />
              <DetailRow
                label="Größenklassifizierung"
                value={
                  isJa ? (
                    <span className="text-error font-bold flex items-center gap-1">
                      Schwelle überschritten
                      <span className="material-symbols-outlined text-sm">trending_up</span>
                    </span>
                  ) : isGrenz ? (
                    <span className="text-secondary font-bold">Grenzbereich (&lt;15% über Schwelle)</span>
                  ) : (
                    <span className="text-primary">Unter Schwellenwerten</span>
                  )
                }
                sub={[
                  r.ma > 0 ? `${Math.round(r.ma)} VZÄ ${r.gr ? "(≥250)": r.mi ? "(≥50)" : "(<50)"}` : null,
                  r.um > 0 ? `${r.um} Mio. € Umsatz ${r.um >= 50 ? "(≥50)" : r.um >= 10 ? "(≥10)" : "(<10)"}` : null,
                  r.bi > 0 ? `${r.bi} Mio. € Bilanz ${r.bi >= 43 ? "(≥43)" : r.bi >= 10 ? "(≥10)" : "(<10)"}` : null,
                ].filter(Boolean).join(" · ") || undefined}
              />
              {r.rg && <DetailRow label="Rechtsgrundlage" value={<span className="font-mono text-sm">{r.rg}</span>} />}
              <DetailRow
                label="Indirekte Betroffenheit"
                value={
                  data.lieferbeziehung === "ja" ? (
                    <span className={r.lr === "HOCH" ? "text-error font-bold" : "text-secondary font-bold"}>
                      Risiko: {r.lr}
                    </span>
                  ) : data.lieferbeziehung === "unbekannt" ? (
                    <span className="text-outline">Nicht bewertet</span>
                  ) : (
                    "Keine relevanten Lieferbeziehungen"
                  )
                }
              />
            </div>
          </div>

          {/* Recommendation Cards */}
          {isJa && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary text-white rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>assignment</span>
                </div>
                <h4 className="text-lg font-bold mb-2 font-headline">Audit vorbereiten</h4>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  GAP-Analyse gegen § 30 BSIG durchführen. ISMS aufbauen (ISO 27001 / BSI IT-Grundschutz).
                </p>
              </div>
              <div className="bg-surface-container-high rounded-xl p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary">how_to_reg</span>
                </div>
                <h4 className="text-lg font-bold text-primary mb-2 font-headline">BSI Registrierung</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  Registrierung beim BSI bis spätestens 06.03.2026. Incident-Response mit 24/72h-Meldefristen einrichten.
                </p>
              </div>
            </div>
          )}

          {isGrenz && (
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-6">
              <h4 className="text-lg font-bold text-primary mb-2 font-headline">Vertiefte Prüfung empfohlen</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Schwellenwerte nahe der Grenze. Dringend: Rechtsberater einbinden, Kennzahlen exakt ermitteln, im Zweifel vorsorglich registrieren.
              </p>
            </div>
          )}

          {isNein && (
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
              <h4 className="text-lg font-bold text-primary mb-2 font-headline">Empfehlung</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Nach aktuellem Stand keine NIS-2-Pflicht. Empfehlung: Jährlich wiederholen, Prüfprozess dokumentieren, freiwillige Maßnahmen prüfen.
              </p>
            </div>
          )}
        </div>

        {/* Side Actions */}
        <div className="space-y-6">
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

          <div className="bg-gradient-to-br from-primary to-primary-container rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold mb-2 font-headline">Benötigen Sie Hilfe?</h4>
              <p className="text-white/80 text-sm mb-6">
                Unsere Experten unterstützen Sie bei der NIS-2 Umsetzung und Zertifizierung.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-[120px]">shield</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Footer */}
      <footer className="mt-16 text-center text-on-surface-variant text-xs">
        <p>
          Automatisiert erstellt durch den NIS-2 Prüfagenten der SITS GmbH. Keine Rechtsberatung. Rechtlich nicht bindend.
        </p>
        <p className="mt-2 text-outline">Status: Vorläufig · v2.0 · NIS-2 Prüfagent | SITS GmbH</p>
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
