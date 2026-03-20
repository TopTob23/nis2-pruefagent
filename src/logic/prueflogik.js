import { ANLAGE1, ANLAGE2 } from "../constants/sectors";

/**
 * NIS-2 Betroffenheitsprüfung – Kernlogik
 *
 * Berechnet auf Basis der Formulardaten:
 * - Größenklassifizierung (Klein/Mittel/Groß)
 * - Sektorzuordnung (Anlage 1 / Anlage 2)
 * - Sondermerkmal-Override
 * - Einrichtungsklasse (WE/bwE, WiE, Nicht erfasst)
 * - Grenzfallprüfung (< 15% über Schwellenwert)
 * - Indirekte Betroffenheit (Lieferkette)
 */
export function berechneErgebnis(d) {
  const hs = d.sondermerkmale.length > 0;
  const h1 = d.spiA1.length > 0;
  const h2 = d.spiA2.length > 0;

  // Konzernkonsolidierung
  const ma = d.konzern === "ja" && d.konzernMA ? +d.konzernMA : +d.mitarbeiter || 0;
  const um = d.konzern === "ja" && d.konzernUmsatz ? +d.konzernUmsatz : +d.umsatz || 0;
  const bi = d.konzern === "ja" && d.konzernBilanz ? +d.konzernBilanz : +d.bilanzsumme || 0;

  // Größenklassifizierung nach KMU-Empfehlung 2003/361/EG
  const gr = ma >= 250 || (um >= 50 && bi >= 43);
  const mi = !gr && (ma >= 50 || um >= 10 || bi >= 10);
  const kl = !gr && !mi;

  // Grenzfallprüfung: < 15% über Schwellenwert
  const gz =
    (gr && ma < 287.5 && ma >= 250) ||
    (ma > 0 && ma < 250 && ma >= 212.5) ||
    (ma > 0 && ma < 50 && ma >= 42.5);

  // Ergebnis bestimmen
  let p = "NEIN";
  let k = "Nicht erfasst";
  let rg = "";

  if (hs) {
    p = "JA";
    k = "Wesentliche Einrichtung (WE) / bwE";
    rg = "§ 28 Abs. 1 BSIG-E (Sondermerkmal)";
  } else if ((h1 || h2) && (gr || mi)) {
    p = "JA";
    if (gr && h1) {
      k = "Wesentliche Einrichtung (WE) / bwE";
      rg = "§ 28 Abs. 1 Nr. 1 BSIG-E i.V.m. Anlage 1";
    } else if (mi && h1) {
      k = "Wichtige Einrichtung (WiE)";
      rg = "§ 28 Abs. 2 Nr. 1 BSIG-E";
    } else if (gr && h2) {
      k = "Wichtige Einrichtung (WiE)";
      rg = "§ 28 Abs. 2 Nr. 2 BSIG-E";
    } else {
      k = "Wichtige Einrichtung (WiE)";
      rg = "§ 28 Abs. 2 Nr. 2 BSIG-E";
    }
  }

  if (p === "JA" && gz && !hs) {
    p = "GRENZFALL";
  }

  // Indirekte Betroffenheit über Lieferkette
  const lr =
    d.lieferbeziehung === "ja"
      ? d.lieferZugriff === "ja"
        ? "HOCH"
        : "MITTEL"
      : d.lieferbeziehung === "unbekannt"
        ? "UNBEKANNT"
        : "NIEDRIG";

  return { p, k, rg, hs, h1, h2, gr, mi, kl, ma, um, bi, lr };
}

/**
 * Gibt die Sektornamen für die ausgewählten IDs zurück
 */
export function getSektorNamen(spiA1, spiA2) {
  return [
    ...spiA1.map((id) => ANLAGE1.find((x) => x.id === id)?.l),
    ...spiA2.map((id) => ANLAGE2.find((x) => x.id === id)?.l),
  ].filter(Boolean);
}
