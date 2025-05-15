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
  } = useAddFormProduct();

  return (
    <form className="space-y-4">
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
          id="image"
          type="file"
          ref={fileInputRef}
          onChange={imageChooseHandler}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="id">ID Produk : </Label>
        <Input id="id" placeholder="Contoh : PROD001..." {...register("id")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="product_name">Nama Produk : </Label>
        <Input
          id="product_name"
          placeholder="Contoh : Produk A"
          {...register("name")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="product_price">Harga Produk : </Label>
        <Input
          id="product_price"
          placeholder="Contoh : 10000"
          type="number"
          {...register("price")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="parent_category">Kategori Induk : </Label>
        <Input
          id="parent_category"
          placeholder="Contoh : Frozen Food"
          {...register("parent_category")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sub_category">Kategori Sub : </Label>
        <Input
          id="sub_category"
          placeholder="Contoh : Nugget"
          {...register("category")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi Produk : </Label>
        <Textarea
          id="description"
          placeholder="Contoh : Nugget"
          {...register("category")}
        />
      </div>
    </form>
  );
}
