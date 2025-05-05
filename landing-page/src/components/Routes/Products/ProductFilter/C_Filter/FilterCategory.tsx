import { poppins, tuffy } from "@/app/fonts";
import { useFilterProductsLogic } from "../logic/useFilterProductsLogic";

export default function CategoryFilter() {
  const { category, filter, categoryChangeHandler } = useFilterProductsLogic();
  return (
    <div>
      <p className={`${tuffy.className} !font-semibold text-base`}>Kategori</p>
      <div className="flex gap-4 justify-center flex-wrap mb-4 md:mb-0">
        {category.map((cat) => (
          <span key={cat.id} className="flex gap-1">
            <input
              type="radio"
              id={cat.id}
              name="category-filter"
              value={cat.name}
              onChange={categoryChangeHandler}
              checked={filter.category === cat.name}
            />
            <label htmlFor={cat.id} className={`${poppins.className} text-sm`}>
              {cat.name}
            </label>
          </span>
        ))}
      </div>
    </div>
  );
}
