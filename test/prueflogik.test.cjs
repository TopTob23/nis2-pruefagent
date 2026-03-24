/**
 * Automatisierte Tests fuer prueflogik.js
 * VERSION: 2.2
 *
 * AUSFUEHREN: node test/prueflogik.test.js
 *
 * ALLE 35 TESTS MUESSEN BESTEHEN.
 */

var logik = require("./prueflogik.cjs");
var integration = require("./integration.cjs");

var bestanden = 0;
var fehlgeschlagen = 0;

function test(name, tatsaechlich, erwartet) {
  if (tatsaechlich === erwartet) {
    console.log("  ✅ " + name);
    bestanden++;
  } else {
    console.log("  ❌ " + name);
    console.log("     Erwartet: " + JSON.stringify(erwartet));
    console.log("     Erhalten: " + JSON.stringify(tatsaechlich));
    fehlgeschlagen++;
  }
}


console.log("\n═══ Szenario 1: IT-MSP, 120 VZÄ, NIS-2-Kunden ═══");
console.log("Erwartet: JA | wE + Lieferkette HOCH\n");
(function() {
  var r = logik.nis2Pruefung({
    sondermerkmale: [],
    spiA1_ids: ["iktb2b"],
    spiA2_ids: [],
    mitarbeiter: "120",
    umsatz: "18",
    bilanzsumme: "12",
    konzern: "nein",
    lieferkette: {
      hatBeziehung: "ja",
      kundenSektoren: ["Energie", "Gesundheit"],
      artLeistung: "Managed Services, Cloud-Hosting",
      itZugriff: "ja",
    },
  });
  test("Pflicht = JA", r.ergebnis.pflicht, "JA");
  test("Klasse = wE", r.ergebnis.klasse, "wE");
  test("Lieferkette = HOCH", r.ergebnis.indirekteBetroffenheit, "HOCH");
})();

console.log("\n═══ Szenario 2: Bioladen, 8 VZÄ, keine NIS-2-Kunden ═══");
console.log("Erwartet: NEIN, kein Abschnitt 4a\n");
(function() {
  var r = logik.nis2Pruefung({
    sondermerkmale: [],
    spiA1_ids: [],
    spiA2_ids: [],
    mitarbeiter: "8",
    umsatz: "0.5",
    bilanzsumme: "0.3",
    konzern: "nein",
    lieferkette: { hatBeziehung: "nein" },
  });
  test("Pflicht = NEIN", r.ergebnis.pflicht, "NEIN");
  test("Lieferkette = null", r.ergebnis.indirekteBetroffenheit, null);
})();

console.log("\n═══ Szenario 3: Softwarehaus, 30 VZÄ, KRITIS-Zulieferer ═══");
console.log("Erwartet: NEIN + Lieferkette HOCH\n");
(function() {
  var r = logik.nis2Pruefung({
    sondermerkmale: [],
    spiA1_ids: ["iktb2b"],
    spiA2_ids: [],
    mitarbeiter: "30",
    umsatz: "5",
    bilanzsumme: "3",
    konzern: "nein",
    lieferkette: {
      hatBeziehung: "ja",
      kundenSektoren: ["KRITIS-Betreiber Energie"],
      artLeistung: "Softwareentwicklung",
      itZugriff: "ja",
    },
  });
  test("Pflicht = NEIN", r.ergebnis.pflicht, "NEIN");
  test("Lieferkette = HOCH", r.ergebnis.indirekteBetroffenheit, "HOCH");
})();

console.log("\n═══ Szenario 4: Beratung, 52 VZÄ, Bankwesen-Kunden ═══");
console.log("Erwartet: GRENZFALL + Lieferkette MITTEL\n");
(function() {
  var r = logik.nis2Pruefung({
    sondermerkmale: [],
    spiA1_ids: ["bankwesen"],
    spiA2_ids: [],
    mitarbeiter: "52",
    umsatz: "9.8",
    bilanzsumme: "8",
    konzern: "nein",
    lieferkette: {
      hatBeziehung: "ja",
      kundenSektoren: ["Bankwesen"],
      artLeistung: "Unternehmensberatung",
      itZugriff: "nein",
    },
  });
  test("Pflicht = GRENZFALL", r.ergebnis.pflicht, "GRENZFALL");
  test("Lieferkette = MITTEL", r.ergebnis.indirekteBetroffenheit, "MITTEL");
})();

console.log("\n═══ Szenario 5: Logistik, 200 VZÄ, Lieferkette unbekannt ═══");
console.log("Erwartet: JA | wE, kein Abschnitt 4a\n");
(function() {
  var r = logik.nis2Pruefung({
    sondermerkmale: [],
    spiA1_ids: ["transport"],
    spiA2_ids: [],
    mitarbeiter: "200",
    umsatz: "40",
    bilanzsumme: "25",
    konzern: "nein",
    lieferkette: { hatBeziehung: "unbekannt" },
  });
  test("Pflicht = JA", r.ergebnis.pflicht, "JA");
  test("Klasse = wE", r.ergebnis.klasse, "wE");
  test("Lieferkette = null", r.ergebnis.indirekteBetroffenheit, null);
})();


