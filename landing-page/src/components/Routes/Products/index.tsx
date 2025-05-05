"use client";

import { Category, Product } from "@/@types/interfaces";
import ProductsProvider from "@/components/Providers/ProductsProvider";
import ProductList from "./ProductList";
import MainWrapper from "@/components/Reuseable/main-wrapper";
import ProductFilter from "./ProductFilter";
import { Suspense } from "react";

export default function ProductsRoute({
  products,
  category,
}: {
  products: Product[];
  category: Category[];
}) {
  return (
    <ProductsProvider products={products} category={category}>
      <MainWrapper background="gradientRedToOrange">
        <Suspense fallback={<div>Loading Filter...</div>}>
          <ProductFilter />
        </Suspense>
        <Suspense fallback={<div>Loading Products...</div>}>
          <ProductList />
        </Suspense>
      </MainWrapper>
    </ProductsProvider>
  );
}
