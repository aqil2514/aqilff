import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { key } = await req.json();

  try {
    const { data } = await supabaseAdmin
      .from("invitation_tokens")
      .select("*")
      .eq("token", key)
      .single();

    if (!data || data.used) return NextResponse.json({ success: false, role: null });

    await supabaseAdmin
      .from("invitation_tokens")
      .update({ used: true })
      .eq("token", key);

    return NextResponse.json({ success: true, role: data.role });
  } catch (error) {
    console.error(error);
  }

  return new Response();
}
