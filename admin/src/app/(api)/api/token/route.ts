import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { key } = await req.json();

  try {
    const { data } = await supabase
      .from("invitation_tokens")
      .select("*")
      .eq("token", key)
      .single();

    if (!data) return NextResponse.json({ success: false, role: null });

    return NextResponse.json({ success: true, role: data.role });
  } catch (error) {
    console.log(error);
  }

  return new Response();
}
