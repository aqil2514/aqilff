import { JSX } from "react";

export interface Category {
  id: string; // ID kategori, sesuai dengan tipe data VARCHAR(255) di database
  name: string; // Nama kategori
  image_url: string; // URL gambar kategori
  description?: string; // Deskripsi kategori, sifatnya opsional
  created_at: string; // Timestamp pembuatan kategori
  updated_at: string; // Timestamp pembaruan kategori
}


export interface Contacts {
  icon: JSX.Element;
  title: string;
  body: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  parent_category: string;
  category: string;
  image_src: string;
  description?: string;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
