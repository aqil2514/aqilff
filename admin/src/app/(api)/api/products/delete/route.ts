import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json(
      { message: "ID Product tidak ditemukan" },
      { status: 400 }
    );
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Data berhasil dihapus" },
    { status: 200 }
  );
}
