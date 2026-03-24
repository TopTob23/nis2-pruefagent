/**
 * ═══════════════════════════════════════════════════════════════════════
 * DATEI:    integration.js
 * ZWECK:    Zeigt den KOMPLETTEN Datenfluss von API-Call bis Prüfergebnis
 * VERSION:  2.2
 * ═══════════════════════════════════════════════════════════════════════
 *
 * ARCHITEKTUR-ÜBERSICHT:
 *
 *   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 *   │  prompts.js  │ ──→ │  Claude API  │ ──→ │ JSON-Antwort │
 *   │ (Prompt      │     │ (recherchiert│     │ (Unternehmens│
 *   │  erstellen)  │     │  im Web)     │     │  daten)      │
 *   └──────────────┘     └──────────────┘     └──────┬───────┘
 *                                                     │
 *                                          konvertiereApiAntwort()
 *                                                     │
 *                                                     ▼
 *   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 *   │ Prüfergebnis │ ←── │prueflogik.js │ ←── │ Eingabedaten │
 *   │ (JA/NEIN/    │     │(6 Prüf-      │     │ (passendes   │
 *   │  GRENZFALL)  │     │ schritte)    │     │  Format)     │
 *   └──────────────┘     └──────────────┘     └──────────────┘
 *
 * WARUM GIBT ES DIESE DATEI?
 *   prompts.js und prueflogik.js haben leicht unterschiedliche
 *   Datenstrukturen. Diese Datei zeigt, wie man sie verbindet:
 *
 *   - prompts.js gibt ein JSON mit String-Feldern zurück (von der KI)
 *   - prueflogik.js erwartet dieselben Felder im selben Format
 *   - konvertiereApiAntwort() prüft und bereinigt die KI-Antwort
 *
 * WIE BENUTZE ICH DAS?
 *   In deiner App: Kopiere die Funktion konvertiereApiAntwort() und
 *   den Ablauf aus fuehreKomplettePruefungDurch().
 */


// ═══════════════════════════════════════════════════════════════════════
// TEIL 1: KONVERTIERUNG (API-Antwort → prueflogik.js Eingabe)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Konvertiert die JSON-Antwort der KI in das Format, das
 * prueflogik.js als Eingabe erwartet.
 *
 * WARUM IST DAS NÖTIG?
 *   Die KI könnte fehlerhafte Werte liefern:
 *   - null statt leerer String
 *   - "Ja" statt "ja"
 *   - spiA1_ids als null statt []
 *   - lieferkette als null statt Objekt
 *
 *   Diese Funktion bereinigt alles, sodass prueflogik.js
 *   keine Fehler wirft.
 *
 * @param {Object} apiAntwort - Das JSON von der KI (aus prompts.js)
 * @returns {Object} Bereinigte Daten für prueflogik.js
 */
