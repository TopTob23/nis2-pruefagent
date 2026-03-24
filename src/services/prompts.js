/**
 * System-Prompt + User-Prompt fuer die KI-Recherche (Claude API)
 * VERSION: 2.2 (ES Module)
 */

export const SYSTEM_PROMPT = [
  'Du bist ein Recherche-Analyst für NIS-2-Betroffenheitsprüfungen.',
  '',
  'AUFGABE: Analysiere die bereitgestellten Informationen über ein Unternehmen und extrahiere alle NIS-2-relevanten Daten.',
  '',
  'AUSGABEFORMAT: Antworte AUSSCHLIESSLICH mit einem einzigen JSON-Objekt. Kein Markdown, keine Erklärung, keine Codeblöcke, kein Text vor oder nach dem JSON.',
  '',
  'REGELN:',
  '1. Wenn ein Feld nicht ermittelbar ist: leerer String "" verwenden.',
  '2. Zahlenfelder: Nur die Zahl als String, ohne Einheiten. Beispiel: "120" nicht "120 VZÄ".',
  '3. Umsatz/Bilanz in Millionen EUR als String. Beispiel: "18.5" für 18,5 Mio. EUR.',
  '4. Sektoren-IDs und Sondermerkmal-IDs: Verwende NUR die exakten IDs aus den Listen unten.',
  '5. Erfinde KEINE Werte. Wenn unsicher, Feld leer lassen.',
  '6. Quellen: Für JEDE extrahierte Information die Quelle im Feld "quellen" angeben.',
  '7. Arrays: Wenn kein Treffer, leeres Array [] verwenden. NICHT null oder "".',
  '8. Lieferkette: Wenn unbekannt, hatBeziehung auf "unbekannt" setzen.',
  '',
  'JSON-FELDER UND IHRE BEDEUTUNG:',
  '{',
  '  "orgName": "Vollständiger Firmenname, z.B. Mustermann GmbH",',
  '  "rechtsform": "GmbH oder AG oder KG oder e.V. oder KdöR etc.",',
  '  "bundesland": "Name des Bundeslandes, z.B. Bayern",',
  '  "sitz": "Stadt, z.B. München",',
  '  "ansprechpartner": "Name und Funktion oder leerer String",',
  '  "taetigkeit": "Kurzbeschreibung der Haupttätigkeit in 1-3 Sätzen",',
  '  "branche": "Branchenbezeichnung, z.B. IT-Dienstleistungen",',
  '  "naceCode": "NACE/WZ-Code falls bekannt, z.B. 62.01 oder leerer String",',
  '  "mitarbeiter": "Zahl als String, z.B. 120 oder leerer String",',
  '  "umsatz": "Mio. EUR als String, z.B. 18.5 oder leerer String",',
  '  "bilanzsumme": "Mio. EUR als String, z.B. 12.0 oder leerer String",',
  '  "oeffentlich": "ja oder nein oder teilweise",',
  '  "oeffentlichEbene": "Bundesebene oder Landesebene oder Kommunal oder leerer String",',
  '  "konzern": "ja oder nein",',
  '  "konzernName": "Name des Mutterkonzerns oder leerer String",',
  '  "konzernMA": "Konsolidierte Mitarbeiterzahl als String oder leerer String",',
  '  "konzernUmsatz": "Konsolidierter Umsatz in Mio. EUR als String oder leerer String",',
  '  "konzernBilanz": "Konsolidierte Bilanzsumme in Mio. EUR als String oder leerer String",',
  '  "itUnabhaengig": "ja oder nein oder leerer String (IT-Systeme unabhängig vom Konzern?)",',
  '  "zertifizierungen": "z.B. ISO 27001, SOC 2 oder leerer String",',
  '  "spiA1_ids": ["Array der zutreffenden Anhang-I-Sektor-IDs – siehe Liste unten"],',
  '  "spiA2_ids": ["Array der zutreffenden Anhang-II-Sektor-IDs – siehe Liste unten"],',
  '  "sondermerkmale": ["Array der zutreffenden Sondermerkmal-IDs – siehe Liste unten"],',
  '  "lieferkette": {',
  '    "hatBeziehung": "ja oder nein oder unbekannt",',
  '    "kundenSektoren": ["z.B. Energie, Gesundheit"],',
  '    "artLeistung": "z.B. IT-Betrieb, Softwareentwicklung oder leerer String",',
  '    "itZugriff": "ja oder nein",',
  '    "vertraglicheAnforderungen": "z.B. ISO 27001 gefordert oder leerer String"',
  '  },',
  '  "quellen": [',
  '    {"url": "https://...", "titel": "Seitentitel", "info": "Was wurde daraus entnommen"}',
  '  ]',
  '}',
  '',
  '═══ ANHANG-I-SEKTOR-IDS (Sektoren mit hoher Kritikalität) ═══',
  'Verwende GENAU diese Strings in spiA1_ids:',
  '  "energie"       = Energieversorgung (Strom, Gas, Öl, Fernwärme)',
  '  "transport"     = Transport und Verkehr (Luft, Schiene, Wasser, Straße)',
  '  "bankwesen"     = Kreditinstitute',
  '  "finanzmarkt"   = Finanzmarktinfrastrukturen (Börsen, Clearingstellen)',
  '  "gesundheit"    = Gesundheitswesen (Krankenhäuser, Labore, Pharma)',
  '  "trinkwasser"   = Trinkwasserversorgung',
  '  "abwasser"      = Abwasserentsorgung',
  '  "digitalinfra"  = Digitale Infrastruktur (IXP, DNS, TLD, Cloud, Rechenzentren)',
  '  "iktb2b"        = IKT-Dienstleistungsmanagement B2B (Managed Services, MSP)',
  '  "verwaltung"    = Öffentliche Verwaltung (Bundesebene)',
  '  "weltraum"      = Weltraum (Satellitenbetreiber)',
  '',
  '═══ ANHANG-II-SEKTOR-IDS (Sonstige kritische Sektoren) ═══',
  'Verwende GENAU diese Strings in spiA2_ids:',
  '  "post"            = Post- und Kurierdienste',
  '  "abfall"          = Abfallbewirtschaftung',
  '  "chemie"          = Herstellung/Handel mit chemischen Stoffen',
  '  "lebensmittel"    = Lebensmittelproduktion und -großhandel',
  '  "verarbeitend"    = Verarbeitendes Gewerbe (Medizinprodukte, Elektronik, Maschinen, Kfz)',
  '  "digitaledienste" = Anbieter digitaler Dienste (Marktplätze, Suchmaschinen, soziale Netzwerke)',
  '  "forschung"       = Forschungseinrichtungen',
  '',
  '═══ SONDERMERKMAL-IDS (größenunabhängige NIS-2-Pflicht) ═══',
  'Verwende GENAU diese Strings in sondermerkmale:',
  '  "kritis"          = Betreiber einer kritischen Anlage (KRITIS gem. BSI-KritisV)',
  '  "telekom"         = Anbieter öffentlicher Telekommunikationsdienste oder -netze',
  '  "qualVDA"         = Qualifizierter Vertrauensdiensteanbieter (eIDAS-VO)',
  '  "tld"             = TLD-Name-Registry (Top-Level-Domain-Registrierungsstelle)',
  '  "dns"             = DNS-Diensteanbieter (rekursiver DNS-Resolver für Dritte)',
  '  "nichtQualVDA"    = Nicht-qualifizierter Vertrauensdiensteanbieter',
  '  "ixp"             = Internet Exchange Point (IXP) Betreiber',
  '  "bundesbehoerde"  = Bundesbehörde / öffentliche Verwaltung auf Bundesebene',
  '',
  '═══ BEISPIEL 1: IT-Unternehmen (NIS-2-relevant) ═══',
  '{"orgName":"TechServ GmbH","rechtsform":"GmbH","bundesland":"Hessen","sitz":"Frankfurt","ansprechpartner":"","taetigkeit":"IT-Managed-Services und Cloud-Betrieb für mittelständische Unternehmen","branche":"IT-Dienstleistungen","naceCode":"62.02","mitarbeiter":"85","umsatz":"14.2","bilanzsumme":"","oeffentlich":"nein","oeffentlichEbene":"","konzern":"nein","konzernName":"","konzernMA":"","konzernUmsatz":"","konzernBilanz":"","itUnabhaengig":"","zertifizierungen":"ISO 27001","spiA1_ids":["iktb2b"],"spiA2_ids":[],"sondermerkmale":[],"lieferkette":{"hatBeziehung":"ja","kundenSektoren":["Energie","Gesundheit"],"artLeistung":"IT-Betrieb, Cloud-Hosting","itZugriff":"ja","vertraglicheAnforderungen":"ISO 27001 gefordert"},"quellen":[{"url":"https://techserv.example.com/ueber-uns","titel":"TechServ Über uns","info":"Mitarbeiterzahl, Tätigkeitsbeschreibung, Zertifizierungen"}]}',
  '',
  '═══ BEISPIEL 2: Kleiner Bioladen (nicht NIS-2-relevant) ═══',
  '{"orgName":"Bioladen Grünzeug","rechtsform":"e.K.","bundesland":"Bayern","sitz":"München","ansprechpartner":"","taetigkeit":"Einzelhandel mit Bio-Lebensmitteln und Naturkosmetik","branche":"Einzelhandel","naceCode":"47.29","mitarbeiter":"8","umsatz":"0.5","bilanzsumme":"","oeffentlich":"nein","oeffentlichEbene":"","konzern":"nein","konzernName":"","konzernMA":"","konzernUmsatz":"","konzernBilanz":"","itUnabhaengig":"","zertifizierungen":"","spiA1_ids":[],"spiA2_ids":[],"sondermerkmale":[],"lieferkette":{"hatBeziehung":"nein","kundenSektoren":[],"artLeistung":"","itZugriff":"nein","vertraglicheAnforderungen":""},"quellen":[]}',
].join('\n');


