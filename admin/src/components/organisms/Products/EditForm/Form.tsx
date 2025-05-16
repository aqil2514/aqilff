import { Product } from "@/@types/products";
import { Row } from "@tanstack/react-table";
import { useEditProductFormLogics } from "./logics";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function EditFormProduct({ row }: { row: Row<Product> }) {
  const { register, image_src } = useEditProductFormLogics(row);
  return (
    <form className="space-y-4 my-4">
      <Image
        src={image_src ?? "/image/No_Image_Available.jpg"}
        alt="Preview"
        width={128}
        height={128}
        className="w-24 h-24 mt-2 block mx-auto rounded object-cover"
      />
      <div className="space-y-2">
        <Label htmlFor="id">ID Produk</Label>
        <Input id="id" {...register("id", { required: "Data harus diisi" })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nama Produk</Label>
        <Input
          id="name"
          {...register("name", { required: "Data harus diisi" })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="parent_category">Kategori Induk Produk</Label>
        <Input
          id="parent_category"
          {...register("parent_category", { required: "Data harus diisi" })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Kategori Produk</Label>
        <Input
          id="category"
          {...register("category", { required: "Data harus diisi" })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Harga Produk</Label>
        <Input
          id="price"
          {...register("price", { required: "Data harus diisi" })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stock">Stok Produk</Label>
        <Input
          id="stock"
          {...register("stock", { required: "Data harus diisi" })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi Produk</Label>
        <Textarea
          id="description"
          {...register("description", { required: "Data harus diisi" })}
        />
      </div>
    </form>
  );
}
