import { comicRelief } from "@/app/fonts";
import GoogleMap from "./GoogleMap";
import Contact from "./Contact";

export default function ContactUs() {
  return (
    <section id="contactus" className="pt-4 pb-12 min-h-screen px-4 md:px-8 bg-cover bg-center bg-no-repeat bg-darken bg-[url('/contact-us-background.jpg')]">
      <h2
        className={`text-center ${comicRelief.className} text-5xl text-white`}
      >
        Kontak Kami
      </h2>
      <div className="grid gap-2 grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-2 mt-4">
        <GoogleMap />
        <Contact />
      </div>
    </section>
  );
}
