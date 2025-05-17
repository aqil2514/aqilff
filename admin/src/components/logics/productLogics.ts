import React, { useState } from "react";
import { useProductsData } from "../providers/ProductsProvider";

export function useSearchProductLogic() {
  const [name, setName] = useState<string>("");
  const { products, setFilteredProducts } = useProductsData();

  const searchNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    const filtered = products.filter((prod) =>
      prod.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredProducts(filtered);
  };

  return { name, searchNameHandler };
}
