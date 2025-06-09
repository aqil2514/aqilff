import { Product } from "@/@types/products";
import { Row } from "@tanstack/react-table";
import { useEditProductFormLogics } from "./logics";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { noImageSrc } from "@/lib/variables";
import { useAddFormProduct } from "../AddForm/logics";

export default function EditFormProduct({ row }: { row: Row<Product> }) {
  const {
    register,
    imgPreview,
    deletePreviewImage,
    fileEditRef,
    imageChooseHandler,
    editSubmitHandler,
    handleSubmit,
    isLoading,
  } = useEditProductFormLogics(row);
  const { categoryList, subCategoryList } = useAddFormProduct();

  return (
    <form className="space-y-4 my-4" onSubmit={handleSubmit(editSubmitHandler)}>
      <div>
        <Image
          src={imgPreview}
          alt="Preview"
          width={128}
          height={128}
          className="w-24 h-24 mt-2 block mx-auto rounded object-cover"
        />
        <div className="flex gap-4">
          {imgPreview !== noImageSrc && (
            <Button
              onClick={deletePreviewImage}
              size={"sm"}
              variant={"destructive"}
            >
              Hapus Gambar
            </Button>
          )}
        </div>
      </div>
      {imgPreview === noImageSrc && (
        <div className="space-y-2">
          <Label htmlFor="image">Gambar Produk</Label>
          <Input
            id="image"
            ref={fileEditRef}
            type="file"
            onChange={imageChooseHandler}
          />
        </div>
      )}
        <Input id="id" {...register("id", { required: "Data harus diisi" })} type="hidden" />
      <div className="space-y-2">
        <Label htmlFor="code">Kode Produk</Label>
        <Input id="code" {...register("code", { required: "Data harus diisi" })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nama Produk</Label>
        <Input
          id="name"
          {...register("name", { required: "Data harus diisi" })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="brand">Brand Produk</Label>
        <Input
          id="brand"
          {...register("brand", { required: "Data harus diisi" })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="parent_category">Kategori Induk Produk</Label>
        <Input
          id="parent_category"
          list="parent_category_list"
          {...register("parent_category", { required: "Data harus diisi" })}
        />
        <datalist id="parent_category_list">
          {categoryList.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Kategori Produk</Label>
        <Input
          id="category"
          list="sub_category_list"
          {...register("category", { required: "Data harus diisi" })}
        />
        <datalist id="sub_category_list">
          {subCategoryList.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Harga Produk</Label>
        <Input
          id="price"
          type="number"
          {...register("price", { required: "Data harus diisi" })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stock">Stok Produk</Label>
        <Input
          id="stock"
          type="number"
          {...register("stock", { required: "Data harus diisi" })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi Produk</Label>
        <Textarea id="description" {...register("description")} />
      </div>
      <div className="my-2">
        <Button className="bg-blue-600 disabled:bg-blue-300 hover:bg-blue-500 hover:scale-95 active:scale-90 duration-200 cursor-pointer">
          {isLoading ? "Mengedit..." : "Edit Data"}
        </Button>
      </div>
    </form>
  );
}
