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
