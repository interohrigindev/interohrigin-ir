const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * DeepL API 프록시 — 브라우저 CORS 제한 우회
 * POST /deeplProxy  { endpoint, body, apiKey }
 */
exports.deeplProxy = functions.region("asia-northeast3").https.onRequest(async (req, res) => {
  // CORS 헤더 설정
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { endpoint, body, apiKey } = req.body;

  if (!apiKey) {
    res.status(400).json({ error: "API key is required" });
    return;
  }

  const allowedEndpoints = ["/v2/translate", "/v2/usage"];
  if (!allowedEndpoints.includes(endpoint)) {
    res.status(400).json({ error: "Invalid endpoint" });
    return;
  }

  // Free vs Pro 판별
  const baseUrl = apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com"
    : "https://api.deepl.com";

  try {
    const fetchRes = await fetch(`${baseUrl}${endpoint}`, {
      method: endpoint === "/v2/usage" ? "GET" : "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${apiKey}`,
        ...(endpoint !== "/v2/usage" && { "Content-Type": "application/json" }),
      },
      ...(endpoint !== "/v2/usage" && body && { body: JSON.stringify(body) }),
    });

    const data = await fetchRes.json();

    if (!fetchRes.ok) {
      res.status(fetchRes.status).json(data);
      return;
    }

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message || "Proxy error" });
  }
});
