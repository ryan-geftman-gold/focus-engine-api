// Simple Node.js API endpoint for Gemini on Vercel
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://ryan-geftman-gold.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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
                  text: `You are a friendly, evidence-based dietitian. In exactly two clear sentences, describe the single most important health benefit of ${food}. Focus on clarity, accuracy, and encouragement — not generic advice. Avoid filler like "Okay" or "here's an answer".`,
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
