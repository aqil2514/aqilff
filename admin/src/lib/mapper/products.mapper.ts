import { Product, ProductMapperApi } from "@/@types/products";
import { InventoryItem } from "@/@types/ui";

export const productMapper: ProductMapperApi = {
  mapProductsToInventoryItems,
};

function mapProductsToInventoryItems(raw: Product): InventoryItem {
  return {
    label: raw.name,
    stock: raw.stock,
    value: raw.id,
  };
}
