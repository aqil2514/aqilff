export interface BasicItem {
  label: string;
  value: string;
}

export interface InventoryItem extends BasicItem {
  stock: number;
}
