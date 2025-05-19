import { Product } from "@/@types/products";
import { Row } from "@tanstack/react-table";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function useDeleteDialogLogic(row: Row<Product>) {
  const id = row.getValue("id") as string;
  const code = row.getValue("code") as string;
  const image_src = row.getValue("image_src") as string;
  const name = row.getValue("name") as string;
  const category = row.getValue("category") as string;
  const price = row.getValue("price") as string;
  const stock = row.getValue("stock") as string;

  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteHandler = async () => {
    try {
      setIsLoading(true);

      const { data } = await axios.delete("/api/products/delete", {
        params: {
          id,
        },
      });

      toast(data.message, { type: "success" });

      router.refresh();
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
    name,
    code,
    id,
    image_src,
    category,
    price,
    stock,
    isLoading,
    deleteHandler,
  };
}