console.log("\n═══ Fix 1a: KRITIS → KRITIS/bwE (ohne Größe) ═══\n");
(function() {
  var r = logik.nis2Pruefung({
    sondermerkmale: ["kritis"],
    spiA1_ids: ["energie"],
    spiA2_ids: [],
    mitarbeiter: "5",
    umsatz: "0.5",
    bilanzsumme: "0.3",
    konzern: "nein",
  });
  test("Pflicht = JA", r.ergebnis.pflicht, "JA");
  test("Klasse = KRITIS/bwE", r.ergebnis.klasse, "KRITIS/bwE");
})();

console.log("\n═══ Fix 1b: Nicht-qual. VDA → wE (NICHT bwE!) ═══\n");
(function() {
  var r = logik.nis2Pruefung({
    sondermerkmale: ["nichtQualVDA"],
    spiA1_ids: ["digitalinfra"],
    spiA2_ids: [],
    mitarbeiter: "10",
    umsatz: "2",
    bilanzsumme: "1",
    konzern: "nein",
  });
  test("Pflicht = JA", r.ergebnis.pflicht, "JA");
  test("Klasse = wE", r.ergebnis.klasse, "wE");
})();

console.log("\n═══ Fix 1c: Qual. VDA → bwE (ohne Größe) ═══\n");
(function() {
  var r = logik.nis2Pruefung({
    sondermerkmale: ["qualVDA"],
    spiA1_ids: ["digitalinfra"],
    spiA2_ids: [],
    mitarbeiter: "3",
    umsatz: "0.2",
    bilanzsumme: "0.1",
    konzern: "nein",
  });
  test("Pflicht = JA", r.ergebnis.pflicht, "JA");
  test("Klasse = bwE", r.ergebnis.klasse, "bwE");
})();


console.log("\n═══ Fix 2a: Umsatz exakt 10 + Bilanz 15 → NICHT mittel ═══\n");
(function() {
  var r = logik.pruefeGroesse({
    mitarbeiter: "40",
    umsatz: "10.0",
    bilanzsumme: "15.0",
    konzern: "nein",
  });
  test("Klasse = klein (10.0 ist NICHT > 10)", r.klasse, "klein");
})();

console.log("\n═══ Fix 2b: Umsatz 10.01 + Bilanz 10.01 → mittel ═══\n");
(function() {
  var r = logik.pruefeGroesse({
    mitarbeiter: "40",
    umsatz: "10.01",
    bilanzsumme: "10.01",
    konzern: "nein",
  });
  test("Klasse = mittel", r.klasse, "mittel");
})();

console.log("\n═══ Fix 2c: Mitarbeiter exakt 50 → mittel (≥ bei MA!) ═══\n");
(function() {
  var r = logik.pruefeGroesse({
    mitarbeiter: "50",
    umsatz: "5",
    bilanzsumme: "3",
    konzern: "nein",
  });
  test("Klasse = mittel (50 ≥ 50)", r.klasse, "mittel");
})();


console.log("\n═══ Fix 3a: Telekom + groß → bwE ═══\n");
(function() {
  var r = logik.nis2Pruefung({
    sondermerkmale: ["telekom"],
    spiA1_ids: ["digitalinfra"],
    spiA2_ids: [],
    mitarbeiter: "300",
    umsatz: "60",
    bilanzsumme: "50",
    konzern: "nein",
  });
  test("Pflicht = JA", r.ergebnis.pflicht, "JA");
  test("Klasse = bwE", r.ergebnis.klasse, "bwE");
})();

console.log("\n═══ Fix 3b: Telekom + klein → NEIN (fällt durch) ═══\n");
(function() {
  var r = logik.nis2Pruefung({
    sondermerkmale: ["telekom"],
    spiA1_ids: ["digitalinfra"],
    spiA2_ids: [],
    mitarbeiter: "10",
    umsatz: "2",
    bilanzsumme: "1",
    konzern: "nein",
  });
  test("Pflicht = NEIN", r.ergebnis.pflicht, "NEIN");
})();

console.log("\n═══ Fix 3c: Telekom + mittel → bwE ═══\n");
(function() {
  var r = logik.nis2Pruefung({
    sondermerkmale: ["telekom"],
    spiA1_ids: ["digitalinfra"],
    spiA2_ids: [],
    mitarbeiter: "80",
    umsatz: "15",
    bilanzsumme: "12",
    konzern: "nein",
  });
  test("Pflicht = JA", r.ergebnis.pflicht, "JA");
  test("Klasse = bwE", r.ergebnis.klasse, "bwE");
})();


console.log("\n═══ Fix 4a: Nur Umsatz > 10, Bilanz ≤ 10 → NICHT mittel ═══\n");
(function() {
  var r = logik.pruefeGroesse({
    mitarbeiter: "40",
    umsatz: "15",
    bilanzsumme: "8",
    konzern: "nein",
  });
  test("Klasse = klein (Umsatz allein reicht NICHT)", r.klasse, "klein");
})();

