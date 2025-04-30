import { JSX } from "react";

export interface Contacts {
  icon: JSX.Element;
  title: string;
  body: string;
}

export interface Product {
  id: string;
  price: number;
  name: string;
  category: "Nugget" | "Sosis" | "Otak-otak";
  imageSrc: string;
}