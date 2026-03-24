/**
 * KI-gestützte Analyse und Vorbefüllung via Anthropic API
 * Uses the new SYSTEM_PROMPT from prompts.js, erstelleUserPrompt for building the prompt,
 * parseJSONRobust for parsing, and konvertiereApiAntwort for cleaning the response.
 */

import { SYSTEM_PROMPT, erstelleUserPrompt, parseJSONRobust } from "./prompts";
import { konvertiereApiAntwort } from "./integration";

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
 * New flow:
 * 1. Build prompt using erstelleUserPrompt()
 * 2. Fetch /api/anthropic with SYSTEM_PROMPT
 * 3. Parse response using parseJSONRobust
 * 4. Clean with konvertiereApiAntwort()
 * 5. Return cleaned data mapped to form fields
 */
export async function analyzeAndPrefill({ useFiles, useWebsites, useWebSearch, files, validUrls }) {
  const msgs = [{ role: "user", content: [] }];

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
  }

  // Build the user prompt using erstelleUserPrompt
  const userPrompt = erstelleUserPrompt({
    websiteUrls: (useWebsites && validUrls.length > 0) ? validUrls : [],
    hatDateien: useFiles && files.length > 0,
    anzahlDateien: (useFiles && files.length > 0) ? files.length : 0,
  });

  msgs[0].content.push({ type: "text", text: userPrompt });

  const needsWebTool = (useWebsites && validUrls.length > 0) || useWebSearch;
  const tools = needsWebTool ? [{ type: "web_search_20250305", name: "web_search" }] : [];
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
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

  // Extract all text blocks from the response
  const text = responseData.content?.map((c) => (c.type === "text" ? c.text : "")).join("\n") || "";

  // Parse using robust JSON parser (handles markdown blocks, preamble, etc.)
  const parsed = parseJSONRobust(text);
  if (!parsed) {
    throw new Error("KI-Antwort enthält kein gültiges JSON.");
  }

  // Clean with konvertiereApiAntwort (normalizes null/undefined, validates arrays, etc.)
  const cleaned = konvertiereApiAntwort(parsed);

  // Extract quellen before mapping to form fields
  const quellen = cleaned.quellen && Array.isArray(cleaned.quellen) ? cleaned.quellen : [];

  // Map cleaned result to form fields
  const data = {};
  for (const [key, value] of Object.entries(cleaned)) {
    if (key === "quellen") continue; // skip quellen from form data

    // Map lieferkette as structured object
    if (key === "lieferkette" && value && typeof value === "object") {
      data.lieferkette = value;
      continue;
    }

    // Only set non-empty values
    if (Array.isArray(value)) {
      data[key] = value;
    } else if (value && value !== "") {
      data[key] = value;
    }
  }

  return { data, quellen };
}
