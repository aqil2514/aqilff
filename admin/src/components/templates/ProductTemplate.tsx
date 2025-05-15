"use client";

import ProductsProvider from "../providers/ProductsProvider";

import MainWrapper from "../atoms/main-wrapper";

import { Product } from "@/@types/products";
import TableProducts from "../organisms/TableProducts";

export default function ProductTemplate({ products }: { products: Product[] }) {
  return (
    <ProductsProvider products={products}>
      <MainWrapper className="!block p-4">
        <h1 className="text-center">Daftar Produk</h1>
        <TableProducts />
      </MainWrapper>
    </ProductsProvider>
  );
}