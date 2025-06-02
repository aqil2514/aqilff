import { Transaction, TransactionItem } from "@/@types/transaction";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { updateStock, update_stock_log } from "@/lib/utils/server/rpc";
import { formatTransaction, TransactionSchema } from "@/schema/transaction";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const raw = (await req.json()) as Transaction;
  const body = formatTransaction(raw);

  const parsed = TransactionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const data = parsed.data;
  const transactionId = raw.id as string;
  const { items, ...transactionPayload } = data;

  // 1. Ambil item lama
  const { data: oldItems, error: oldItemsError } = await supabaseAdmin
    .from("transaction_items")
    .select("*")
    .eq("transaction_id", transactionId);

  if (oldItemsError) {
    return NextResponse.json(
      { message: "Gagal mengambil item lama", error: oldItemsError },
      { status: 500 }
    );
  }

  // 2. Rollback stok & purchase_items
  for (const item of oldItems || []) {
    const { product_id, quantity } = item as TransactionItem;

    const { success, error: rollbackError } = await updateStock({
      product_id,
      quantity,
      operation: "increment",
    });

    if (!success) {
      return NextResponse.json(
        { message: "Gagal rollback stok lama", error: rollbackError },
        { status: 500 }
      );
    }

    const { logError } = await update_stock_log({
      product_id,
      quantity,
      source: "rollback-transaction",
      reference_id: transactionId,
    });

    if (logError) {
      console.error("Gagal log rollback", logError);
    }

    // Rollback remaining_quantity
    const { error: rollbackPurchaseError } = await supabaseAdmin.rpc(
      "rollback_remaining_quantity",
      {
        product_id,
        rollback_qty: quantity,
      }
    );

    if (rollbackPurchaseError) {
      return NextResponse.json(
        {
          message: "Gagal rollback remaining_quantity",
          error: rollbackPurchaseError,
        },
        { status: 500 }
      );
    }
  }

  // 3. Hapus item lama
  const { error: deleteError } = await supabaseAdmin
    .from("transaction_items")
    .delete()
    .eq("transaction_id", transactionId);

  if (deleteError) {
    return NextResponse.json(
      { message: "Gagal menghapus item lama", error: deleteError },
      { status: 500 }
    );
  }

  // 4. Update transaksi utama
  const { error: updateTransactionError } = await supabaseAdmin
    .from("transactions")
    .update(transactionPayload)
    .eq("id", transactionId);

  if (updateTransactionError) {
    return NextResponse.json(
      { message: "Gagal mengupdate transaksi", error: updateTransactionError },
      { status: 500 }
    );
  }

  // 5. Tambahkan item baru, hitung ulang HPP pakai FIFO
  for (const item of items) {
    const { product_id, quantity, price_per_unit } = item;

    // Ambil pembelian sesuai FIFO
    const { data: purchases, error: purchaseError } = await supabaseAdmin
      .from("purchase_items")
      .select("*")
      .eq("product_id", product_id)
      .gt("remaining_quantity", 0)
      .order("created_at", { ascending: true });

    if (purchaseError) {
      return NextResponse.json(
        { message: "Gagal mengambil data pembelian", error: purchaseError },
        { status: 500 }
      );
    }

    let qtyNeeded = quantity;
    let totalCost = 0;
    const purchaseUpdates: { id: string; newQty: number }[] = [];

    for (const p of purchases) {
      if (qtyNeeded === 0) break;

      const takeQty = Math.min(qtyNeeded, p.remaining_quantity);
      totalCost += takeQty * p.purchase_price;
      qtyNeeded -= takeQty;

      purchaseUpdates.push({
        id: p.id,
        newQty: p.remaining_quantity - takeQty,
      });
    }

    if (qtyNeeded > 0) {
      return NextResponse.json(
        { message: "Stok pembelian tidak cukup untuk produk", product_id },
        { status: 400 }
      );
    }

    const hpp = totalCost / quantity;
    const margin = price_per_unit - hpp;

    // Update remaining_quantity
    for (const update of purchaseUpdates) {
      const { error: updatePurchaseError } = await supabaseAdmin
        .from("purchase_items")
        .update({ remaining_quantity: update.newQty })
        .eq("id", update.id);

      if (updatePurchaseError) {
        return NextResponse.json(
          {
            message: "Gagal update remaining_quantity",
            error: updatePurchaseError,
          },
          { status: 500 }
        );
      }
    }

    // Insert item transaksi
    const itemPayload = {
      ...item,
      transaction_id: transactionId,
      hpp,
      margin,
    };

    const { error: insertError } = await supabaseAdmin
      .from("transaction_items")
      .insert(itemPayload);

    if (insertError) {
      return NextResponse.json(
        { message: "Gagal menambahkan item transaksi", error: insertError },
        { status: 500 }
      );
    }

    // Update stok produk (decrement)
    const { success, error: stockError } = await updateStock({
      product_id,
      quantity,
      operation: "decrement",
    });

    if (!success) {
      return NextResponse.json(
        { message: "Gagal mengurangi stok produk", error: stockError },
        { status: 500 }
      );
    }

    // Log stok
    const { logError } = await update_stock_log({
      product_id,
      quantity: -quantity,
      source: "transaction-edit",
      reference_id: transactionId,
    });

    if (logError) {
      console.error("Gagal log transaksi edit", logError);
    }
  }

  return NextResponse.json(
    { message: "Transaksi berhasil diubah" },
    { status: 200 }
  );
}
