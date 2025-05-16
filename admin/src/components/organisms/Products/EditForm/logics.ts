import { Product } from "@/@types/products";
import { Row } from "@tanstack/react-table";
import { useForm } from "react-hook-form";

type ProductInputType = Omit<
  Product,
  "is_active" | "created_at" | "updated_at"
>;

export function useEditProductFormLogics(row: Row<Product>) {
  const id = row.getValue("id") as string;
  const parent_category = row.getValue("parent_category") as string;
  const category = row.getValue("category") as string;
  const name = row.getValue("name") as string;
  const description = row.getValue("description") as string;
  const image_src = row.getValue("image_src") as string;
  const price = row.getValue("price") as number;
  const stock = row.getValue("stock") as number;

  const { register } = useForm<ProductInputType>({
    defaultValues: {
      id,
      parent_category,
      category,
      name,
      price,
      stock,
      description
    },
  });
  return {
    register,
    image_src
  };
}
