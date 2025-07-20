import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  const { email } = await req.json();
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ name: user.name, email: user.email });
}

export async function GET() {
  return NextResponse.json({ message: "Use POST with { email } to fetch user info." }, { status: 405 });
} 