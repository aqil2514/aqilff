"use client";

import HeroSection from "./Hero";
import Products from "./Products";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import Footer from "./Footer";
import { Category, Product } from "@/@types/interfaces";
import HomeProvider from "@/components/Providers/HomeProvider";

interface HomeRouteProps {
  products: Product[];
  categories: Category[];
}

export default function HomeRoute({ categories, products }: HomeRouteProps) {
  return (
    <HomeProvider products={products} categories={categories}>
      <div>
        <HeroSection />
        <Products />
        <AboutUs />
        <ContactUs />
        <Footer />
      </div>
    </HomeProvider>
  );
}
