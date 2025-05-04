"use client";

import { Product } from "@/@types/interfaces";
import ProductsProvider from "@/components/Providers/ProductsProvider";
import ProductList from "./ProductList";
import MainWrapper from "@/components/Reuseable/main-wrapper";
import ProductFilter from "./ProductFilter";

export default function ProductsRoute({ products }: { products: Product[] }) {
  return (
    <ProductsProvider products={products}>
      <MainWrapper background="gradientRedToOrange">
        <ProductFilter />
        <ProductList />
      </MainWrapper>
    </ProductsProvider>
  );
}
