import { DataListOption } from "@/@types/general";
import { getProductData } from "@/lib/supabase/products";
import { getPurchaseData } from "@/lib/supabase/purchase";
import { NextResponse } from "next/server";

export async function GET() {
  const [products, purchase] = await Promise.all([
    getProductData(),
    getPurchaseData(),
  ]);

  const productData: DataListOption[] = products.map((prod) => {
    return {
      value: prod.name,
      key: prod.id,
    };
  });

  const supplierNameSet = new Set<string>();
  const supplierTypeSet = new Set<string>();

  for (const pur of purchase) {
    supplierNameSet.add(String(pur.supplier_name));
    supplierTypeSet.add(String(pur.supplier_type));
  }

  const supplierNames: DataListOption[] = Array.from(supplierNameSet).map(
    (sup) => {
      return {
        value: sup,
      };
    }
  );
  const supplierTypes: DataListOption[] = Array.from(supplierTypeSet).map(
    (sup) => {
      return { value: sup };
    }
  );

  return NextResponse.json(
    { productData, supplierNames, supplierTypes },
    { status: 200 }
  );
}
