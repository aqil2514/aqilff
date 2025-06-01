import { supabaseAdmin } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handler untuk HTTP DELETE request yang digunakan untuk menghapus produk dari database
 * dan file gambar terkait dari Supabase Storage.
 *
 * Alur aksi:
 * 1. Mendapatkan ID produk dari query parameter (?id=...).
 * 2. Mengambil informasi gambar (`image_src`) dari database berdasarkan ID produk.
 * 3. Jika gambar ada, menghapus file gambar dari Supabase Storage.
 * 4. Menghapus data produk dari tabel `products`.
 *
 * @param {NextRequest} req - Objek request dari Next.js API Route.
 * @returns {Promise<NextResponse>} Response JSON yang menjelaskan status penghapusan:
 * - 200: Jika penghapusan berhasil.
 * - 400: Jika ID tidak disediakan dalam query parameter.
 * - 404: Jika produk tidak ditemukan di database.
 * - 500: Jika terjadi kesalahan saat menghapus gambar atau data produk.
 *
 * @example
 * DELETE /api/products?id=123
 *
 * Response:
 * {
 *   "message": "Data berhasil dihapus"
 * }
 */

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json(
      { message: "ID Product tidak ditemukan" },
      { status: 400 }
    );

  // Ambil dulu image_src dari database
  const { data: product, error: fetchError } = await supabaseAdmin
    .from("products")
    .select("image_src")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error(fetchError);
    return NextResponse.json(
      { message: "Produk tidak ditemukan" },
      { status: 404 }
    );
  }

  // Ambil path file dari image_src
  const imageUrl: string = product.image_src;
  if (imageUrl) {
    const bucket = "products-image"; // Ganti sesuai nama bucket kamu
    const imagePath = imageUrl.split(`${bucket}/`)[1]; // Ekstrak path file

    // Hapus gambar dari Supabase Storage jika ada
    if (imagePath) {
      const { error: storageError } = await supabaseAdmin.storage
        .from(bucket)
        .remove([imagePath]);

      if (storageError) {
        console.error("Gagal hapus gambar:", storageError);
        return NextResponse.json(
          { message: "Gagal menghapus gambar terkait" },
          { status: 500 }
        );
      }
    }
  }

  // Hapus data dari tabel produk
  const deleteInfo = await supabaseAdmin.from("products").delete().eq("id", id);

  if (deleteInfo.error) {
    console.error(deleteInfo.error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus data" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Data berhasil dihapus" },
    { status: 200 }
  );
}
