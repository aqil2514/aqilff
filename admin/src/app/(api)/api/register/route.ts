import { credentialsSchema } from "@/schema/credentials";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    const parsedData = credentialsSchema.safeParse(data);
    const { data: zData, success } = parsedData;

    if (!success)
      return NextResponse.json(
        {
          message: "Data yang dimasukkan tidak Valid",
          errors: parsedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );

    return new Response();
  } catch (error) {
    return NextResponse.json({
      message: "Terjadi kesalahan pada server",
      errors: error,
    });
  }
}
