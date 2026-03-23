/**
 * KI-gestützte Analyse und Vorbefüllung via Anthropic API
 */

const SYSTEM_PROMPT = `Du bist ein Analyst für NIS-2-Betroffenheitsprüfungen. Analysiere die bereitgestellten Informationen über ein Unternehmen und extrahiere alle relevanten Daten.

Antworte NUR mit einem JSON-Objekt (kein Markdown, keine Erklärung) mit folgenden Feldern:
{"orgName":"","rechtsform":"","bundesland":"","ansprechpartner":"","taetigkeit":"","naceCode":"","mitarbeiter":"","umsatz":"","bilanzsumme":"","oeffentlich":"ja/nein/teilweise","oeffentlichEbene":"","konzern":"ja/nein","konzernName":"","konzernMA":"","konzernUmsatz":"","konzernBilanz":"","zertifizierungen":"","spiA1_ids":[],"spiA2_ids":[],"quellen":[{"url":"...","titel":"...","info":"Was wurde daraus entnommen"}]}

Für spiA1_ids verwende nur diese IDs: energie,transport,bankwesen,finanzmarkt,gesundheit,trinkwasser,abwasser,digitalinfra,iktb2b,verwaltung,weltraum
Für spiA2_ids verwende nur diese IDs: post,abfall,chemie,lebensmittel,verarbeitend,digitaledienste,forschung
Lasse Felder leer (""), wenn keine Information verfügbar ist. Bei Zahlen nur die Zahl als String.
Im Feld "quellen" liste ALLE verwendeten Quellen mit präziser Angabe, welche Information daraus stammt.`;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("Lesefehler"));
    reader.readAsDataURL(file);
  });
}

/**
 * Analysiert Dateien/URLs/Webrecherche und gibt strukturierte Formulardaten zurück.
 *
 * @param {Object} options
 * @param {boolean} options.useFiles
 * @param {boolean} options.useWebsites
 * @param {boolean} options.useWebSearch
 * @param {File[]} options.files
 * @param {string[]} options.validUrls
 * @returns {Promise<{ data: Object|null, quellen: Array }>}
 */
export async function analyzeAndPrefill({ useFiles, useWebsites, useWebSearch, files, validUrls }) {
  const msgs = [{ role: "user", content: [] }];
  const srcInstructions = [];

  // Datei-Uploads als Base64
  if (useFiles && files.length > 0) {
    for (const file of files) {
      const b64 = await fileToBase64(file);
      const ext = file.name.split(".").pop().toLowerCase();
      if (ext === "pdf") {
        msgs[0].content.push({
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: b64 },
        });
      } else if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
        msgs[0].content.push({
          type: "image",
          source: { type: "base64", media_type: `image/${ext === "jpg" ? "jpeg" : ext}`, data: b64 },
        });
      }
    }
    srcInstructions.push(
      `${files.length} hochgeladene Datei(en) wurden bereitgestellt. Analysiere deren Inhalt.`
    );
  }

  // Webseiten-URLs
  if (useWebsites && validUrls.length > 0) {
    srcInstructions.push(
      `Folgende Webseiten des Unternehmens sind angegeben:\n${validUrls.map((u, i) => `${i + 1}. ${u}`).join("\n")}\nRufe diese Seiten ab und extrahiere alle relevanten Unternehmensinformationen.`
    );
  }

  // Webrecherche
  if (useWebSearch) {
    srcInstructions.push(
      "Führe zusätzlich eine Webrecherche durch, um öffentlich verfügbare Informationen über das Unternehmen zu finden (z.B. Handelsregister, Unternehmenswebseite, Branchenverzeichnisse). Dokumentiere jede gefundene Quelle präzise im Feld 'quellen'."
    );
  }

  srcInstructions.push("Extrahiere alle NIS-2-relevanten Informationen und antworte nur mit dem JSON-Objekt.");
  msgs[0].content.push({ type: "text", text: srcInstructions.join("\n\n") });

  const needsWebTool = (useWebsites && validUrls.length > 0) || useWebSearch;
  const tools = needsWebTool ? [{ type: "web_search_20250305", name: "web_search" }] : [];
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: msgs,
  };
  if (tools.length > 0) body.tools = tools;

  const resp = await fetch("/api/anthropic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const responseData = await resp.json();

  if (!resp.ok) {
    const errMsg = responseData.error?.message || responseData.error || `${resp.status} ${resp.statusText}`;
    throw new Error(`API-Fehler: ${errMsg}`);
  }

  const text = responseData.content?.map((c) => (c.type === "text" ? c.text : "")).join("") || "";
  const clean = text.replace(/```json|```/g, "").trim();

  const parsed = JSON.parse(clean);
  const quellen = parsed.quellen && Array.isArray(parsed.quellen) ? parsed.quellen : [];

  // Mapped result to form fields
  const data = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (key === "spiA1_ids" && Array.isArray(value)) {
      data.spiA1 = value;
    } else if (key === "spiA2_ids" && Array.isArray(value)) {
      data.spiA2 = value;
    } else if (key === "quellen") {
      // skip
    } else if (value && value !== "") {
      data[key] = value;
    }
  }

  return { data, quellen };
}
