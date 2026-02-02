 export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
// ... the rest of your code 
// import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free"
        messages: [
          {
            role: "system",
            content: "You are a Strategic Adversarial System. Analyze the user's startup idea brutally. YOUR FIRST LINE MUST BE A VULNERABILITY SCORE BETWEEN 0 AND 100 in this format: 'SCORE: [number]'. Then provide your analysis."
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();
    return NextResponse.json({ response: data.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to connect to AI" }, { status: 500 });
  }
}