/**
 * ═══════════════════════════════════════════════════════════════════════
 * DATEI:    prueflogik.js
 * ZWECK:    NIS-2-Betroffenheitsprüfung – Entscheidungslogik
 * VERSION:  2.2
 * ═══════════════════════════════════════════════════════════════════════
 *
 * WAS MACHT DIESE DATEI?
 *   Sie nimmt strukturierte Unternehmensdaten entgegen und bestimmt,
 *   ob das Unternehmen unter die NIS-2-Richtlinie fällt.
 *
 * WIE WIRD SIE AUFGERUFEN?
 *   const ergebnis = nis2Pruefung(eingabeDaten);
 *   → Siehe integration.js für ein vollständiges Beispiel.
 *
 * WAS KOMMT REIN? (eingabeDaten)
 *   {
 *     sondermerkmale: ["kritis"],         // Array von Sondermerkmal-IDs
 *     spiA1_ids:      ["energie"],        // Array von Anhang-I-Sektor-IDs
 *     spiA2_ids:      ["post"],           // Array von Anhang-II-Sektor-IDs
 *     mitarbeiter:    "120",              // String mit Zahl (VZÄ)
 *     umsatz:         "18.5",             // String mit Zahl (Mio. EUR)
 *     bilanzsumme:    "12.0",             // String mit Zahl (Mio. EUR)
 *     konzern:        "ja" oder "nein",   // String
 *     konzernMA:      "500",              // String mit Zahl (wenn Konzern=ja)
 *     konzernUmsatz:  "80",               // String mit Zahl (wenn Konzern=ja)
 *     konzernBilanz:  "60",               // String mit Zahl (wenn Konzern=ja)
 *     lieferkette: {                      // Objekt (optional)
 *       hatBeziehung:   "ja"/"nein"/"unbekannt",
 *       kundenSektoren: ["Energie"],
 *       artLeistung:    "IT-Betrieb",
 *       itZugriff:      "ja"/"nein",
 *       vertraglicheAnforderungen: "ISO 27001"
 *     }
 *   }
 *
 * WAS KOMMT RAUS? (ergebnis)
 *   {
 *     version: "2.2",
 *     schritte: { ... },                  // Details zu jedem Prüfschritt
 *     ergebnis: {
 *       pflicht:      "JA"/"NEIN"/"GRENZFALL",
 *       klasse:       "bwE"/"wE"/"KRITIS/bwE"/null,
 *       klasseLabel:  "Besonders wichtige Einrichtung (bwE)" / ...,
 *       rechtsgrundlage: "§ 28 ...",
 *       begruendung:  "Freitext-Erklärung",
 *       grenzfall:    true/false,
 *       indirekteBetroffenheit: "HOCH"/"MITTEL"/"NIEDRIG"/null
 *     }
 *   }
 *
 * RECHTSQUELLEN:
 *   - NIS-2-Richtlinie 2022/2555/EU, Art. 2–3
 *   - NIS2UmsuCG / BSIG §§ 28–30
 *   - KMU-Empfehlung 2003/361/EG
 *   - BSI-Entscheidungsbaum (nis2betroffenheitentscheidungsbaum.pdf)
 *
 * KORREKTUREN IN v2.2 (gegenüber v2.0):
 *   Fix 1: Sondermerkmale differenziert (nicht-qual. VDA → wE, nicht bwE)
 *   Fix 2: Finanzschwellen strikt > (nicht ≥) bei Umsatz/Bilanz
 *   Fix 3: Telekommunikationsanbieter als eigener Entscheidungspfad
 *   Fix 4: Finanzschwellen UND-verknüpft (Umsatz UND Bilanz, nicht ODER)
 *   Fix 5: Mutation-Bug in Telekom-Logik behoben (kein Seiteneffekt mehr)
 *   Fix 6: Lieferketten-Risiko: alle Anhang-I-Sektoren als kritisch erkannt
 */


// ═══════════════════════════════════════════════════════════════════════
// TEIL 1: KONSTANTEN
// ═══════════════════════════════════════════════════════════════════════

