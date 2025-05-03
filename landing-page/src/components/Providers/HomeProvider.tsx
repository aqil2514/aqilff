import { Category, Product } from "@/@types/interfaces";
import React, { useContext } from "react";

interface HomeContextProps {
  products: Product[];
  categories: Category[];
}

interface HomeProviderProps extends HomeContextProps {
  children: React.ReactNode;
}

const HomeContext = React.createContext<HomeContextProps>(
  {} as HomeContextProps
);

export default function HomeProvider({
  categories,
  products,
  children,
}: HomeProviderProps) {
  return (
    <HomeContext.Provider value={{ categories, products }}>
      {children}
    </HomeContext.Provider>
  );
}

export const useHomeData = () => useContext(HomeContext);
