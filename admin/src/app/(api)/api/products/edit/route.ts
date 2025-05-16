import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

// TODO Next fix ini
export async function PUT(req: NextRequest) {
  const formData = await req.formData();
  const data = getFormDataValue(formData);

  console.log(data)

  const { data: oldProduct, error: getError } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", data.oldId)
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
    const ext = file.name.split(".").pop();
    const fileName = `${data.name.replace(/\s+/g, "_")}.${ext}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from("product_images")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        { message: "Gagal upload gambar" },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("product_images").getPublicUrl(fileName);

    image_url = publicUrl;
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
    .eq("id", data.oldId);

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
  const oldId = String(formData.get("old_id"));
  const id = String(formData.get("id"));
  const brand = String(formData.get("brand"));
  const category = String(formData.get("category"));
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const description = String(formData.get("description"));
  const isChangedImage =
    String(formData.get("is_changed_image")) === "yes" ? true : false;
  const name = String(formData.get("name"));
  const parent_category = String(formData.get("parent_category"));

  return {
    oldId,
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
