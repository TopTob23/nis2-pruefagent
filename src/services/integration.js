/**
 * Konvertierung API-Antwort -> prueflogik.js Eingabe
 * VERSION: 2.2 (ES Module)
 */

/**
 * Konvertiert die JSON-Antwort der KI in das Format, das
 * prueflogik.js als Eingabe erwartet.
 */
export function konvertiereApiAntwort(apiAntwort) {
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

  function sicher(wert) {
    if (wert === null || wert === undefined) return "";
    return String(wert);
  }

  function sicherArray(wert) {
    if (Array.isArray(wert)) return wert;
    return [];
  }

  function normalisiereJaNein(wert) {
    const s = sicher(wert).toLowerCase().trim();
    if (s === "ja") return "ja";
    if (s === "nein") return "nein";
    if (s === "teilweise") return "teilweise";
    if (s === "unbekannt") return "unbekannt";
    return "";
  }

  // Lieferkette konvertieren
  let lieferkette = null;
  if (apiAntwort.lieferkette && typeof apiAntwort.lieferkette === "object") {
    const lk = apiAntwort.lieferkette;
    const hatBeziehung = normalisiereJaNein(lk.hatBeziehung);
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

  return {
    // Fields used by prueflogik.js directly:
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

    // Fields not used by prueflogik.js but needed by the app:
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
