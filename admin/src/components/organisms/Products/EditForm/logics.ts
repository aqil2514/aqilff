import { Product } from "@/@types/products";
import { fetchProducts } from "@/lib/fetchers";
import { noImageSrc } from "@/lib/variables";
import { Row } from "@tanstack/react-table";
import axios, { isAxiosError } from "axios";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";

type ProductInputType = Omit<
  Product,
  "is_active" | "created_at" | "updated_at"
>;

export function useEditProductFormLogics(row: Row<Product>) {
  const id = row.getValue("id") as string;
  const code = row.getValue("code") as string;
  const brand = row.getValue("brand") as string;
  const parent_category = row.getValue("parent_category") as string;
  const category = row.getValue("category") as string;
  const name = row.getValue("name") as string;
  const description = row.getValue("description") as string;
  const image_src = row.getValue("image_src") as string;
  const price = row.getValue("price") as number;
  const stock = row.getValue("stock") as number;

  const {mutate} = useSWR("/api/products", fetchProducts)

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInputType>({
    defaultValues: {
      id,
      code,
      parent_category,
      category,
      name,
      price,
      brand,
      stock,
      description,
    },
  });

  const [imgPreview, setImgPreview] = useState<string>(image_src ?? noImageSrc);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileEditRef = useRef<HTMLInputElement | null>(null);

  const imageChooseHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      deletePreviewImage();
      toast("File yang dipilih bukan gambar yang didukung (jpeg, png, webp).", {
        type: "error",
      });
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      deletePreviewImage();
      toast("Ukuran file terlalu besar. Maksimal 2MB.", { type: "error" });
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setImgPreview(imageUrl);
    setSelectedFile(file);
  };

  const deletePreviewImage = () => {
    if (imgPreview) {
      URL.revokeObjectURL(imgPreview);
    }

    setImgPreview(noImageSrc);
    setSelectedFile(null);

    if (fileEditRef.current) {
      fileEditRef.current.value = "";
    }
  };

  const editSubmitHandler: SubmitHandler<ProductInputType> = async (data) => {
    const formData = new FormData();
    const isChangedImage =
      !!selectedFile && imgPreview !== row.original.image_src;
    
    formData.append("id", data.id);
    formData.append("code", data.code);
    formData.append("brand", data.brand);
    formData.append("category", data.category);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("description", data.description || "");
    formData.append("image", selectedFile ?? "");
    formData.append("isChangedImage", isChangedImage ? "yes" : "no");
    formData.append("name", data.name);
    formData.append("parent_category", data.parent_category);

    try {
      setIsLoading(true);
      const { data: resData } = await axios.putForm(
        "/api/products/edit",
        formData
      );

      toast(resData.message, { type: "success" });
      await mutate();
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;

        toast(data.message, { type: "error" });
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    imgPreview,
    deletePreviewImage,
    imageChooseHandler,
    fileEditRef,
    handleSubmit,
    editSubmitHandler,
    errors,
    isLoading,
  };
}