/**
 * Schwellenwerte für die Größenklassifizierung.
 *
 * WICHTIG – Operatoren:
 *   Mitarbeiter:   ≥ (größer oder gleich)  → 50 exakt = mittel
 *   Umsatz:        > (strikt größer)       → 10.0 exakt = NICHT mittel
 *   Bilanzsumme:   > (strikt größer)       → 10.0 exakt = NICHT mittel
 *
 * WICHTIG – Verknüpfung:
 *   Mitarbeiter allein reichen aus (ODER).
 *   Umsatz UND Bilanzsumme müssen BEIDE überschritten sein.
 *
 *   Mittleres Unternehmen: MA ≥ 50  ODER  (Umsatz > 10 UND Bilanz > 10)
 *   Großes Unternehmen:    MA ≥ 250 ODER  (Umsatz > 50 UND Bilanz > 43)
 */
const SCHWELLENWERTE = {
  mittel_ma:      50,   // VZÄ, Operator: ≥
  mittel_umsatz:  10,   // Mio. EUR, Operator: >
  mittel_bilanz:  10,   // Mio. EUR, Operator: >
  gross_ma:       250,  // VZÄ, Operator: ≥
  gross_umsatz:   50,   // Mio. EUR, Operator: >
  gross_bilanz:   43,   // Mio. EUR, Operator: >
};

/** Grenzfall-Toleranz: Werte < 15% über dem Schwellenwert. */
const GRENZFALL_PROZENT = 0.15;

/**
 * Alle NIS-2-Sondermerkmale mit ihrer Klassenzuordnung.
 *
 * WICHTIG:
 *   - Die meisten Sondermerkmale → bwE OHNE Größenprüfung.
 *   - AUSNAHME 1: nichtQualVDA → wE (nicht bwE!).
 *   - AUSNAHME 2: telekom → bwE, ABER nur wenn Unternehmen ≥ mittelgroß.
 *                 Wenn Telekom + klein → fällt durch zur normalen Prüfung.
 */
const SONDERMERKMALE = {
  kritis: {
    label: "KRITIS-Betreiber (BSI-KritisV)",
    klasse: "KRITIS/bwE",
    brauchtGroesse: false,
  },
  telekom: {
    label: "Anbieter öffentlicher Telekommunikationsdienste/-netze",
    klasse: "bwE",
    brauchtGroesse: true, // ← einziges Merkmal das Größenprüfung braucht!
  },
  qualVDA: {
    label: "Qualifizierter Vertrauensdiensteanbieter (eIDAS-VO)",
    klasse: "bwE",
    brauchtGroesse: false,
  },
  tld: {
    label: "TLD-Name-Registry",
    klasse: "bwE",
    brauchtGroesse: false,
  },
  dns: {
    label: "DNS-Diensteanbieter",
    klasse: "bwE",
    brauchtGroesse: false,
  },
  nichtQualVDA: {
    label: "Nicht-qualifizierter Vertrauensdiensteanbieter",
    klasse: "wE", // ← NICHT bwE! Das ist der Unterschied zu qualVDA.
    brauchtGroesse: false,
  },
  ixp: {
    label: "Internet Exchange Point (IXP) Betreiber",
    klasse: "bwE",
    brauchtGroesse: false,
  },
  bundesbehoerde: {
    label: "Bundesbehörde / öffentliche Verwaltung (Bundesebene)",
    klasse: "bwE",
    brauchtGroesse: false,
  },
};

/** Sektoren mit hoher Kritikalität (Anhang I BSIG). */
const ANHANG1_SEKTOREN = {
  energie:       "Energie",
  transport:     "Transport und Verkehr",
  bankwesen:     "Bankwesen",
  finanzmarkt:   "Finanzmarktinfrastrukturen",
  gesundheit:    "Gesundheit",
  trinkwasser:   "Trinkwasser",
  abwasser:      "Abwasser",
  digitalinfra:  "Digitale Infrastruktur",
  iktb2b:        "IKT-Dienstleistungsmanagement (B2B)",
  verwaltung:    "Öffentliche Verwaltung",
  weltraum:      "Weltraum",
};

/** Sonstige kritische Sektoren (Anhang II BSIG). */
const ANHANG2_SEKTOREN = {
  post:            "Post- und Kurierdienste",
  abfall:          "Abfallbewirtschaftung",
  chemie:          "Chemie",
  lebensmittel:    "Lebensmittel",
  verarbeitend:    "Verarbeitendes Gewerbe / Herstellung von Waren",
  digitaledienste: "Anbieter digitaler Dienste",
  forschung:       "Forschung",
};


// ═══════════════════════════════════════════════════════════════════════
// TEIL 2: HILFSFUNKTIONEN
// ═══════════════════════════════════════════════════════════════════════

