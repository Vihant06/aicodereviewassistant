import { NextResponse } from 'next/server';
import Chat from '@/models/Chat';
import connectDB from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    await connectDB();
    let { userId, title, messages } = await req.json();
    if (!userId || !messages) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Auto-generate title if not provided
    if (!title || !title.trim()) {
      const firstUserMsg = messages.find((m: any) => m.role === 'user')?.content;
      title = firstUserMsg?.slice(0, 40) || `Chat ${new Date().toLocaleString()}`;
    }
    const chat = await Chat.create({ userId, title, messages });
    return NextResponse.json(chat, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save chat', details: err }, { status: 500 });
  }
} 