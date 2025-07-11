import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useMemo } from "react";

export default function Summary() {
  return (
    <ScrollArea className="bg-white shadow-md overflow-auto rounded-xl h-full flex-1 p-4 space-y-6">
      <SummaryStats />
    </ScrollArea>
  );
}

const SummaryStats = () => {
  const { transaction } = useReportSalesData();

  const summary = useMemo(() => {
    let totalRevenue = 0;
    let totalUnitsSold = 0;
    let totalMargin = 0;
    let totalHPP = 0;

    const productMap: Record<
      string,
      {
        name: string;
        quantity: number;
        amount: number;
        margin: number;
        hpp: number;
        marginPercentage?: number;
      }
    > = {};

    for (const trx of transaction) {
      totalRevenue += trx.total_amount;

      for (const item of trx.items ?? []) {
        totalUnitsSold += item.quantity;
        totalHPP += item.hpp ?? 0;
        totalMargin = totalRevenue - totalHPP;

        if (!productMap[item.product_id]) {
          productMap[item.product_id] = {
            name: item.product_name,
            quantity: 0,
            amount: 0,
            margin: 0,
            hpp: 0,
          };
        }

        const prod = productMap[item.product_id];
        prod.quantity += item.quantity;
        prod.amount += item.subtotal ?? 0;
        prod.margin += item.margin ?? 0;
        prod.hpp += (item.hpp ?? 0) * item.quantity;
      }
    }
    for (const id in productMap) {
      const prod = productMap[id];
      prod.marginPercentage =
        prod.amount > 0 ? (prod.margin / prod.amount) * 100 : 0;
    }

    const sortedByQty = Object.values(productMap).sort(
      (a, b) => b.quantity - a.quantity
    );
    const sortedByAmount = Object.values(productMap).sort(
      (a, b) => b.amount - a.amount
    );
    const sortedByMargin = Object.values(productMap).sort(
      (a, b) => b.margin - a.margin
    );

    return {
      totalRevenue: Math.round(totalRevenue),
      totalUnitsSold,
      totalMargin: Math.round(totalMargin),
      totalHPP: Math.round(totalHPP),
      marginPercentage:
        totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0,
      totalTransactions: transaction.length,
      bestSellingProduct: sortedByQty[0],
      highestRevenueProduct: sortedByAmount[0],
      mostProfitableProduct: sortedByMargin[0],
    };
  }, [transaction]);

  if (transaction.length <= 0) return null;

  return (
    <>
      <h2>Statistik Penjualan Keseluruhan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gray-600">Total Transaksi</p>
          <p className="text-xl font-semibold">{summary.totalTransactions}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Omzet</p>
          <p className="text-xl font-semibold">
            Rp{" "}
            {summary.totalRevenue.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Unit Terjual</p>
          <p className="text-xl font-semibold">{summary.totalUnitsSold} pcs</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Total Modal (HPP)</p>
          <p className="text-xl font-semibold">
            Rp{" "}
            {summary.totalHPP.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Margin Kotor</p>
          <p className="text-xl font-semibold">
            Rp{" "}
            {summary.totalMargin.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Persentase Margin</p>
          <p className="text-xl font-semibold">
            {summary.marginPercentage.toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            %
          </p>
        </div>

        {summary.bestSellingProduct && (
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-600">Produk Terlaris (Qty)</p>
            <p className="text-lg font-semibold">
              {summary.bestSellingProduct.name} (
              {summary.bestSellingProduct.quantity} pcs)
            </p>
          </div>
        )}

        {summary.highestRevenueProduct && (
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-600">
              Produk Volume Terbesar (Omzet)
            </p>
            <p className="text-lg font-semibold">
              {summary.highestRevenueProduct.name} (Rp{" "}
              {Math.round(summary.highestRevenueProduct.amount).toLocaleString(
                "id-ID"
              )}
              )
            </p>
          </div>
        )}

        {summary.mostProfitableProduct && (
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-600">
              Produk Paling Menguntungkan (Margin)
            </p>
            <p className="text-lg font-semibold">
              {summary.mostProfitableProduct.name} (Rp{" "}
              {Math.round(summary.mostProfitableProduct.margin).toLocaleString(
                "id-ID"
              )}
              )
            </p>
          </div>
        )}
      </div>
    </>
  );
};
