"use client";

import { Product } from "@/@types/products";
import ProductsProvider from "../providers/ProductsProvider";

export default function ProductTemplate({products}: { products: Product[] }) {
  return (
    <ProductsProvider products={products}>
      <div>Products</div>
    </ProductsProvider>
  );
}