function konvertiereApiAntwort(apiAntwort) {
  if (!apiAntwort || typeof apiAntwort !== "object") {
    return {
      sondermerkmale: [],
      spiA1_ids: [],
      spiA2_ids: [],
      mitarbeiter: "",
      umsatz: "",
      bilanzsumme: "",
      konzern: "nein",
      konzernMA: "",
      konzernUmsatz: "",
      konzernBilanz: "",
      lieferkette: null,
    };
  }

  // Hilfsfunktion: null/undefined zu leerem String
  function sicher(wert) {
    if (wert === null || wert === undefined) return "";
    return String(wert);
  }

  // Hilfsfunktion: Sicherstellen dass ein Wert ein Array ist
  function sicherArray(wert) {
    if (Array.isArray(wert)) return wert;
    return [];
  }

  // Hilfsfunktion: "Ja"/"JA"/"ja" normalisieren
  function normalisiereJaNein(wert) {
    var s = sicher(wert).toLowerCase().trim();
    if (s === "ja") return "ja";
    if (s === "nein") return "nein";
    if (s === "teilweise") return "teilweise";
    if (s === "unbekannt") return "unbekannt";
    return "";
  }

  // Lieferkette konvertieren
  var lieferkette = null;
  if (apiAntwort.lieferkette && typeof apiAntwort.lieferkette === "object") {
    var lk = apiAntwort.lieferkette;
    var hatBeziehung = normalisiereJaNein(lk.hatBeziehung);
    if (hatBeziehung) {
      lieferkette = {
        hatBeziehung: hatBeziehung,
        kundenSektoren: sicherArray(lk.kundenSektoren),
        artLeistung: sicher(lk.artLeistung),
        itZugriff: normalisiereJaNein(lk.itZugriff),
        vertraglicheAnforderungen: sicher(lk.vertraglicheAnforderungen),
      };
    }
  }

  // Hauptobjekt zusammenbauen
  return {
    // Diese Felder nutzt prueflogik.js direkt:
    sondermerkmale: sicherArray(apiAntwort.sondermerkmale),
    spiA1_ids:      sicherArray(apiAntwort.spiA1_ids),
    spiA2_ids:      sicherArray(apiAntwort.spiA2_ids),
    mitarbeiter:    sicher(apiAntwort.mitarbeiter),
    umsatz:         sicher(apiAntwort.umsatz),
    bilanzsumme:    sicher(apiAntwort.bilanzsumme),
    konzern:        normalisiereJaNein(apiAntwort.konzern),
    konzernMA:      sicher(apiAntwort.konzernMA),
    konzernUmsatz:  sicher(apiAntwort.konzernUmsatz),
    konzernBilanz:  sicher(apiAntwort.konzernBilanz),
    lieferkette:    lieferkette,

    // Diese Felder nutzt prueflogik.js NICHT,
    // aber die App braucht sie für den Bericht:
    orgName:           sicher(apiAntwort.orgName),
    rechtsform:        sicher(apiAntwort.rechtsform),
    bundesland:        sicher(apiAntwort.bundesland),
    sitz:              sicher(apiAntwort.sitz),
    ansprechpartner:   sicher(apiAntwort.ansprechpartner),
    taetigkeit:        sicher(apiAntwort.taetigkeit),
    branche:           sicher(apiAntwort.branche),
    naceCode:          sicher(apiAntwort.naceCode),
    oeffentlich:       normalisiereJaNein(apiAntwort.oeffentlich),
    oeffentlichEbene:  sicher(apiAntwort.oeffentlichEbene),
    itUnabhaengig:     normalisiereJaNein(apiAntwort.itUnabhaengig),
    zertifizierungen:  sicher(apiAntwort.zertifizierungen),
    quellen:           sicherArray(apiAntwort.quellen),
  };
}


// ═══════════════════════════════════════════════════════════════════════
// TEIL 2: KOMPLETTER ABLAUF (Beispiel-Code)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Zeigt den kompletten Ablauf von Recherche bis Prüfergebnis.
 *
 * DIESEN CODE KANNST DU IN DEINE APP KOPIEREN UND ANPASSEN.
 */
async function fuehreKomplettePruefungDurch(websiteUrls, dateiInhalte) {
  // Hier sind die Module – in deiner App per require() oder import laden
  var prompts = require("./prompts.js");
  var logik = require("./prueflogik.js");

  // ─── SCHRITT A: Prompt erstellen ───
  console.log("Schritt A: Erstelle Recherche-Prompt...");
  var userPrompt = prompts.erstelleUserPrompt({
    websiteUrls: websiteUrls,
    hatDateien: (dateiInhalte && dateiInhalte.length > 0),
    anzahlDateien: dateiInhalte ? dateiInhalte.length : 0,
  });

  // ─── SCHRITT B: KI recherchieren lassen ───
  console.log("Schritt B: Rufe Claude API auf...");
  var apiAntwort = await prompts.recherchiereUnternehmen(userPrompt, dateiInhalte);

  if (!apiAntwort) {
    console.error("FEHLER: KI-Recherche hat kein Ergebnis geliefert.");
    return null;
  }
  console.log("KI-Recherche erfolgreich. Unternehmen:", apiAntwort.orgName || "unbekannt");

  // ─── SCHRITT C: Daten konvertieren ───
  console.log("Schritt C: Konvertiere API-Antwort...");
  var eingabeDaten = konvertiereApiAntwort(apiAntwort);

  // ─── SCHRITT D: NIS-2-Prüfung durchführen ───
  console.log("Schritt D: Führe NIS-2-Prüfung durch...");
  var ergebnis = logik.nis2Pruefung(eingabeDaten);

  // ─── SCHRITT E: Ergebnis ausgeben ───
  console.log("\n════════════════════════════════════════");
  console.log("  NIS-2-Pflicht:       " + ergebnis.ergebnis.pflicht);
  console.log("  Einrichtungsklasse:  " + (ergebnis.ergebnis.klasseLabel || "Nicht erfasst"));
  console.log("  Grenzfall:           " + (ergebnis.ergebnis.grenzfall ? "JA" : "NEIN"));
  console.log("  Indirekte Betroffen: " + (ergebnis.ergebnis.indirekteBetroffenheit || "Keine"));
  console.log("════════════════════════════════════════\n");

  return {
    eingabeDaten: eingabeDaten,  // Die konvertierten Daten (für den Bericht)
    pruefErgebnis: ergebnis,     // Das vollständige Prüfergebnis
  };
}


