import { supabaseAdmin } from "@/lib/supabaseServer";
import { uploadImageToSupabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

interface ClientData {
  code: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  parent_category: string;
  category: string;
  description: string;
  file?: File;
  image_src?: string;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const data = getFieldData(formData);
  const image = data.file;

  console.log(data);

  if (!data.name || !data.price || isNaN(Number(data.price))) {
    return NextResponse.json({ message: "Data tidak valid" }, { status: 400 });
  }

  if (image) {
    try {
      data.image_src = await uploadImageToSupabase(image, data.name);
    } catch (error) {
      //@ts-expect-error Error tidak ada tipe
      return NextResponse.json({ message: error.message }, { status: 422 });
    }
  }

  const payload = {
    ...data,
    is_active: data.stock > 0 ? true : false,
    file: undefined,
  };

  const test = await supabaseAdmin.from("products").insert(payload);

  console.log(test);

  return NextResponse.json(
    { message: "Data berhasil ditambah" },
    { status: 200 }
  );
}

function getFieldData(formData: FormData): ClientData {
  const code = formData.get("code") as string;
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const parent_category = formData.get("parent_category") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const file = formData.get("image") as File;

  const data: ClientData = {
    code,
    name,
    price,
    brand,
    parent_category,
    category,
    description,
    file,
    stock,
  };

  return data;
}
