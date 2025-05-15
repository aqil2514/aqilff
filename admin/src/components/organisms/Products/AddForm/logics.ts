import { Product } from "@/@types/products";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type ProductInputType = Omit<
  Product,
  "stock" | "is_active" | "created_at" | "updated_at"
>;

export const useAddFormProduct = () => {
  const { register } = useForm<ProductInputType>();
  const [imgUrl, setImgUrl] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File | null>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    setImgUrl(imageUrl);
    setSelectedFile(file);
  };

  const deletePreviewImage = () => {
    if (imgUrl) {
      URL.revokeObjectURL(imgUrl);
    }

    setImgUrl(undefined);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    register,
    imgUrl,
    imageChooseHandler,
    fileInputRef,
    deletePreviewImage,
  };
};