// ═══════════════════════════════════════════════════════════════════════
// TEIL 3: BEISPIEL – So sieht eine konvertierte API-Antwort aus
// ═══════════════════════════════════════════════════════════════════════

/**
 * Dieses Beispiel zeigt exakt, wie die Daten fließen.
 * Du kannst es mit `node integration.js` ausführen zum Testen.
 */
function beispielDurchlauf() {
  var logik = require("./prueflogik.js");

  // Simulierte KI-Antwort (wie sie von Claude kommen würde)
  var simulierteApiAntwort = {
    orgName: "KWB Goslar GmbH",
    rechtsform: "GmbH",
    bundesland: "Niedersachsen",
    sitz: "Goslar",
    ansprechpartner: "",
    taetigkeit: "Kreislaufwirtschaft und Abfallentsorgung für die Region Goslar",
    branche: "Abfallwirtschaft",
    naceCode: "38.11",
    mitarbeiter: "120",
    umsatz: "25",
    bilanzsumme: "18",
    oeffentlich: "teilweise",
    oeffentlichEbene: "Kommunal",
    konzern: "nein",
    konzernName: "",
    konzernMA: "",
    konzernUmsatz: "",
    konzernBilanz: "",
    itUnabhaengig: "",
    zertifizierungen: "",
    spiA1_ids: [],
    spiA2_ids: ["abfall"],
    sondermerkmale: [],
    lieferkette: {
      hatBeziehung: "unbekannt",
      kundenSektoren: [],
      artLeistung: "",
      itZugriff: "nein",
      vertraglicheAnforderungen: "",
    },
    quellen: [
      { url: "https://www.kwb-goslar.de/", titel: "KWB Goslar", info: "Tätigkeitsbeschreibung" }
    ],
  };

  console.log("═══ Beispiel-Durchlauf ═══\n");

  // Schritt 1: Konvertieren
  var eingabeDaten = konvertiereApiAntwort(simulierteApiAntwort);
  console.log("Eingabedaten (konvertiert):");
  console.log("  Sektoren Anhang I:", eingabeDaten.spiA1_ids);
  console.log("  Sektoren Anhang II:", eingabeDaten.spiA2_ids);
  console.log("  Sondermerkmale:", eingabeDaten.sondermerkmale);
  console.log("  Mitarbeiter:", eingabeDaten.mitarbeiter);
  console.log("  Umsatz:", eingabeDaten.umsatz, "Mio.");
  console.log("  Konzern:", eingabeDaten.konzern);
  console.log("");

  // Schritt 2: Prüfung
  var ergebnis = logik.nis2Pruefung(eingabeDaten);

  console.log("Prüfergebnis:");
  console.log("  NIS-2-Pflicht:", ergebnis.ergebnis.pflicht);
  console.log("  Klasse:", ergebnis.ergebnis.klasseLabel || "Nicht erfasst");
  console.log("  Rechtsgrundlage:", ergebnis.ergebnis.rechtsgrundlage || "-");
  console.log("  Begründung:", ergebnis.ergebnis.begruendung);
  console.log("  Grenzfall:", ergebnis.ergebnis.grenzfall ? "JA" : "NEIN");
  console.log("  Indirekte Betroffenheit:", ergebnis.ergebnis.indirekteBetroffenheit || "Keine");
  console.log("");

  return ergebnis;
}

// Wenn direkt ausgeführt: Beispiel-Durchlauf starten
if (typeof require !== "undefined" && require.main === module) {
  beispielDurchlauf();
}


// ═══════════════════════════════════════════════════════════════════════
// TEIL 4: EXPORT
// ═══════════════════════════════════════════════════════════════════════

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    konvertiereApiAntwort:           konvertiereApiAntwort,
    fuehreKomplettePruefungDurch:    fuehreKomplettePruefungDurch,
    beispielDurchlauf:               beispielDurchlauf,
  };
}