console.log("\n═══ Fix 4b: Nur Bilanz > 10, Umsatz ≤ 10 → NICHT mittel ═══\n");
(function() {
  var r = logik.pruefeGroesse({
    mitarbeiter: "40",
    umsatz: "8",
    bilanzsumme: "15",
    konzern: "nein",
  });
  test("Klasse = klein (Bilanz allein reicht NICHT)", r.klasse, "klein");
})();

console.log("\n═══ Fix 4c: Umsatz > 10 UND Bilanz > 10 → mittel ═══\n");
(function() {
  var r = logik.pruefeGroesse({
    mitarbeiter: "40",
    umsatz: "15",
    bilanzsumme: "15",
    konzern: "nein",
  });
  test("Klasse = mittel (BEIDE Finanzwerte > 10)", r.klasse, "mittel");
})();

console.log("\n═══ Fix 4d: Umsatz > 50 aber Bilanz ≤ 43 → NICHT gross ═══\n");
(function() {
  var r = logik.pruefeGroesse({
    mitarbeiter: "200",
    umsatz: "55",
    bilanzsumme: "40",
    konzern: "nein",
  });
  test("Klasse = mittel (nicht gross! Bilanz ≤ 43)", r.klasse, "mittel");
})();


console.log("\n═══ Fix 5: Telekom + klein mutiert NICHT das Eingabe-Objekt ═══\n");
(function() {
  var sondermerkmale = { hatSondermerkmal: true, brauchtGroesse: true,
    klasseAusSondermerkmal: "bwE", merkmalDetails: [] };
  var sektoren = { anhang: "I", sektoren: [], mischsektor: false };
  var groesse = { klasse: "klein", klasseLabel: "Klein", grenzfaelle: [],
    ueberschritteSchwellen: [], fehlendeDaten: [] };

  logik.bestimmeEinrichtungsklasse(sondermerkmale, sektoren, groesse);

  test("hatSondermerkmal ist IMMER NOCH true", sondermerkmale.hatSondermerkmal, true);
})();


console.log("\n═══ Konzern: Einzelwerte klein, Konzernwerte groß ═══\n");
(function() {
  var r = logik.nis2Pruefung({
    sondermerkmale: [],
    spiA1_ids: ["iktb2b"],
    spiA2_ids: [],
    mitarbeiter: "30",
    umsatz: "5",
    bilanzsumme: "3",
    konzern: "ja",
    konzernMA: "500",
    konzernUmsatz: "80",
    konzernBilanz: "60",
  });
  test("Pflicht = JA", r.ergebnis.pflicht, "JA");
  test("Klasse = bwE (Groß + Anhang I)", r.ergebnis.klasse, "bwE");
  test("Basis = konsolidiert", r.schritte.groesse.basis, "konsolidiert (Konzern)");
})();


console.log("\n═══ Integration: konvertiereApiAntwort mit null-Werten ═══\n");
(function() {
  var konvertiert = integration.konvertiereApiAntwort({
    orgName: "Test GmbH",
    mitarbeiter: null,
    umsatz: undefined,
    bilanzsumme: "",
    spiA1_ids: null,
    spiA2_ids: ["post"],
    sondermerkmale: null,
    konzern: "JA",
    lieferkette: null,
  });
  test("mitarbeiter = leerer String", konvertiert.mitarbeiter, "");
  test("umsatz = leerer String", konvertiert.umsatz, "");
  test("spiA1_ids = leeres Array", JSON.stringify(konvertiert.spiA1_ids), "[]");
  test("sondermerkmale = leeres Array", JSON.stringify(konvertiert.sondermerkmale), "[]");
  test("konzern = ja (normalisiert)", konvertiert.konzern, "ja");
  test("lieferkette = null", konvertiert.lieferkette, null);
})();

console.log("\n═══ Integration: konvertiereApiAntwort mit null-Input ═══\n");
(function() {
  var konvertiert = integration.konvertiereApiAntwort(null);
  test("sondermerkmale = leeres Array", JSON.stringify(konvertiert.sondermerkmale), "[]");
  test("konzern = nein", konvertiert.konzern, "nein");
})();


console.log("\n═══ parseZahl: verschiedene Eingabeformate ═══\n");
(function() {
  test('parseZahl("120") = 120', logik.parseZahl("120"), 120);
  test('parseZahl("18,5") = 18.5', logik.parseZahl("18,5"), 18.5);
  test('parseZahl("18.5") = 18.5', logik.parseZahl("18.5"), 18.5);
  test('parseZahl("") = null', logik.parseZahl(""), null);
  test('parseZahl(null) = null', logik.parseZahl(null), null);
  test('parseZahl(undefined) = null', logik.parseZahl(undefined), null);
})();


console.log("\n═══════════════════════════════════════════════════════════");
console.log("   ERGEBNIS: " + bestanden + " bestanden, " + fehlgeschlagen + " fehlgeschlagen");
console.log("═══════════════════════════════════════════════════════════\n");

if (fehlgeschlagen > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
