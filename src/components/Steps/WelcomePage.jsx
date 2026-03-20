import { COLORS } from "../../constants/branding";
import { cn } from "../../utils/cn";
import Field from "../UI/Field";

export default function WelcomePage({ analysis }) {
  const {
    useFiles, setUseFiles,
    useWebsites, setUseWebsites,
    useWebSearch, setUseWebSearch,
    urls, setUrl, addUrl, removeUrl,
    files, handleDrop, handleFileSelect, removeFile,
    dragOver, setDragOver,
    loading, sources,
  } = analysis;

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, color: COLORS.TD, marginBottom: 8 }}>
          NIS-2 Betroffenheitsprüfung
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#5a8a94",
            maxWidth: 560,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Prüfen Sie in wenigen Schritten, ob Ihre Organisation unter das
          NIS-2-Umsetzungsgesetz fällt. Stellen Sie Informationsquellen bereit – das
          Formular wird automatisch vorbefüllt.
        </p>
      </div>

      <div className="cd">
        <h2 style={{ fontSize: 18, fontWeight: 600, color: COLORS.TD, marginBottom: 4 }}>
          Datenquellen für die Vorbefüllung
        </h2>
        <p style={{ fontSize: 13, color: "#7a9ca5", marginBottom: 20 }}>
          Wählen Sie, welche Quellen zur automatischen Analyse genutzt werden sollen
        </p>

        {/* Source toggles */}
        <div style={{ display: "grid", gap: 12, marginBottom: 24 }}>
          <SourceToggle
            active={useFiles}
            onToggle={() => setUseFiles((x) => !x)}
            title="Hochgeladene Dokumente"
            desc="Jahresabschluss, Handelsregisterauszug, Organigramm o.ä."
          />
          <SourceToggle
            active={useWebsites}
            onToggle={() => setUseWebsites((x) => !x)}
            title="Angegebene Webseiten"
            desc="Unternehmenswebseite, Impressum, Über-uns-Seite etc."
          />
          <SourceToggle
            active={useWebSearch}
            onToggle={() => setUseWebSearch((x) => !x)}
            title="Automatische Webrecherche"
            desc="Handelsregister, Branchenverzeichnisse, öffentliche Quellen – mit präzisen Quellenangaben"
          />
        </div>

        {/* URL input */}
        {useWebsites && (
          <div style={{ marginBottom: 20 }}>
            <Field
              label="Webseiten der Organisation"
              hint="Geben Sie alle relevanten URLs an (Hauptseite, Impressum, Über-uns etc.)"
            >
              <div style={{ display: "grid", gap: 8 }}>
                {urls.map((u, i) => (
                  <div key={i} className="url-row">
                    <input
                      type="text"
                      value={u}
                      onChange={(e) => setUrl(i, e.target.value)}
                      placeholder={
                        i === 0
                          ? "z.B. https://www.beispiel.de"
                          : "Weitere URL eingeben..."
                      }
                      style={{ flex: 1 }}
                    />
                    {urls.length > 1 && (
                      <div className="url-rm" onClick={() => removeUrl(i)}>
                        ×
                      </div>
                    )}
                  </div>
                ))}
                <div className="url-add" onClick={addUrl}>
                  + Weitere Webseite hinzufügen
                </div>
              </div>
            </Field>
          </div>
        )}

        {/* File upload */}
        {useFiles && (
          <div style={{ marginBottom: 20 }}>
            <Field label="Dokumente hochladen" hint="Max. 10 MB pro Datei">
              <div
                className={cn("dropzone", dragOver && "over")}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input").click()}
              >
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept=".pdf,.docx,.xlsx,.csv,.txt,.jpg,.jpeg,.png"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
                <div style={{ fontSize: 32, marginBottom: 8, color: COLORS.TM }}>+</div>
                <div
                  style={{ fontSize: 14, color: COLORS.T, fontWeight: 500, marginBottom: 4 }}
                >
                  Dateien hierher ziehen oder klicken
                </div>
                <div style={{ fontSize: 12, color: "#9cb8be" }}>
                  PDF, DOCX, XLSX, CSV, Bilder
                </div>
              </div>
            </Field>
            {files.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {files.map((f, i) => (
                  <div key={i} className="file-tag">
                    <span
                      style={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {f.name}
                    </span>
                    <span style={{ fontSize: 11, color: "#7a9ca5" }}>
                      ({(f.size / 1024).toFixed(0)} KB)
                    </span>
                    <span
                      className="file-rm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div>
            <div className="loading-bar">
              <div className="loading-fill" />
            </div>
            <p style={{ fontSize: 13, color: COLORS.T, textAlign: "center" }}>
              Unternehmensdaten werden analysiert und Formular wird vorbefüllt...
            </p>
          </div>
        )}

        {/* Sources display */}
        {sources.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Field label="Verwendete Quellen">
              <div style={{ display: "grid", gap: 6 }}>
                {sources.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: 12,
                      lineHeight: 1.5,
                      padding: "8px 12px",
                      background: COLORS.TL,
                      borderRadius: 8,
                      border: `1px solid ${COLORS.TM}`,
                    }}
                  >
                    <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                      <span style={{ color: COLORS.T, fontWeight: 500, flexShrink: 0 }}>
                        Q{i + 1}:
                      </span>
                      {q.url ? (
                        <a
                          href={q.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: COLORS.T,
                            textDecoration: "underline",
                            wordBreak: "break-all",
                          }}
                        >
                          {q.titel || q.url}
                        </a>
                      ) : (
                        <span style={{ color: COLORS.TD, fontWeight: 500 }}>
                          {q.titel || "Dokument"}
                        </span>
                      )}
                    </div>
                    {q.info && (
                      <div style={{ color: "#4a7a84", marginTop: 2 }}>{q.info}</div>
                    )}
                  </div>
                ))}
              </div>
            </Field>
          </div>
        )}
      </div>

      <div
        style={{
          background: COLORS.TL,
          borderRadius: 12,
          padding: 16,
          fontSize: 13,
          color: "#4a7a84",
          lineHeight: 1.6,
          marginTop: 16,
        }}
      >
        <strong style={{ color: COLORS.T }}>Hinweis:</strong> Sie können diesen Schritt
        auch überspringen und alle Angaben manuell eingeben. Die KI-gestützte Vorbefüllung
        dient als Arbeitshilfe – alle Angaben sollten vor der Auswertung geprüft werden.
      </div>
    </div>
  );
}

function SourceToggle({ active, onToggle, title, desc }) {
  return (
    <div className={cn("src-toggle", active && "on")} onClick={onToggle}>
      <div className="track">
        <div className="thumb" />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: active ? COLORS.T : "#6b7280",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 12, color: "#7a9ca5", marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  );
}
