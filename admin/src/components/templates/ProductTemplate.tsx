"use client";

import ProductsProvider from "../providers/ProductsProvider";

import MainWrapper from "../atoms/main-wrapper";

import { Product } from "@/@types/products";
import TableProducts from "../organisms/Products/TableProducts";
import AddProductFormDialog from "../organisms/Products/AddForm";

export default function ProductTemplate({ products }: { products: Product[] }) {
  return (
    <ProductsProvider products={products}>
      <MainWrapper className="!block p-4">
        <h1 className="text-center">Daftar Produk</h1>
        <AddProductFormDialog />
        <TableProducts />
      </MainWrapper>
    </ProductsProvider>
  );
}