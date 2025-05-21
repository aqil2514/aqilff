import { UpdateLogStock, UpdateLogStockRpcArgs } from "@/@types/utils-server";
import { supabaseAdmin } from "./supabaseServer";

export async function update_stock_log({
  product_id,
  quantity,
  reference_id,
  source,
}: UpdateLogStockRpcArgs): Promise<UpdateLogStock> {

  const logResult = await supabaseAdmin.rpc("log_stock_change", {
    p_product_id: product_id,
    p_quantity_change: -quantity,
    p_source: source,
    p_reference_id: reference_id,
  });

  if (logResult.error) {
    return {
      message: "Gagal mencatat log stok",
      logError: logResult.error,
      status: 500,
    };
  }

  return {
    message: "Berhasil mencatat log stok",
    status: 200,
  };
}