/**
 * Wandelt einen String-Wert in eine Zahl um.
 *
 * Beispiele:
 *   parseZahl("120")    → 120
 *   parseZahl("18,5")   → 18.5
 *   parseZahl("18.5")   → 18.5
 *   parseZahl("")        → null
 *   parseZahl(null)      → null
 *   parseZahl(undefined) → null
 *   parseZahl("abc")     → null
 */
function parseZahl(wert) {
  if (wert === null || wert === undefined || wert === "") {
    return null;
  }
  // Komma durch Punkt ersetzen, alles außer Ziffern und Punkt/Minus entfernen
  var bereinigt = String(wert).replace(",", ".").replace(/[^\d.\-]/g, "");
  var zahl = parseFloat(bereinigt);
  if (isNaN(zahl)) {
    return null;
  }
  return zahl;
}

/**
 * Prüft ob ein Wert knapp über dem Schwellenwert liegt (Grenzfall).
 *
 * @param {number|null} wert      - Der zu prüfende Wert
 * @param {number}      schwelle  - Der Schwellenwert
 * @param {string}      operator  - "gte" für ≥ (Mitarbeiter) oder "gt" für > (Finanzen)
 * @returns {boolean} true wenn Grenzfall (Wert liegt < 15% über Schwelle)
 *
 * Beispiele:
 *   istGrenzfall(52, 50, "gte")  → true  (52 ist < 50 * 1.15 = 57.5)
 *   istGrenzfall(80, 50, "gte")  → false (80 ist > 57.5)
 *   istGrenzfall(11, 10, "gt")   → true  (11 ist < 10 * 1.15 = 11.5)
 *   istGrenzfall(10, 10, "gt")   → false (10 ist nicht > 10)
 *   istGrenzfall(null, 50, "gte")→ false
 */
function istGrenzfall(wert, schwelle, operator) {
  if (wert === null) {
    return false;
  }
  var obergrenze = schwelle * (1 + GRENZFALL_PROZENT);

  if (operator === "gte") {
    // Mitarbeiter: ≥
    return (wert >= schwelle && wert < obergrenze);
  }
  if (operator === "gt") {
    // Finanzen: >
    return (wert > schwelle && wert <= obergrenze);
  }
  return false;
}


// ═══════════════════════════════════════════════════════════════════════
// TEIL 3: PRÜFSCHRITTE (werden von nis2Pruefung() nacheinander aufgerufen)
// ═══════════════════════════════════════════════════════════════════════

// ─── SCHRITT 1: SONDERMERKMALE ──────────────────────────────────────

/**
 * Prüft alle 8 Sondermerkmale einzeln.
 *
 * Eingabe:  daten.sondermerkmale = ["kritis"] oder []
 * Ausgabe:  { hatSondermerkmal: true/false, merkmalDetails: [...], ... }
 */
function pruefeSondermerkmale(daten) {
  var ergebnis = {
    hatSondermerkmal: false,
    merkmalDetails: [],
    klasseAusSondermerkmal: null,
    brauchtGroesse: false,
  };

  var alleMerkmale = Object.keys(SONDERMERKMALE);
  var eingabeMerkmale = daten.sondermerkmale || [];

  for (var i = 0; i < alleMerkmale.length; i++) {
    var key = alleMerkmale[i];
    var merkmal = SONDERMERKMALE[key];
    var zutreffend = eingabeMerkmale.indexOf(key) !== -1;

    ergebnis.merkmalDetails.push({
      key: key,
      label: merkmal.label,
      zutreffend: zutreffend,
      klasse: merkmal.klasse,
    });

    if (zutreffend) {
      ergebnis.hatSondermerkmal = true;

      // Höchste Klasse behalten: KRITIS/bwE > bwE > wE
      var rangfolge = ["wE", "bwE", "KRITIS/bwE"];
      var aktuellerRang = ergebnis.klasseAusSondermerkmal
        ? rangfolge.indexOf(ergebnis.klasseAusSondermerkmal)
        : -1;
      var neuerRang = rangfolge.indexOf(merkmal.klasse);

      if (neuerRang > aktuellerRang) {
        ergebnis.klasseAusSondermerkmal = merkmal.klasse;
        ergebnis.brauchtGroesse = merkmal.brauchtGroesse;
      }
    }
  }

  return ergebnis;
}


// ─── SCHRITT 2: SEKTORPRÜFUNG ──────────────────────────────────────

