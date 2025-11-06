export default async function handler(req, res) {
  // --- Enable CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // --- Handle preflight requests ---
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const food = req.query.food || "a healthy food";
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a registered dietitian who writes concise, factual nutrition explanations. Write two professional sentences explaining the single most relevant nutritional benefit of ${food}, if any. If the food is mostly a treat or not generally healthy, briefly note that it should be enjoyed occasionally and explain why. Avoid humor, exaggeration, or enthusiasm — be informative and neutral.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from model.";

    res.status(200).json({ text });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to fetch from Gemini API." });
  }
}
