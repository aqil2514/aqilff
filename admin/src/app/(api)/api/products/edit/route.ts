import { supabaseAdmin } from "@/lib/supabaseServer";
import { uploadImageToSupabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const formData = await req.formData();
  const data = getFormDataValue(formData);

  console.log(data) 

  const { data: oldProduct, error: getError } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", data.id)
    .single();

  if (getError || !oldProduct) {
    return NextResponse.json(
      { message: "Produk tidak ditemukan" },
      { status: 404 }
    );
  }

  if (data.isChangedImage && oldProduct.image_src) {
    const filePath = oldProduct.image_src.split("/").pop();
    await supabaseAdmin.storage.from("product_images").remove([filePath!]);
  }

  let image_url = oldProduct.image_src;

  const file = formData.get("image") as File;

  if (data.isChangedImage && file && file.size > 0) {
    image_url = await uploadImageToSupabase(file, data.name);
  }

  const { error: updateError } = await supabaseAdmin
    .from("products")
    .update({
      id: data.id,
      brand: data.brand,
      name: data.name,
      category: data.category,
      parent_category: data.parent_category,
      price: data.price,
      stock: data.stock,
      is_active: data.stock === 0 ? false : true,
      description: data.description,
      image_src: image_url,
    })
    .eq("id", data.id);

  if (updateError) {
    console.error(updateError);
    return NextResponse.json(
      { message: "Gagal update produk" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Produk berhasil diperbarui" },
    { status: 200 }
  );
}

const getFormDataValue = (formData: FormData) => {
  const id = String(formData.get("id"));
  const brand = String(formData.get("brand"));
  const category = String(formData.get("category"));
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const description = String(formData.get("description"));
  const isChangedImage =
    String(formData.get("isChangedImage")) === "yes" ? true : false;
  const name = String(formData.get("name"));
  const parent_category = String(formData.get("parent_category"));

  return {
    id,
    brand,
    category,
    price,
    stock,
    description,
    isChangedImage,
    name,
    parent_category,
  };
};
