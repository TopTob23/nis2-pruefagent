import { cn } from "../../utils/cn";

export default function WelcomePage({ analysis }) {
  const {
    useFiles, setUseFiles,
    useWebsites, setUseWebsites,
    useWebSearch, setUseWebSearch,
    urls, setUrl, addUrl, removeUrl,
    files, handleDrop, handleFileSelect, removeFile,
    dragOver, setDragOver,
    loading, error, sources,
  } = analysis;

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-16">
        <span className="text-primary font-label text-xs font-bold tracking-[0.2em] mb-4 block uppercase">
          Compliance Strategy
        </span>
        <h1 className="font-headline font-extrabold text-5xl md:text-7xl text-primary tracking-tight leading-[1.1] mb-8">
          NIS-2{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
            Betroffenheitsprüfung
          </span>
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Prüfen Sie in wenigen Schritten, ob Ihr Unternehmen unter die neue
          EU-Cybersicherheitsrichtlinie fällt und welche regulatorischen Anforderungen auf
          Sie zukommen.
        </p>
      </div>

      {/* Bento Grid: Main + Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Main Card */}
        <div className="md:col-span-8 bg-surface-container-lowest p-8 md:p-10 rounded-xl shadow-[0px_12px_32px_rgba(0,31,38,0.06)] border border-outline-variant/15">
          <div className="space-y-10">
            {/* Explanation Section */}
            <div className="bg-surface-container-low rounded-xl p-6 border-l-4 border-accent">
              <h3 className="font-headline font-bold text-primary text-lg mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-accent">auto_awesome</span>
                KI-gestützte Vorbefüllung
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                Dieses Tool prüft, ob Ihr Unternehmen unter die NIS-2-Richtlinie fällt. Dafür werden im nächsten Schritt Angaben zu Branche, Größe und Tätigkeitsfeld benötigt.
              </p>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                <strong className="text-primary">Optional:</strong> Stellen Sie vorab Informationsquellen bereit – unsere KI analysiert diese und füllt das Formular automatisch vor. Das spart Zeit und erhöht die Genauigkeit.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">upload_file</span>
                  <div>
                    <p className="text-sm font-medium text-primary">Dokumente</p>
                    <p className="text-xs text-on-surface-variant">Jahresabschluss, Handelsregister&shy;auszug o.ä.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">language</span>
                  <div>
                    <p className="text-sm font-medium text-primary">Webseite</p>
                    <p className="text-xs text-on-surface-variant">Impressum, Über-uns, Firmen&shy;profil</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-primary text-lg mt-0.5">travel_explore</span>
                  <div>
                    <p className="text-sm font-medium text-primary">Websuche</p>
                    <p className="text-xs text-on-surface-variant">Handelsregister, Branchen&shy;verzeichnisse</p>
                  </div>
                </div>
              </div>
            </div>
            {/* File Upload Zone */}
            {useFiles && (
              <div className="group relative">
                <label className="block text-sm font-label font-bold text-primary mb-3 tracking-wide uppercase">
                  Dokumente analysieren (optional)
                </label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer",
                    dragOver
                      ? "border-accent bg-accent/5"
                      : "border-outline-variant bg-surface hover:bg-surface-container-low hover:border-primary"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-input").click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".pdf,.docx,.xlsx,.csv,.txt,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
                  </div>
                  <p className="text-on-surface font-medium text-lg mb-1">
                    Dateien hierher ziehen oder klicken
                  </p>
                  <p className="text-on-surface-variant text-sm">
                    PDF, DOCX, XLSX, CSV, Bilder – max. 10 MB
                  </p>
                </div>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-sm text-primary"
                      >
                        <span className="material-symbols-outlined text-sm">description</span>
                        <span className="max-w-[200px] truncate">{f.name}</span>
                        <span className="text-xs text-on-surface-variant">
                          ({(f.size / 1024).toFixed(0)} KB)
                        </span>
                        <button
                          className="text-error hover:text-error/80 ml-1"
                          onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* URL Input */}
            {useWebsites && (
              <div>
                <label className="block text-sm font-label font-bold text-primary mb-3 tracking-wide uppercase">
                  Website-URL des Unternehmens
                </label>
                <div className="space-y-3">
                  {urls.map((u, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="material-symbols-outlined text-outline">language</span>
                        </div>
                        <input
                          type="text"
                          value={u}
                          onChange={(e) => setUrl(i, e.target.value)}
                          placeholder={i === 0 ? "https://ihr-unternehmen.de" : "Weitere URL..."}
                          className="w-full pl-12 pr-4 py-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-outline"
                        />
                      </div>
                      {urls.length > 1 && (
                        <button
                          className="w-10 h-10 rounded-lg border border-outline-variant flex items-center justify-center text-error hover:bg-error/5 transition-colors"
                          onClick={() => removeUrl(i)}
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    className="text-primary text-sm font-semibold hover:underline underline-offset-4 flex items-center gap-1"
                    onClick={addUrl}
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Weitere URL hinzufügen
                  </button>
                </div>
              </div>
            )}

            {/* Source Toggles */}
            <div className="flex flex-col gap-4 pt-4">
              <SourceToggle
                active={useFiles}
                onToggle={() => setUseFiles((x) => !x)}
                icon="upload_file"
                title="Dokumenten-Upload"
              />
              <SourceToggle
                active={useWebsites}
                onToggle={() => setUseWebsites((x) => !x)}
                icon="language"
                title="Website-Analyse"
              />
              <label className="flex items-center gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={useWebSearch}
                  onChange={() => setUseWebSearch((x) => !x)}
                  className="w-6 h-6 rounded border-outline-variant text-accent focus:ring-accent focus:ring-offset-0 transition-all"
                />
                <span className="text-on-surface-variant text-sm font-medium group-hover:text-primary transition-colors">
                  Websuche zur Datenergänzung nutzen
                </span>
              </label>
            </div>

            {/* Loading */}
            {loading && (
              <div>
                <div className="loading-bar"><div className="loading-fill" /></div>
                <p className="text-sm text-primary text-center">
                  Unternehmensdaten werden analysiert und Formular wird vorbefüllt...
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-error-container border border-error/20 text-on-error-container text-sm">
                <strong>Fehler bei der Analyse:</strong> {error}
              </div>
            )}

            {/* Sources */}
            {sources.length > 0 && (
              <div>
                <h4 className="text-sm font-label font-bold text-primary mb-3 tracking-wide uppercase">
                  Verwendete Quellen
                </h4>
                <div className="space-y-2">
                  {sources.map((q, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 text-xs"
                    >
                      <div className="flex gap-2 items-baseline">
                        <span className="text-primary font-semibold shrink-0">Q{i + 1}:</span>
                        {q.url ? (
                          <a
                            href={q.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline underline-offset-2 break-all"
                          >
                            {q.titel || q.url}
                          </a>
                        ) : (
                          <span className="text-on-surface font-medium">{q.titel || "Dokument"}</span>
                        )}
                      </div>
                      {q.info && <p className="text-on-surface-variant mt-1">{q.info}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-primary p-8 rounded-xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <span className="material-symbols-outlined text-[96px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>
            <h3 className="font-headline font-bold text-xl mb-4 relative z-10">Warum prüfen?</h3>
            <p className="text-primary-fixed-dim text-sm leading-relaxed mb-6 relative z-10">
              Die NIS-2-Richtlinie erweitert den Kreis der regulierten Unternehmen massiv.
              Bei Nichtbeachtung drohen Bußgelder bis zu 10 Mio. EUR oder 2% des weltweiten Umsatzes.
            </p>
            <ul className="space-y-3 relative z-10">
              <li className="flex items-start gap-3 text-sm">
                <span className="material-symbols-outlined text-accent text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span>Kostenlose Erstprüfung</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <span className="material-symbols-outlined text-accent text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                <span>Sekundenschnelle KI-Analyse</span>
              </li>
            </ul>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10">
            <h4 className="font-label font-bold text-xs text-on-surface-variant tracking-widest mb-4 uppercase">
              Datensicherheit
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Ihre Daten werden nach ISO 27001 Standards verarbeitet und ausschließlich für
              diese Prüfung verwendet. Wir speichern keine sensiblen Dokumente dauerhaft.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceToggle({ active, onToggle, icon, title }) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all w-full text-left",
        active
          ? "border-primary bg-primary/5 text-primary"
          : "border-surface-container-high bg-surface text-on-surface-variant hover:border-outline"
      )}
      onClick={onToggle}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-medium text-sm">{title}</span>
      <div className={cn(
        "ml-auto w-10 h-6 rounded-full relative transition-colors",
        active ? "bg-accent" : "bg-outline-variant"
      )}>
        <div className={cn(
          "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm",
          active ? "translate-x-[18px]" : "translate-x-0.5"
        )} />
      </div>
    </button>
  );
}
