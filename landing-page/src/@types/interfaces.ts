import { JSX } from "react";

export interface Contacts {
  icon: JSX.Element;
  title: string;
  body: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image_src: string;
  description?: string;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