/**
 * Bestimmt die Sektorzugehörigkeit (Anhang I, Anhang II, oder keiner).
 *
 * Eingabe:  daten.spiA1_ids = ["iktb2b"],  daten.spiA2_ids = ["post"]
 * Ausgabe:  { anhang: "I"/"II"/null, sektoren: [...], mischsektor: true/false }
 */
function pruefeSektoren(daten) {
  var eingabeA1 = daten.spiA1_ids || [];
  var eingabeA2 = daten.spiA2_ids || [];

  // Nur gültige IDs behalten
  var a1 = eingabeA1.filter(function(id) { return ANHANG1_SEKTOREN[id]; });
  var a2 = eingabeA2.filter(function(id) { return ANHANG2_SEKTOREN[id]; });

  var sektoren = [];
  for (var i = 0; i < a1.length; i++) {
    sektoren.push({ id: a1[i], name: ANHANG1_SEKTOREN[a1[i]], anhang: "I" });
  }
  for (var j = 0; j < a2.length; j++) {
    sektoren.push({ id: a2[j], name: ANHANG2_SEKTOREN[a2[j]], anhang: "II" });
  }

  if (sektoren.length === 0) {
    return { anhang: null, sektoren: [], mischsektor: false };
  }

  return {
    anhang: a1.length > 0 ? "I" : "II",  // Anhang I ist strenger → Vorrang
    sektoren: sektoren,
    mischsektor: (a1.length > 0 && a2.length > 0),
  };
}


// ─── SCHRITT 3: GRÖßENKLASSIFIZIERUNG ─────────────────────────────

/**
 * Bestimmt die Größenklasse: "gross", "mittel", oder "klein".
 *
 * REGELN (aus KMU-Empfehlung + Entscheidungsbaum):
 *
 *   Großes Unternehmen, wenn EINER der folgenden Pfade erfüllt ist:
 *     Pfad A: Mitarbeiter ≥ 250
 *     Pfad B: Umsatz > 50 Mio.  UND  Bilanzsumme > 43 Mio.
 *
 *   Mittleres Unternehmen, wenn EINER der folgenden Pfade erfüllt ist:
 *     Pfad A: Mitarbeiter ≥ 50
 *     Pfad B: Umsatz > 10 Mio.  UND  Bilanzsumme > 10 Mio.
 *
 *   Kleines Unternehmen: Keiner der obigen Pfade erfüllt.
 *
 * KONZERN: Wenn Konzern=ja → Konzernwerte verwenden statt Einzelwerte.
 */
