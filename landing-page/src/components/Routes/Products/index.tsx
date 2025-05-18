"use client";

import { Product } from "@/@types/interfaces";
import ProductsProvider from "@/components/Providers/ProductsProvider";
import ProductList from "./ProductList";
import MainWrapper from "@/components/Reuseable/main-wrapper";
import ProductFilter from "./ProductFilter";
import { Suspense } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductsRoute() {
  const { data, error, isLoading } = useSWR("/api/data", fetcher);

  if (isLoading)
    return (
      <MainWrapper background="gradientRedToOrange">
        Loading data...
      </MainWrapper>
    );
  if (error)
    return (
      <MainWrapper background="gradientRedToOrange">
        Failed to load data.
      </MainWrapper>
    );

  const { products }: { products: Product[] } = data;

  return (
    <ProductsProvider products={products}>
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
