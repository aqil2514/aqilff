import { Credentials } from "@/components/providers/RegisterProvider";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { credentialsSchema } from "@/schema/credentials";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = (await req.json()) as Credentials;
  const { email, password, phoneNumber, role } = data;

  const parsed = credentialsSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Data yang dimasukkan tidak Valid",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.signUp({
    email,
    password,
    phone: phoneNumber,
  });

  console.log(signUpData, signUpError)

  if (signUpError) {
    return NextResponse.json(
      { message: "Gagal mendaftar", errors: signUpError.message },
      { status: 500 }
    );
  }

  await supabaseAdmin.from("profiles").insert({
    id: signUpData.user?.id,
    email,
    role
  });

  return NextResponse.json(
    {
      message: "Pendaftaran berhasil, silakan cek email Anda",
      data: signUpData,
    },
    { status: 200 }
  );
}
