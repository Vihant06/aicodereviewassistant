import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    return NextResponse.json(user);
  } catch (error: any) {
    console.error("User creation error:", error);
    return NextResponse.json({ message: error.message || "Signup failed" }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  const users = await User.find();
  return NextResponse.json(users);
} 