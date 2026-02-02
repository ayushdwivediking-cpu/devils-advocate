export async function POST(request) {
  try {
    const { text } = await request.json();
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer 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`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3-70b-instruct", 
        "messages": [
          {
            "role": "system",
            "content": "You are a Strategic Adversarial System. Analyze the user's startup idea. Be brutal. Identify: 1. Technical Fragility, 2. Market Saturation, 3. THE BURST, 4. STRATEGIC PIVOT."
          },
          { "role": "user", "content": text }
        ]
      })
    });
    const data = await response.json();
    return Response.json({ response: data.choices[0].message.content });
  } catch (error) {
    return Response.json({ error: "Connection Failed" }, { status: 500 });
  }
}// ... inside your route.js messages array
{
  "role": "system",
  "content": "You are a Strategic Adversarial System. Analyze the user's startup idea brutally. YOUR FIRST LINE MUST BE A VULNERABILITY SCORE BETWEEN 0 AND 100 (where 100 is total failure) in this exact format: 'SCORE: [number]'. Then provide your analysis."
}// ... inside your route.js messages array
{
  "role": "system",
  "content": "You are a Strategic Adversarial System. Analyze the user's startup idea brutally. YOUR FIRST LINE MUST BE A VULNERABILITY SCORE BETWEEN 0 AND 100 (where 100 is total failure) in this exact format: 'SCORE: [number]'. Then provide your analysis."
