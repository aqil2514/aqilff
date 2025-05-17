import React, { useState, useEffect } from "react";
import { useProductsData } from "../providers/ProductsProvider";

export function useSearchProductLogic() {
  const [name, setName] = useState<string>("");
  const { products, setFilteredProducts } = useProductsData();

  useEffect(() => {
    const filtered = products.filter((prod) =>
      prod.name.toLowerCase().includes(name.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [name, products, setFilteredProducts]);

  const searchNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  return { name, searchNameHandler };
}