function pruefeGroesse(daten) {
  // Schritt 3a: Maßgebliche Werte bestimmen
  var ma, umsatz, bilanz, basis;

  var istKonzern = (daten.konzern === true || daten.konzern === "ja");
  if (istKonzern) {
    ma      = parseZahl(daten.konzernMA);
    umsatz  = parseZahl(daten.konzernUmsatz);
    bilanz  = parseZahl(daten.konzernBilanz);
    basis   = "konsolidiert (Konzern)";
  } else {
    ma      = parseZahl(daten.mitarbeiter);
    umsatz  = parseZahl(daten.umsatz);
    bilanz  = parseZahl(daten.bilanzsumme);
    basis   = "Einzelunternehmen";
  }

  var ergebnis = {
    ma: ma,
    umsatz: umsatz,
    bilanz: bilanz,
    basis: basis,
    klasse: null,
    klasseLabel: null,
    grenzfaelle: [],
    ueberschritteSchwellen: [],
    fehlendeDaten: [],
  };

  // Fehlende Daten dokumentieren
  if (ma === null)      ergebnis.fehlendeDaten.push("Mitarbeiterzahl");
  if (umsatz === null)  ergebnis.fehlendeDaten.push("Jahresumsatz");
  if (bilanz === null)  ergebnis.fehlendeDaten.push("Jahresbilanzsumme");

  // ─── Prüfung: Großes Unternehmen ───

  // Pfad A: Mitarbeiter ≥ 250
  var grossMA = (ma !== null && ma >= SCHWELLENWERTE.gross_ma);

  // Pfad B: Umsatz > 50 UND Bilanz > 43 (BEIDE müssen erfüllt sein!)
  var grossFinanz = (
    umsatz !== null && bilanz !== null &&
    umsatz > SCHWELLENWERTE.gross_umsatz &&
    bilanz > SCHWELLENWERTE.gross_bilanz
  );

  if (grossMA || grossFinanz) {
    ergebnis.klasse = "gross";
    ergebnis.klasseLabel = "Großes Unternehmen";

    if (grossMA) {
      ergebnis.ueberschritteSchwellen.push(
        "Mitarbeiter: " + ma + " VZÄ ≥ " + SCHWELLENWERTE.gross_ma
      );
      if (istGrenzfall(ma, SCHWELLENWERTE.gross_ma, "gte")) {
        ergebnis.grenzfaelle.push(
          "Mitarbeiterzahl " + ma + " liegt knapp über Schwelle " +
          SCHWELLENWERTE.gross_ma + " (< 15% Abweichung)"
        );
      }
    }
    if (grossFinanz) {
      ergebnis.ueberschritteSchwellen.push(
        "Umsatz: " + umsatz + " Mio. > " + SCHWELLENWERTE.gross_umsatz +
        " Mio. UND Bilanz: " + bilanz + " Mio. > " + SCHWELLENWERTE.gross_bilanz + " Mio."
      );
    }
    return ergebnis;
  }

  // ─── Prüfung: Mittleres Unternehmen ───

  // Pfad A: Mitarbeiter ≥ 50
  var mittelMA = (ma !== null && ma >= SCHWELLENWERTE.mittel_ma);

  // Pfad B: Umsatz > 10 UND Bilanz > 10 (BEIDE müssen erfüllt sein!)
  var mittelFinanz = (
    umsatz !== null && bilanz !== null &&
    umsatz > SCHWELLENWERTE.mittel_umsatz &&
    bilanz > SCHWELLENWERTE.mittel_bilanz
  );

  if (mittelMA || mittelFinanz) {
    ergebnis.klasse = "mittel";
    ergebnis.klasseLabel = "Mittleres Unternehmen";

    if (mittelMA) {
      ergebnis.ueberschritteSchwellen.push(
        "Mitarbeiter: " + ma + " VZÄ ≥ " + SCHWELLENWERTE.mittel_ma
      );
      if (istGrenzfall(ma, SCHWELLENWERTE.mittel_ma, "gte")) {
        ergebnis.grenzfaelle.push(
          "Mitarbeiterzahl " + ma + " liegt knapp über Schwelle " +
          SCHWELLENWERTE.mittel_ma + " (< 15% Abweichung)"
        );
      }
    }
    if (mittelFinanz) {
      ergebnis.ueberschritteSchwellen.push(
        "Umsatz: " + umsatz + " Mio. > " + SCHWELLENWERTE.mittel_umsatz +
        " Mio. UND Bilanz: " + bilanz + " Mio. > " + SCHWELLENWERTE.mittel_bilanz + " Mio."
      );
    }
    return ergebnis;
  }

  // ─── Keiner der Pfade erfüllt → Klein ───
  ergebnis.klasse = "klein";
  ergebnis.klasseLabel = "Klein- / Kleinstunternehmen";
  return ergebnis;
}


// ─── SCHRITT 4: EINRICHTUNGSKLASSE ─────────────────────────────────

/**
 * Bestimmt die finale NIS-2-Pflicht und Einrichtungsklasse.
 *
 * ENTSCHEIDUNGSLOGIK:
 *
 *   1. Sondermerkmal OHNE Größenprüfung?
 *      → JA: Klasse direkt aus Sondermerkmal (bwE, wE, oder KRITIS/bwE)
 *
 *   2. Sondermerkmal MIT Größenprüfung (nur Telekom)?
 *      → Telekom + mittel/gross: bwE
 *      → Telekom + klein: Sondermerkmal ignorieren, weiter mit Schritt 3
 *
 *   3. Kein Sektor erkannt?
 *      → NEIN, nicht erfasst
 *
 *   4. Kleinunternehmen?
 *      → NEIN, nicht erfasst
 *
 *   5. Kombination Sektor + Größe:
 *      → Großes Unternehmen + Anhang I  = bwE
 *      → Mittleres Unternehmen + Anhang I  = wE
 *      → Großes Unternehmen + Anhang II = wE
 *      → Mittleres Unternehmen + Anhang II = wE
 *
 * WICHTIG: Diese Funktion darf die Eingabe-Objekte NICHT verändern!
 */
