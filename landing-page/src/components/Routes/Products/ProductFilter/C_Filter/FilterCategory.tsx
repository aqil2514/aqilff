import { poppins, tuffy } from "@/app/fonts";
import { useFilterProductsLogic } from "../logic/useFilterProductsLogic";

export default function CategoryFilter() {
  const { filter, category, categoryChangeHandler } = useFilterProductsLogic();
  return (
    <div>
      <p className={`${tuffy.className} !font-semibold text-base`}>Kategori</p>
      <div className="flex gap-4 justify-center flex-wrap mb-4 md:mb-0">
        {category.map((cat) => (
          <span key={cat} className="flex gap-1">
            <input
              type="radio"
              id={cat}
              name="category-filter"
              value={cat}
              onChange={categoryChangeHandler}
              checked={filter.category === cat}
            />
            <label htmlFor={cat} className={`${poppins.className} text-sm`}>
              {cat}
            </label>
          </span>
        ))}
      </div>
    </div>
  );
}
