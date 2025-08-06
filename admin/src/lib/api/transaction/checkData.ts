import { Product } from "@/@types/products";
import { PurchaseItem } from "@/@types/purchases";
import { TransactionItem } from "@/@types/transaction";

export function checkData(
  items: TransactionItem[],
  products: Product[],
  purchaseItemData: PurchaseItem[]
) {
  const isThereInDb = isProductThereInDb(items, products);
  if (!isThereInDb.success)
    return {
      message: isThereInDb.checkMessage,
      success: isThereInDb.success,
      status: isThereInDb.status,
    };

  const isQuantityEnough = isQuantityDbEnough(items, products);
  if (!isQuantityEnough.success)
    return {
      message: isQuantityEnough.checkMessage,
      success: isQuantityEnough.success,
      status: isQuantityEnough.status,
    };

  const isTherePurchaseItem = isPurchaseItemEnough(items, purchaseItemData);
  if (!isTherePurchaseItem.success)
    return {
      message: isTherePurchaseItem.message,
      success: isTherePurchaseItem.success,
      status: isTherePurchaseItem.status,
    };

  return {
    message: "Validasi berhasil",
    success: true,
    status: 200,
  };
}

function isProductThereInDb(items: TransactionItem[], products: Product[]) {
  const productsId = products.map((i) => i.id);
  for (const item of items) {
    if (!productsId.includes(item.product_id as string)) {
      return {
        success: false,
        checkMessage: `Produk dengan Id '${item.product_id}' tidak ada di Database`,
        status: 404,
      };
    }
  }
  return {
    success: true,
    checkMessage: `Produk ada di Database`,
    status: 200,
  };
}

function isQuantityDbEnough(raw: TransactionItem[], productData: Product[]) {
  // Cek apakah kuantitinya ada di database?
  for (const item of raw as TransactionItem[]) {
    const selectedData = productData.find((pr) => pr.id === item.product_id);

    if (item.quantity <= 0) {
      return {
        success: false,
        checkMessage: `Jumlah item dengan produk id '${item.product_id}' tidak boleh nol atau negatif.`,
        status: 400,
      };
    }

    if (!selectedData) {
      return {
        success: false,
        checkMessage: "Terjadi kesalahan saat pengecekan kuantiti",
        status: 400,
      };
    }

    if (selectedData.stock < item.quantity)
      return {
        success: false,
        checkMessage: `Kuantiti yang tersedia hanya ${selectedData.stock}. Yang diminta ${item.quantity}`,
        status: 400,
      };
  }

  return {
    success: true,
    checkMessage: `Kuantiti tersedia`,
    status: 200,
  };
}

function isPurchaseItemEnough(
  raw: TransactionItem[],
  purchaseItemData: PurchaseItem[]
) {
  for (const item of raw as TransactionItem[]) {
    const selectedPurchaseItem = purchaseItemData.filter(
      (pur) => pur.product_id === item.product_id && pur.remaining_quantity >= 0
    );
    if (selectedPurchaseItem.length <= 0)
      return {
        message: `Data untuk barang dengan id '${item.product_id}' belum tersedia`,
        success: false,
        status: 400,
      };

    const stockAmount = selectedPurchaseItem.reduce(
      (acc, curr) => acc + curr.remaining_quantity,
      0
    );

    if (stockAmount < item.quantity)
      return {
        success: false,
        message: `Kuantiti dengan ${item.product_id} di data kedatangan hanya ${stockAmount}`,
        status: 400,
      };
  }

  return {
    success: true,
    status: 200,
    message: "Kuantiti tersedia",
  };
}