function bestimmeEinrichtungsklasse(sondermerkmalErgebnis, sektorErgebnis, groesseErgebnis) {
  var result = {
    pflicht: null,
    klasse: null,
    klasseLabel: null,
    rechtsgrundlage: null,
    begruendung: "",
  };

  // ─── Pfad 1: Sondermerkmal vorhanden ───
  if (sondermerkmalErgebnis.hatSondermerkmal) {

    // Telekom-Sonderfall: braucht Größenprüfung
    if (sondermerkmalErgebnis.brauchtGroesse) {
      if (groesseErgebnis.klasse === "mittel" || groesseErgebnis.klasse === "gross") {
        // Telekom + groß genug → bwE
        result.pflicht = "JA";
        result.klasse = "bwE";
        result.klasseLabel = "Besonders wichtige Einrichtung (bwE)";
        result.rechtsgrundlage = "§ 28 Abs. 1 Nr. 3 BSIG-E (Telekommunikation)";
        result.begruendung =
          "Anbieter öffentlicher Telekommunikationsdienste/-netze mit " +
          groesseErgebnis.klasseLabel + " → bwE.";
        return result;
      }
      // Telekom + klein → Sondermerkmal greift NICHT.
      // KEIN sondermerkmalErgebnis.hatSondermerkmal = false! (das wäre Mutation!)
      // Stattdessen: einfach durchfallen lassen zu Pfad 2.
    } else {
      // Alle anderen Sondermerkmale: direkte Zuordnung OHNE Größenprüfung
      result.pflicht = "JA";

      var klasse = sondermerkmalErgebnis.klasseAusSondermerkmal;

      if (klasse === "KRITIS/bwE") {
        result.klasse = "KRITIS/bwE";
        result.klasseLabel = "KRITIS-Betreiber / Besonders wichtige Einrichtung (bwE)";
        result.rechtsgrundlage = "§ 28 Abs. 1 Nr. 2 BSIG-E i.V.m. BSI-KritisV";
      } else if (klasse === "bwE") {
        result.klasse = "bwE";
        result.klasseLabel = "Besonders wichtige Einrichtung (bwE)";
        result.rechtsgrundlage = "§ 28 Abs. 1 BSIG-E i.V.m. Art. 2 Abs. 2 NIS-2-RL";
      } else if (klasse === "wE") {
        result.klasse = "wE";
        result.klasseLabel = "Wichtige Einrichtung (wE)";
        result.rechtsgrundlage = "§ 28 Abs. 2 BSIG-E i.V.m. Art. 2 Abs. 2 NIS-2-RL";
      }

      // Erstes zutreffendes Merkmal für die Begründung finden
      var zutreffendesMerkmal = null;
      for (var i = 0; i < sondermerkmalErgebnis.merkmalDetails.length; i++) {
        if (sondermerkmalErgebnis.merkmalDetails[i].zutreffend) {
          zutreffendesMerkmal = sondermerkmalErgebnis.merkmalDetails[i];
          break;
        }
      }
      result.begruendung = 'Sondermerkmal "' +
        (zutreffendesMerkmal ? zutreffendesMerkmal.label : "unbekannt") +
        '" festgestellt → ' + result.klasseLabel + " (größenunabhängig).";

      return result;
    }
  }

  // ─── Pfad 2: Reguläre Prüfung (Sektor + Größe) ───

  // Kein NIS-2-Sektor erkannt
  if (!sektorErgebnis.anhang) {
    result.pflicht = "NEIN";
    result.klasse = null;
    result.klasseLabel = "Nicht erfasst";
    result.begruendung = "Kein NIS-2-Sektor erkannt.";
    return result;
  }

  // Kleinunternehmen
  if (groesseErgebnis.klasse === "klein") {
    result.pflicht = "NEIN";
    result.klasse = null;
    result.klasseLabel = "Nicht erfasst";
    result.begruendung =
      groesseErgebnis.klasseLabel + " – Schwellenwerte für mittlere " +
      "Unternehmen nicht erreicht.";
    return result;
  }

  // ─── Kombination Anhang + Größe ───

  result.pflicht = "JA";

  if (groesseErgebnis.klasse === "gross" && sektorErgebnis.anhang === "I") {
    result.klasse = "bwE";
    result.klasseLabel = "Besonders wichtige Einrichtung (bwE)";
    result.rechtsgrundlage = "§ 28 Abs. 1 Nr. 1 BSIG-E i.V.m. Anhang I NIS-2-RL";
    result.begruendung = groesseErgebnis.klasseLabel + " im Anhang-I-Sektor → bwE.";

  } else if (groesseErgebnis.klasse === "mittel" && sektorErgebnis.anhang === "I") {
    result.klasse = "wE";
    result.klasseLabel = "Wichtige Einrichtung (wE)";
    result.rechtsgrundlage = "§ 28 Abs. 2 Nr. 1 BSIG-E";
    result.begruendung = groesseErgebnis.klasseLabel + " im Anhang-I-Sektor → wE.";

  } else if (groesseErgebnis.klasse === "gross" && sektorErgebnis.anhang === "II") {
    result.klasse = "wE";
    result.klasseLabel = "Wichtige Einrichtung (wE)";
    result.rechtsgrundlage = "§ 28 Abs. 2 Nr. 2 BSIG-E";
    result.begruendung = groesseErgebnis.klasseLabel + " im Anhang-II-Sektor → wE.";

  } else if (groesseErgebnis.klasse === "mittel" && sektorErgebnis.anhang === "II") {
    result.klasse = "wE";
    result.klasseLabel = "Wichtige Einrichtung (wE)";
    result.rechtsgrundlage = "§ 28 Abs. 2 Nr. 2 BSIG-E";
    result.begruendung = groesseErgebnis.klasseLabel + " im Anhang-II-Sektor → wE.";
  }

  return result;
}


