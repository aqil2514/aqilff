import Navbar from "@/components/02_Navbar";
import HeroSection from "@/components/03_HeroSection";
import Products from "@/components/04_Products";
import AboutUs from "@/components/05_AboutUs";
// import Gallery from "@/components/06_Gallery";
import ContactUs from "@/components/07_ContactUs";
import Footer from "@/components/08_Footer";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Products />
      <AboutUs />
      {/* <Gallery /> */}
      <ContactUs />
      <Footer />
    </div>
  );
}
