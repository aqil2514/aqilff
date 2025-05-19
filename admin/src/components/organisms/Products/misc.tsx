import { Product } from "@/@types/products";
import { useProductsData } from "@/components/providers/ProductsProvider";
import { Row } from "@tanstack/react-table";
import { useMemo } from "react";

export function ProductStock({ row }: { row: Row<Product> }) {
  const { tItems } = useProductsData();

  const productId = row.getValue("id");
  const productOut = useMemo(() => {
    const filteredProducts = tItems.filter(
      (item) => item.product_id === productId
    );

    const amount = filteredProducts.reduce((acc, item) => {
      const quantity = item.quantity;

      return acc + quantity;
    }, 0);

    return amount;
  }, [tItems, productId]);

  const stock = Number(`${row.getValue("stock")}`);

  return <p>{stock - productOut} pcs</p>;
}
