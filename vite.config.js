import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env manuell laden (loadEnv hat Prefix-Probleme mit Nicht-VITE_-Vars)
function loadDotenv() {
  try {
    const content = readFileSync(resolve(__dirname, '.env'), 'utf-8');
    const env = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
      }
    }
    return env;
  } catch {
    return {};
  }
}

const dotenv = loadDotenv();
const apiKey = dotenv.ANTHROPIC_API_KEY || '';

console.log('[proxy] API-Key:', apiKey ? 'geladen (' + apiKey.slice(0, 12) + '...)' : 'FEHLT – bitte in .env eintragen');

export default defineConfig({
  plugins: [
    react(),
    anthropicProxy(apiKey),
  ],
})

/**
 * Vite-Plugin: Serverseitiger Proxy für Anthropic API.
 * Hält den API-Key im Server-Prozess – gelangt nie zum Browser.
 */
function anthropicProxy(apiKey) {
  return {
    name: 'anthropic-proxy',
    configureServer(server) {
      server.middlewares.use('/api/anthropic', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'ANTHROPIC_API_KEY nicht gesetzt. Bitte in .env eintragen.'
          }));
          return;
        }

        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const body = Buffer.concat(chunks);

        try {
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
            },
            body,
          });

          const data = await response.text();
          res.writeHead(response.status, {
            'Content-Type': 'application/json',
          });
          res.end(data);
        } catch (err) {
          console.error('Anthropic proxy error:', err);
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Proxy-Fehler: ' + err.message }));
        }
      });
    },
  };
}
