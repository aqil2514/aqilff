import { supabaseAdmin } from "@/lib/supabaseServer";

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
