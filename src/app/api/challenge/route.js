import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("ERROR: OPENROUTER_API_KEY is missing from Vercel Settings");
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://vercel.com", // Required by some OpenRouter models
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          { role: "system", content: "You are a brutal startup auditor. YOUR FIRST LINE MUST BE 'SCORE: [0-100]'." },
          { role: "user", content: text },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter Error Details:", errorData);
      throw new Error(`OpenRouter returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ response: data.choices[0].message.content });

  } catch (error) {
    console.error("Full Connection Error:", error.message);
    return NextResponse.json({ error: "Failed to connect to AI: " + error.message }, { status: 500 });
  }
}