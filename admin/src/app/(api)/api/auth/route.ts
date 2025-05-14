import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username: email, password } = await req.json();

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        {
          message: "Informasi login tidak valid",
          error: error.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Login berhasil",
        user: data.user,
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        message: "Terjadi kesalahan di server",
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}
