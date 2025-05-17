import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  revalidatePath("/products");
  return NextResponse.json({ revalidated: true });
}
