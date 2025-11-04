export default async function handler(req, res) {
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
                  text: `You are an enthusiastic dietitian. Write two sentences describing the single, most powerful health benefit of ${food}, following this structure: "The main health benefit of [food], above all others, is their role as an exceptional source of [nutrient/component], which is crucial for [function] and [function]. This [nutrient/component descriptor] actively helps to [positive outcome 1], while supporting [positive outcome 2] and promoting [long-term well-being benefit]!"`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from model.";

    res.status(200).json({ text });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to fetch from Gemini API." });
  }
}
