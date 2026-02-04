import { NextResponse } from "next/server";

// Vercel ko batata hai ki ye page cache na kare aur hamesha naya data le
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { text } = await req.json();
    
    // Vercel environment variable se key uthata hai
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("Missing API Key");
      return NextResponse.json({ error: "OpenRouter API Key is not set in Vercel." }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        // .trim() kisi bhi invisible space ko saaf kar deta hai
        "Authorization": `Bearer ${apiKey.trim()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://devils-advocate-auth.vercel.app", 
        "X-Title": "Devils Advocate AI",
      },
      body: JSON.stringify({
        // Gemini Flash 2.0 sabse fast hai, timeout nahi hoga
        model: "google/gemini-2.0-flash-exp:free",
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
      console.error("OpenRouter Error Details:", data);
      return NextResponse.json({ error: data.error?.message || "OpenRouter Error" }, { status: response.status });
    }

    return NextResponse.json({ response: data.choices[0].message.content });

  } catch (error) {
    console.error("Server Crash:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}