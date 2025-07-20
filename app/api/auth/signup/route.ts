// /app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  await connectDB();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPassword });

  return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
}