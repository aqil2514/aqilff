import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Products from "@/components/Products";
import AboutUs from "@/components/AboutUs";
// import Gallery from "@/components/06_Gallery";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

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
