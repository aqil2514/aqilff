import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

interface ClientData {
  id: string;
  name: string;
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
    file: undefined,
  };

 const test = await supabaseAdmin.from("products").insert(payload);

console.log(test)

  return NextResponse.json(
    { message: "Data berhasil ditambah" },
    { status: 200 }
  );
}

function getFieldData(formData: FormData): ClientData {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const parent_category = formData.get("parent_category") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const file = formData.get("image") as File;

  const data: ClientData = {
    id,
    name,
    price,
    parent_category,
    category,
    description,
    file,
    stock,
  };

  return data;
}

export async function uploadImageToSupabase(
  file: File,
  namePrefix?: string
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File tidak diterima. Harus berupa gambar.");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Ukuran file lebih dari 2MB.");
  }

  const fileExt = file.type.split("/")[1];
  const fileName = `${namePrefix}.${fileExt}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("products-image")
    .upload(fileName, file, {
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Gagal mengunggah gambar.");
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from("products-image")
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
