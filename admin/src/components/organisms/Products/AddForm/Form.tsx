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
    reset,
    subCategoryList,
    categoryList,
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
        <Label htmlFor="code">Kode Produk : </Label>
        <Input
          disabled={isLoading}
          id="code"
          placeholder="Contoh : PROD001..."
          {...register("code", { required: "Id produk wajib diisi" })}
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
        <Label htmlFor="product_brand">Brand Produk : </Label>
        <Input
          disabled={isLoading}
          id="product_brand"
          placeholder="Contoh : Hemato"
          {...register("brand", { required: "Brand produk wajib diisi" })}
        />
        {errors.brand && (
          <p className="text-red-500 text-sm">{errors.brand.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="product_price">Harga Produk : </Label>
        <Input
          disabled={isLoading}
          id="product_price"
          step={500}
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
          list="parent_category_list"
          placeholder="Contoh : Frozen Food"
          {...register("parent_category", {
            required: "Kategori induk wajib diisi",
          })}
        />
        <datalist id="parent_category_list">
          {categoryList.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
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
          list="sub_category_list"
          placeholder="Contoh : Nugget"
          {...register("category", { required: "Kategori sub wajib diisi" })}
        />
        <datalist id="sub_category_list">
          {subCategoryList.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
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
      <div className="my-2 space-x-4">
        <Button className="bg-blue-600 disabled:bg-blue-300 hover:bg-blue-500 hover:scale-95 active:scale-90 duration-200 cursor-pointer">
          {isLoading ? "Menambah..." : "Tambah Data"}
        </Button>
        <Button
          type="button"
          className="bg-amber-600 disabled:bg-amber-300 hover:bg-amber-500 hover:scale-95 active:scale-90 duration-200 cursor-pointer"
          onClick={() => reset()}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