// ─── SCHRITT 5: GRENZFALLPRÜFUNG ───────────────────────────────────

/**
 * Prüft ob ein Grenzfall vorliegt.
 * Wenn JA + Grenzfallgründe → ändert pflicht zu "GRENZFALL".
 */
function pruefeGrenzfall(einrichtungsErgebnis, groesseErgebnis, sektorErgebnis) {
  var gruende = [];

  // Grund 1: Schwellenwert-Nähe (< 15%)
  for (var i = 0; i < groesseErgebnis.grenzfaelle.length; i++) {
    gruende.push(groesseErgebnis.grenzfaelle[i]);
  }

  // Grund 2: Mischsektor
  if (sektorErgebnis.mischsektor) {
    gruende.push(
      "Mischsektor: Tätigkeiten fallen sowohl unter Anhang I als auch Anhang II."
    );
  }

  // Grund 3: Fehlende Daten
  if (groesseErgebnis.fehlendeDaten.length > 0) {
    gruende.push(
      "Fehlende Angaben: " + groesseErgebnis.fehlendeDaten.join(", ") + "."
    );
  }

  // Wenn pflicht=JA UND Grenzfallgründe existieren → GRENZFALL
  if (einrichtungsErgebnis.pflicht === "JA" && gruende.length > 0) {
    einrichtungsErgebnis.pflicht = "GRENZFALL";
    einrichtungsErgebnis.begruendung += " GRENZFALL: " + gruende.join(" ");
  }

  return {
    istGrenzfall: (gruende.length > 0),
    gruende: gruende,
  };
}


// ─── SCHRITT 6: LIEFERKETTEN-ANALYSE ───────────────────────────────

/**
 * Bewertet die indirekte NIS-2-Betroffenheit über Lieferkettenbeziehungen.
 *
 * WICHTIG: Ändert NIEMALS das formale NIS-2-Ergebnis (JA/NEIN/GRENZFALL).
 *          Die Lieferkette ist ein SEPARATER Bewertungsabschnitt.
 *
 * Risiko-Logik:
 *   HOCH:    IT-Zugriff auf Kundensysteme UND (kritische IT-Dienste ODER kritischer Kundensektor)
 *   MITTEL:  IT-Zugriff ODER kritische IT-Dienste ODER kritischer Kundensektor (eins davon)
 *   NIEDRIG: Keines der obigen
 *
 * @returns {Object|null} null wenn keine Lieferbeziehung oder "nein"/"unbekannt"
 */
