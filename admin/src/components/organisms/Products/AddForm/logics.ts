import { Product } from "@/@types/products";
import { useProductsData } from "@/components/providers/ProductsProvider";
import { fetchProducts } from "@/lib/fetchers";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";

type ProductInputType = Omit<
  Product,
  "is_active" | "created_at" | "updated_at"
>;

export const useAddFormProduct = () => {
  const { products } = useProductsData();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductInputType>();
  const [imgUrl, setImgUrl] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { mutate } = useSWR("/api/products", fetchProducts);

  const categoryList = useMemo(() => {
    const categorySet = new Set<string>();

    products.map((prod) => {
      categorySet.add(prod.parent_category);
    });

    return Array.from(categorySet);
  }, [products]);

  const subCategoryList = useMemo(() => {
    const subCategoryMap = new Set<string>();

    products.map((prod) => {
      subCategoryMap.add(prod.category);
    });

    return Array.from(subCategoryMap);
  }, [products]);

  const productSubmitHandler: SubmitHandler<ProductInputType> = async (
    data
  ) => {
    const form = new FormData();

    form.append("id", data.id);
    form.append("category", data.category);
    form.append("price", String(data.price));
    form.append("stock", String(data.stock));
    form.append("description", data.description || "");
    form.append("image", selectedFile ?? "");
    form.append("name", data.name);
    form.append("brand", data.brand);
    form.append("parent_category", data.parent_category);
    form.append("category", data.category);

    try {
      setIsLoading(true);
      const { data: res } = await axios.postForm("/api/products/add", form);

      toast(res.message, { type: "success" });
      router.refresh();
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;

        toast(data.message, { type: "error" });
        await mutate();
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
    handleSubmit,
    productSubmitHandler,
    errors,
    reset,
    subCategoryList,
    categoryList,
    isLoading,
  };
};
