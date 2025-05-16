import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddFormProduct } from "./logics";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AddProductForm() {
  const {
    register,
    imageChooseHandler,
    imgUrl,
    deletePreviewImage,
    fileInputRef,
    handleSubmit,
    productSubmitHandler,
    errors,
    isLoading,
  } = useAddFormProduct();

  return (
    <form className="space-y-4" onSubmit={handleSubmit(productSubmitHandler)}>
      {imgUrl && (
        <div className="space-y-2">
          <p>Preview Gambar</p>
          <Image
            src={imgUrl}
            alt="Preview"
            width={60}
            height={60}
            className="w-24 h-24 mt-2 block mx-auto rounded object-cover"
          />
          <Button
            variant={"destructive"}
            type="button"
            onClick={deletePreviewImage}
            className="cursor-pointer hover:scale-95"
          >
            Hapus
          </Button>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="image">Gambar Produk : </Label>
        <Input
          disabled={isLoading}
          id="image"
          type="file"
          ref={fileInputRef}
          onChange={imageChooseHandler}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="id">ID Produk : </Label>
        <Input
          disabled={isLoading}
          id="id"
          placeholder="Contoh : PROD001..."
          {...register("id", { required: "Id produk wajib diisi" })}
        />
        {errors.id && (
          <p className="text-red-500 text-sm">{errors.id.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="product_name">Nama Produk : </Label>
        <Input
          disabled={isLoading}
          id="product_name"
          placeholder="Contoh : Produk A"
          {...register("name", { required: "Nama produk wajib diisi" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="product_price">Harga Produk : </Label>
        <Input
          disabled={isLoading}
          id="product_price"
          placeholder="Contoh : 10000"
          type="number"
          {...register("price", { required: "Harga produk wajib diisi" })}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="stock">Stok Produk : </Label>
        <Input
          disabled={isLoading}
          id="stock"
          placeholder="Contoh : 20"
          type="number"
          {...register("stock", { required: "Stok produk wajib diisi" })}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="parent_category">Kategori Induk : </Label>
        <Input
          disabled={isLoading}
          id="parent_category"
          placeholder="Contoh : Frozen Food"
          {...register("parent_category", {
            required: "Kategori induk wajib diisi",
          })}
        />
        {errors.parent_category && (
          <p className="text-red-500 text-sm">
            {errors.parent_category.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="sub_category">Kategori Sub : </Label>
        <Input
          disabled={isLoading}
          id="sub_category"
          placeholder="Contoh : Nugget"
          {...register("category", { required: "Kategori sub wajib diisi" })}
        />
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi Produk : </Label>
        <Textarea
          id="description"
          placeholder="Contoh : Makanan segar berbasis buah nangka"
          {...register("description")}
        />
      </div>
      <div className="my-2">
        <Button className="bg-blue-600 disabled:bg-blue-300 hover:bg-blue-500 hover:scale-95 active:scale-90 duration-200 cursor-pointer">
          {isLoading ? "Menambah..." : "Tambah Data"}
        </Button>
      </div>
    </form>
  );
}