function pruefeLieferkette(daten) {
  var lk = daten.lieferkette;

  // Kein Block 8 oder keine Beziehung
  if (!lk) return null;
  if (!lk.hatBeziehung) return null;
  if (lk.hatBeziehung === "nein") return null;
  if (lk.hatBeziehung === "unbekannt") return null;

  var result = {
    hatBeziehung: true,
    kundenSektoren: lk.kundenSektoren || [],
    artLeistung: lk.artLeistung || "",
    itZugriff: lk.itZugriff || false,
    vertraglicheAnforderungen: lk.vertraglicheAnforderungen || "",
    risiko: "NIEDRIG",
    begruendung: "",
  };

  // Drei Risikofaktoren einzeln prüfen
  var hatITZugriff = (lk.itZugriff === true || lk.itZugriff === "ja");

  var kritischeITRegex = /managed.?service|cloud|software|hosting|rechenzentrum|saas|iaas|paas/i;
  var kritischeIT = kritischeITRegex.test(lk.artLeistung || "");

  var kritischerKundeRegex = /kritis|energie|gesundheit|trinkwasser|digital|bank|finanz|transport|verwaltung|weltraum|abwasser/i;
  var kundenSektorenText = (lk.kundenSektoren || []).join(" ");
  var kritischerKunde = kritischerKundeRegex.test(kundenSektorenText);

  // Risikobewertung (3 Stufen)
  if (hatITZugriff && (kritischeIT || kritischerKunde)) {
    result.risiko = "HOCH";
    result.begruendung =
      "Direkter IT-Zugriff auf Systeme von NIS-2-pflichtigen Kunden " +
      "und/oder Erbringung kritischer IT-Dienste → hohes Risiko.";
  } else if (hatITZugriff || kritischeIT || kritischerKunde) {
    result.risiko = "MITTEL";
    result.begruendung =
      "Geschäftsbeziehung zu NIS-2-pflichtigen Kunden mit IT-Berührungspunkten " +
      "oder in kritischem Sektor → mittleres Risiko.";
  } else {
    result.risiko = "NIEDRIG";
    result.begruendung =
      "Gelegentliche Geschäftsbeziehung ohne wesentliche IT-Berührungspunkte → " +
      "niedriges Risiko.";
  }

  return result;
}


// ═══════════════════════════════════════════════════════════════════════
// TEIL 4: HAUPTFUNKTION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Führt die vollständige NIS-2-Betroffenheitsprüfung durch.
 *
 * Ruft die 6 Prüfschritte in fester Reihenfolge auf:
 *   Schritt 1: Sondermerkmale    → Gibt es größenunabhängige Pflichten?
 *   Schritt 2: Sektoren          → Welcher NIS-2-Sektor (Anhang I/II)?
 *   Schritt 3: Größe             → Großes/mittleres/kleines Unternehmen?
 *   Schritt 4: Einrichtungsklasse→ bwE, wE, oder nicht erfasst?
 *   Schritt 5: Grenzfall         → Knapp über Schwelle? Fehlende Daten?
 *   Schritt 6: Lieferkette       → Indirekte Betroffenheit als Zulieferer?
 */
function nis2Pruefung(daten) {
  // Eingabe validieren
  if (!daten || typeof daten !== "object") {
    return {
      version: "2.2",
      fehler: "Keine gültigen Eingabedaten übergeben.",
      ergebnis: null,
    };
  }

  var s1 = pruefeSondermerkmale(daten);
  var s2 = pruefeSektoren(daten);
  var s3 = pruefeGroesse(daten);
  var s4 = bestimmeEinrichtungsklasse(s1, s2, s3);
  var s5 = pruefeGrenzfall(s4, s3, s2);
  var s6 = pruefeLieferkette(daten);

  return {
    version: "2.2",
    schritte: {
      sondermerkmale: s1,
      sektoren: s2,
      groesse: s3,
      einrichtungsklasse: s4,
      grenzfall: s5,
      lieferkette: s6,
    },
    ergebnis: {
      pflicht: s4.pflicht,
      klasse: s4.klasse,
      klasseLabel: s4.klasseLabel,
      rechtsgrundlage: s4.rechtsgrundlage,
      begruendung: s4.begruendung,
      grenzfall: s5.istGrenzfall,
      indirekteBetroffenheit: s6 ? s6.risiko : null,
    },
  };
}


// ═══════════════════════════════════════════════════════════════════════
// TEIL 5: EXPORT
// ═══════════════════════════════════════════════════════════════════════

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    nis2Pruefung:                nis2Pruefung,
    pruefeSondermerkmale:        pruefeSondermerkmale,
    pruefeSektoren:              pruefeSektoren,
    pruefeGroesse:               pruefeGroesse,
    bestimmeEinrichtungsklasse:  bestimmeEinrichtungsklasse,
    pruefeGrenzfall:             pruefeGrenzfall,
    pruefeLieferkette:           pruefeLieferkette,
    parseZahl:                   parseZahl,
    istGrenzfall:                istGrenzfall,
    SCHWELLENWERTE:              SCHWELLENWERTE,
    SONDERMERKMALE:              SONDERMERKMALE,
    ANHANG1_SEKTOREN:            ANHANG1_SEKTOREN,
    ANHANG2_SEKTOREN:            ANHANG2_SEKTOREN,
  };
}
