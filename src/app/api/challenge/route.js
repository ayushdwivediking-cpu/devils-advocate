import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { text } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing in Vercel." }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://devils-advocate-auth.vercel.app", 
        "X-Title": "Devils Advocate AI",
      },
      body: JSON.stringify({
        // Stable model selection
        model: "google/gemini-flash-1.5-8b:free", 
        messages: [
          { 
            role: "system", 
            content: "You are a brutal startup auditor. Be savage and concise. YOUR FIRST LINE MUST BE 'SCORE: [0-100]'. Then give 3 bullet points of why the idea will fail." 
          },
          { role: "user", content: text },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter Error Details:", data); // Check logs for 401/404
      return NextResponse.json({ error: data.error?.message || "OpenRouter Error" }, { status: response.status });
    }

    return NextResponse.json({ response: data.choices[0].message.content });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}