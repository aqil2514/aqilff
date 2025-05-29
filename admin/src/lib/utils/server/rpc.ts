import { UpdateLogStock, UpdateLogStockRpcArgs, UpdateStockParams } from "@/@types/utils-server";
import { supabaseAdmin } from "../../supabaseServer";

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
    console.error(logResult.error)
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

export async function updateStock({
  product_id,
  quantity,
  operation,
}: UpdateStockParams) {
  const delta = operation === "decrement" ? -Math.abs(quantity) : Math.abs(quantity);

  const rpc = await supabaseAdmin.rpc("update_stock", {
    p_product_id: product_id,
    p_delta: delta,
  });

  if (rpc.error) {
    console.error(rpc.error);
    return {
      success: false,
      error: rpc.error,
      message: "Gagal memperbarui stok",
    };
  }

  return {
    success: true,
    message: "Stok berhasil diperbarui",
  };
}