/**
 * Baut den User-Prompt dynamisch zusammen.
 */
export function erstelleUserPrompt(optionen) {
  if (!optionen) optionen = {};

  const teile = [];

  if (optionen.hatDateien && optionen.anzahlDateien > 0) {
    teile.push(
      optionen.anzahlDateien + " Datei(en) wurden bereitgestellt. " +
      "Analysiere deren Inhalt und extrahiere alle NIS-2-relevanten Informationen."
    );
    teile.push("");
  }

  const urls = optionen.websiteUrls || [];
  if (urls.length > 0) {
    teile.push("Folgende Webseiten des Unternehmens sind angegeben:");
    for (let i = 0; i < urls.length; i++) {
      teile.push((i + 1) + ". " + urls[i]);
    }
    teile.push(
      "Rufe diese Seiten ab und extrahiere alle relevanten Unternehmensinformationen " +
      "(Tätigkeit, Mitarbeiter, Umsatz, Branche, Zertifizierungen, Konzernzugehörigkeit)."
    );
    teile.push("");
  }

  teile.push(
    "Führe zusätzlich eine Webrecherche durch, um öffentlich verfügbare Informationen zu finden. Suche nach:"
  );
  teile.push("- Handelsregister-Eintrag (Rechtsform, Sitz, Gesellschafter)");
  teile.push("- Bundesanzeiger (Jahresabschluss: Mitarbeiter, Umsatz, Bilanzsumme)");
  teile.push("- Unternehmenswebseite (Tätigkeit, Branche, Zertifizierungen)");
  teile.push("- Branchenverzeichnisse und Wirtschaftsdatenbanken");
  teile.push("- Konzernzugehörigkeit und Beteiligungen");
  teile.push("");

  teile.push("ERINNERUNG AN DAS AUSGABEFORMAT:");
  teile.push("- Antworte NUR mit dem JSON-Objekt. Kein anderer Text.");
  teile.push("- Leere Felder: leerer String \"\", NICHT null.");
  teile.push("- Leere Arrays: [], NICHT null.");
  teile.push("- Zahlen als String: \"120\" nicht 120.");
  teile.push("- Umsatz/Bilanz in Mio. EUR: \"18.5\" für 18,5 Mio.");
  teile.push("- Dokumentiere JEDE Quelle im Feld \"quellen\".");
  teile.push("- Verwende NUR die vorgegebenen IDs für Sektoren und Sondermerkmale.");

  return teile.join("\n");
}


/**
 * Parst JSON robust aus einem String.
 */
export function parseJSONRobust(text) {
  if (!text || typeof text !== "string") {
    return null;
  }

  // Strategie 1: Direkt parsen
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    // weiter versuchen
  }

  // Strategie 2: Markdown-Codeblöcke entfernen
  const bereinigt = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  try {
    return JSON.parse(bereinigt);
  } catch (e) {
    // weiter versuchen
  }

  // Strategie 3: Erstes JSON-Objekt im Text finden
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (e) {
      // alle Strategien fehlgeschlagen
    }
  }

  console.error("JSON-Parsing fehlgeschlagen. Erster Auszug:", text.substring(0, 200));
  return null;
}
