import { NextRequest, NextResponse } from "next/server";

// TODO : Nanti update ke database
export async function POST(req: NextRequest) {
  const raw = await req.json();

  return NextResponse.json({ message: "OK. Sedang dalam pengembangan" }, { status: 200 });
}
