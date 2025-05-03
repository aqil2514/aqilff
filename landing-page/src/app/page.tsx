import Navbar from "@/components/Navbar";
import HeroSection from "@/components/Hero";
import Products from "@/components/Products";
import AboutUs from "@/components/AboutUs";
// import Gallery from "@/components/06_Gallery";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/supabase-fetch";

export default async function LandingPage() {
  const products = await getProducts();

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
