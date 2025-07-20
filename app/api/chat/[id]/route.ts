import { NextResponse } from 'next/server';
import Chat from '@/models/Chat';
import connectDB from '@/lib/mongodb';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    // SECURITY: Only allow access to a chat if userId matches chat.userId
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || searchParams.get('email');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId/email' }, { status: 401 });
    }
    const chat = await Chat.findById(params.id);
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    if (chat.userId !== userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    return NextResponse.json(chat, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch chat', details: err }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    // SECURITY: Only allow delete if userId matches chat.userId
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || searchParams.get('email');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId/email' }, { status: 401 });
    }
    const chat = await Chat.findById(params.id);
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    if (chat.userId !== userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    await chat.deleteOne();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete chat', details: err }, { status: 500 });
  }
} 