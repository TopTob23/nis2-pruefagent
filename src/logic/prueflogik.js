/**
 * NIS-2-Betroffenheitspruefung - Entscheidungslogik
 * VERSION: 2.2 (ES Module)
 *
 * Converted from CommonJS to ES Module for Vite/React.
 * Logic is EXACTLY the same as the original prueflogik.js v2.2.
 */


// TEIL 1: KONSTANTEN

const SCHWELLENWERTE = {
  mittel_ma:      50,
  mittel_umsatz:  10,
  mittel_bilanz:  10,
  gross_ma:       250,
  gross_umsatz:   50,
  gross_bilanz:   43,
};

const GRENZFALL_PROZENT = 0.15;

export const SONDERMERKMALE = {
  kritis: {
    label: "KRITIS-Betreiber (BSI-KritisV)",
    klasse: "KRITIS/bwE",
    brauchtGroesse: false,
  },
  telekom: {
    label: "Anbieter öffentlicher Telekommunikationsdienste/-netze",
    klasse: "bwE",
    brauchtGroesse: true,
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
    klasse: "wE",
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

export const ANHANG1_SEKTOREN = {
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

export const ANHANG2_SEKTOREN = {
  post:            "Post- und Kurierdienste",
  abfall:          "Abfallbewirtschaftung",
  chemie:          "Chemie",
  lebensmittel:    "Lebensmittel",
  verarbeitend:    "Verarbeitendes Gewerbe / Herstellung von Waren",
  digitaledienste: "Anbieter digitaler Dienste",
  forschung:       "Forschung",
};


// TEIL 2: HILFSFUNKTIONEN

export function parseZahl(wert) {
  if (wert === null || wert === undefined || wert === "") {
    return null;
  }
  const bereinigt = String(wert).replace(",", ".").replace(/[^\d.\-]/g, "");
  const zahl = parseFloat(bereinigt);
  if (isNaN(zahl)) {
    return null;
  }
  return zahl;
}

function istGrenzfall(wert, schwelle, operator) {
  if (wert === null) {
    return false;
  }
  const obergrenze = schwelle * (1 + GRENZFALL_PROZENT);

  if (operator === "gte") {
    return (wert >= schwelle && wert < obergrenze);
  }
  if (operator === "gt") {
    return (wert > schwelle && wert <= obergrenze);
  }
  return false;
}


// TEIL 3: PRUEFSCHRITTE

function pruefeSondermerkmale(daten) {
  const ergebnis = {
    hatSondermerkmal: false,
    merkmalDetails: [],
    klasseAusSondermerkmal: null,
    brauchtGroesse: false,
  };

  const alleMerkmale = Object.keys(SONDERMERKMALE);
  const eingabeMerkmale = daten.sondermerkmale || [];

  for (let i = 0; i < alleMerkmale.length; i++) {
    const key = alleMerkmale[i];
    const merkmal = SONDERMERKMALE[key];
    const zutreffend = eingabeMerkmale.indexOf(key) !== -1;

    ergebnis.merkmalDetails.push({
      key: key,
      label: merkmal.label,
      zutreffend: zutreffend,
      klasse: merkmal.klasse,
    });

    if (zutreffend) {
      ergebnis.hatSondermerkmal = true;

      const rangfolge = ["wE", "bwE", "KRITIS/bwE"];
      const aktuellerRang = ergebnis.klasseAusSondermerkmal
        ? rangfolge.indexOf(ergebnis.klasseAusSondermerkmal)
        : -1;
      const neuerRang = rangfolge.indexOf(merkmal.klasse);

      if (neuerRang > aktuellerRang) {
        ergebnis.klasseAusSondermerkmal = merkmal.klasse;
        ergebnis.brauchtGroesse = merkmal.brauchtGroesse;
      }
    }
  }

  return ergebnis;
}

function pruefeSektoren(daten) {
  const eingabeA1 = daten.spiA1_ids || [];
  const eingabeA2 = daten.spiA2_ids || [];

  const a1 = eingabeA1.filter(function(id) { return ANHANG1_SEKTOREN[id]; });
  const a2 = eingabeA2.filter(function(id) { return ANHANG2_SEKTOREN[id]; });

  const sektoren = [];
  for (let i = 0; i < a1.length; i++) {
    sektoren.push({ id: a1[i], name: ANHANG1_SEKTOREN[a1[i]], anhang: "I" });
  }
  for (let j = 0; j < a2.length; j++) {
    sektoren.push({ id: a2[j], name: ANHANG2_SEKTOREN[a2[j]], anhang: "II" });
  }

  if (sektoren.length === 0) {
    return { anhang: null, sektoren: [], mischsektor: false };
  }

  return {
    anhang: a1.length > 0 ? "I" : "II",
    sektoren: sektoren,
    mischsektor: (a1.length > 0 && a2.length > 0),
  };
}

export function pruefeGroesse(daten) {
  let ma, umsatz, bilanz, basis;

  const istKonzern = (daten.konzern === true || daten.konzern === "ja");
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

  const ergebnis = {
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

  if (ma === null)      ergebnis.fehlendeDaten.push("Mitarbeiterzahl");
  if (umsatz === null)  ergebnis.fehlendeDaten.push("Jahresumsatz");
  if (bilanz === null)  ergebnis.fehlendeDaten.push("Jahresbilanzsumme");

  const grossMA = (ma !== null && ma >= SCHWELLENWERTE.gross_ma);
  const grossFinanz = (
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

  const mittelMA = (ma !== null && ma >= SCHWELLENWERTE.mittel_ma);
  const mittelFinanz = (
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

  ergebnis.klasse = "klein";
  ergebnis.klasseLabel = "Klein- / Kleinstunternehmen";
  return ergebnis;
}

export function bestimmeEinrichtungsklasse(sondermerkmalErgebnis, sektorErgebnis, groesseErgebnis) {
  const result = {
    pflicht: null,
    klasse: null,
    klasseLabel: null,
    rechtsgrundlage: null,
    begruendung: "",
  };

  if (sondermerkmalErgebnis.hatSondermerkmal) {
    if (sondermerkmalErgebnis.brauchtGroesse) {
      if (groesseErgebnis.klasse === "mittel" || groesseErgebnis.klasse === "gross") {
        result.pflicht = "JA";
        result.klasse = "bwE";
        result.klasseLabel = "Besonders wichtige Einrichtung (bwE)";
        result.rechtsgrundlage = "§ 28 Abs. 1 Nr. 3 BSIG-E (Telekommunikation)";
        result.begruendung =
          "Anbieter öffentlicher Telekommunikationsdienste/-netze mit " +
          groesseErgebnis.klasseLabel + " → bwE.";
        return result;
      }
    } else {
      result.pflicht = "JA";

      const klasse = sondermerkmalErgebnis.klasseAusSondermerkmal;

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

      let zutreffendesMerkmal = null;
      for (let i = 0; i < sondermerkmalErgebnis.merkmalDetails.length; i++) {
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

  if (!sektorErgebnis.anhang) {
    result.pflicht = "NEIN";
    result.klasse = null;
    result.klasseLabel = "Nicht erfasst";
    result.begruendung = "Kein NIS-2-Sektor erkannt.";
    return result;
  }

  if (groesseErgebnis.klasse === "klein") {
    result.pflicht = "NEIN";
    result.klasse = null;
    result.klasseLabel = "Nicht erfasst";
    result.begruendung =
      groesseErgebnis.klasseLabel + " – Schwellenwerte für mittlere " +
      "Unternehmen nicht erreicht.";
    return result;
  }

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

function pruefeGrenzfall(einrichtungsErgebnis, groesseErgebnis, sektorErgebnis) {
  const gruende = [];

  for (let i = 0; i < groesseErgebnis.grenzfaelle.length; i++) {
    gruende.push(groesseErgebnis.grenzfaelle[i]);
  }

  if (sektorErgebnis.mischsektor) {
    gruende.push(
      "Mischsektor: Tätigkeiten fallen sowohl unter Anhang I als auch Anhang II."
    );
  }

  if (groesseErgebnis.fehlendeDaten.length > 0) {
    gruende.push(
      "Fehlende Angaben: " + groesseErgebnis.fehlendeDaten.join(", ") + "."
    );
  }

  if (einrichtungsErgebnis.pflicht === "JA" && gruende.length > 0) {
    einrichtungsErgebnis.pflicht = "GRENZFALL";
    einrichtungsErgebnis.begruendung += " GRENZFALL: " + gruende.join(" ");
  }

  return {
    istGrenzfall: (gruende.length > 0),
    gruende: gruende,
  };
}

function pruefeLieferkette(daten) {
  const lk = daten.lieferkette;

  if (!lk) return null;
  if (!lk.hatBeziehung) return null;
  if (lk.hatBeziehung === "nein") return null;
  if (lk.hatBeziehung === "unbekannt") return null;

  const result = {
    hatBeziehung: true,
    kundenSektoren: lk.kundenSektoren || [],
    artLeistung: lk.artLeistung || "",
    itZugriff: lk.itZugriff || false,
    vertraglicheAnforderungen: lk.vertraglicheAnforderungen || "",
    risiko: "NIEDRIG",
    begruendung: "",
  };

  const hatITZugriff = (lk.itZugriff === true || lk.itZugriff === "ja");

  const kritischeITRegex = /managed.?service|cloud|software|hosting|rechenzentrum|saas|iaas|paas/i;
  const kritischeIT = kritischeITRegex.test(lk.artLeistung || "");

  const kritischerKundeRegex = /kritis|energie|gesundheit|trinkwasser|digital|bank|finanz|transport|verwaltung|weltraum|abwasser/i;
  const kundenSektorenText = (lk.kundenSektoren || []).join(" ");
  const kritischerKunde = kritischerKundeRegex.test(kundenSektorenText);

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


// TEIL 4: HAUPTFUNKTION

export function nis2Pruefung(daten) {
  if (!daten || typeof daten !== "object") {
    return {
      version: "2.2",
      fehler: "Keine gültigen Eingabedaten übergeben.",
      ergebnis: null,
    };
  }

  const s1 = pruefeSondermerkmale(daten);
  const s2 = pruefeSektoren(daten);
  const s3 = pruefeGroesse(daten);
  const s4 = bestimmeEinrichtungsklasse(s1, s2, s3);
  const s5 = pruefeGrenzfall(s4, s3, s2);
  const s6 = pruefeLieferkette(daten);

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

/**
 * Gibt die Sektornamen fuer die ausgewaehlten IDs zurueck.
 * Works with the new {id: label} format.
 */
export function getSektorNamen(spiA1_ids, spiA2_ids) {
  const namen = [];
  for (const id of (spiA1_ids || [])) {
    if (ANHANG1_SEKTOREN[id]) namen.push(ANHANG1_SEKTOREN[id]);
  }
  for (const id of (spiA2_ids || [])) {
    if (ANHANG2_SEKTOREN[id]) namen.push(ANHANG2_SEKTOREN[id]);
  }
  return namen;
}
