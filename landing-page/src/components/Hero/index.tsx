import { getCategories } from "@/lib/supabase-fetch";
import Categories from "./Categories";
import HeroCTA from "./HeroCta";

export default async function HeroSection() {
  const categories = await getCategories();

  return (
    <section id="home">
      <div className="min-h-screen grid grid-rows-[30%_auto] md:grid-rows-2 w-full">
        {/* Hero CTA */}
        <HeroCTA />
        {/* Categories */}
        <Categories categories={categories} />
      </div>
    </section>
  );
}
