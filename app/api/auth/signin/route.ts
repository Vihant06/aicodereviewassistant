// /app/api/auth/signin/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log('Sign-in attempt:', { email });
    await connectDB();
    console.log('Connected to DB');

    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found:', email);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Invalid password for:', email);
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    console.log('Login successful for:', email);
    return NextResponse.json({ message: 'Login successful', userId: user._id, name: user.name });
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json({ message: 'Sign-in error', error: error?.toString() }, { status: 500 });
  }
}
