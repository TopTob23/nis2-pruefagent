// Sektoren hoher Kritikalität – Anlage 1 BSIG
export const ANLAGE1 = [
  { id: "energie", l: "Energie" },
  { id: "transport", l: "Transport und Verkehr" },
  { id: "bankwesen", l: "Bankwesen" },
  { id: "finanzmarkt", l: "Finanzmarktinfrastrukturen" },
  { id: "gesundheit", l: "Gesundheitswesen" },
  { id: "trinkwasser", l: "Trinkwasser" },
  { id: "abwasser", l: "Abwasser" },
  { id: "digitalinfra", l: "Digitale Infrastruktur" },
  { id: "iktb2b", l: "IKT-Dienst\u00admgmt. (B2B)" },
  { id: "verwaltung", l: "Öffentl. Verwaltung" },
  { id: "weltraum", l: "Weltraum" },
];

// Sonstige kritische Sektoren – Anlage 2 BSIG
export const ANLAGE2 = [
  { id: "post", l: "Post-/Kurierdienste" },
  { id: "abfall", l: "Abfallbewirtschaftung" },
  { id: "chemie", l: "Chemie" },
  { id: "lebensmittel", l: "Lebensmittel" },
  { id: "verarbeitend", l: "Verarb. Gewerbe" },
  { id: "digitaledienste", l: "Digitale Dienste" },
  { id: "forschung", l: "Forschung" },
];

// Größenunabhängige Sondermerkmale – all 8 matching prueflogik.js SONDERMERKMALE keys
export const SONDERMERKMALE = [
  { id: "kritis", l: "Betreiber einer kritischen Anlage (KRITIS gem. BSI-KritisV)" },
  { id: "telekom", l: "Anbieter öffentlicher Telekommunikationsdienste/-netze" },
  { id: "qualVDA", l: "Qualifizierter Vertrauensdiensteanbieter (eIDAS-VO)" },
  { id: "tld", l: "TLD-Name-Registry" },
  { id: "dns", l: "DNS-Diensteanbieter" },
  { id: "nichtQualVDA", l: "Nicht-qualifizierter Vertrauensdiensteanbieter" },
  { id: "ixp", l: "Internet Exchange Point (IXP) Betreiber" },
  { id: "bundesbehoerde", l: "Bundesbehörde / öffentl. Verwaltung Bundesebene" },
];
