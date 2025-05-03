import Categories from "./Categories";
import HeroCTA from "./HeroCta";

export default function HeroSection() {
  return (
    <section id="home">
      <div className="min-h-screen grid grid-rows-[30%_auto] md:grid-rows-2 w-full">
        {/* Hero CTA */}
        <HeroCTA />
        {/* Categories */}
        <Categories />
      </div>
    </section>
  );
}
