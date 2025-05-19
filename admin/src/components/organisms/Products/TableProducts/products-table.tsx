import { DataTable } from "@/components/organisms/Products/data-table";
import { columns } from "./columns";
import { Product } from "@/@types/products";

export default function ProductTable({ data }: { data: Product[] }) {
  return <DataTable columns={columns} data={data} />;
}
