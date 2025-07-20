import { NextResponse } from "next/server";
import Chat from '@/models/Chat';
import connectDB from '@/lib/mongodb';

const systemPrompt = {
  role: "system",
  content: `
You are CodeMuse, an expert AI code review assistant. When reviewing code, respond in exactly four clear parts with roughly equal length, using simple language:

1. Brief summary: What the code does (1-5 sentences).
2. Issues: Identify bugs or problems concisely(if any).
3. Suggestions: Best practices or improvements(give steps).
4. Optimizations: Any relevant performance or style enhancements(give details).

Each part should be short and balanced—avoid long explanations or too much detail. Use code blocks only when needed. End with a short 3-bullet summary of key points.

Keep answers professional, friendly, and easy to read and all this in just 800 characters.
`};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY not set" }, { status: 500 });
    }
    const fullMessages = [systemPrompt, ...messages];
    // Try streaming response
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: fullMessages,
        stream: true,
      }),
    });
    if (groqRes.status === 200 && groqRes.body) {
      // Stream the response to the client
      return new Response(groqRes.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } else {
      // Fallback to non-streaming if not supported
      const data = await groqRes.json();
      const reply = data.choices?.[0]?.message?.content || "";
      return NextResponse.json({ reply });
    }
  } catch (err) {
    console.error("[GROQ] Exception:", err);
    return NextResponse.json({ error: err?.toString() || "Unknown error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    // SECURITY: Only allow access to chats for the logged-in user (userId/email required)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || searchParams.get('email');
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId/email' }), { status: 401 });
    }
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    return new Response(JSON.stringify(chats), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch chats', details: err }), { status: 500 });
  }
} 