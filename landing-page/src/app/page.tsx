import Navbar from "@/components/Navbar";
import HeroSection from "@/components/Hero";
import Products from "@/components/Products";
import AboutUs from "@/components/AboutUs";
// import Gallery from "@/components/06_Gallery";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Product } from "@/@types/interfaces";

export default async function LandingPage() {
  let products: Product[] = [];

  try {
    const { data, error } = await supabase.from("products").select("*");

    if (error) throw error;

    products = data as Product[];
  } catch (err) {
    throw new Error(
      "Terjadi kesalahan saat mengambil data produk",
      err as ErrorOptions
    );
  }
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Products products={products} />
      <AboutUs />
      {/* <Gallery /> */}
      <ContactUs />
      <Footer />
    </div>
  );
}
