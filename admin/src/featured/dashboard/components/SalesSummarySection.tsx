import { TransactionStatisic } from "@/@types/rpc"
import SummaryCard from "@/components/molecules/Cards/SummaryCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GiCash } from "react-icons/gi"
import { LiaCashRegisterSolid } from "react-icons/lia"
import { RiCashFill } from "react-icons/ri"
import { SiCashapp } from "react-icons/si"

interface SummarySectionProps {
  data: TransactionStatisic | undefined
}

export function SalesSummarySection({ data }: SummarySectionProps) {
  const omzet = data?.total_subtotal
  const hpp = data?.total_hpp
  const margin = Number(omzet) - Number(hpp)
  const marginPercent = (Number(margin) / Number(omzet)) * 100 || 0

  return (
    <section className="space-y-6">
      <h2 className="text-center font-semibold text-2xl tracking-tight underline">
        Statistik Hari Ini
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <SummaryCard
          title="Omzet"
          Icon={SiCashapp}
          data={omzet}
          formatAs="rupiah"
        />
        <SummaryCard
          title="HPP"
          Icon={GiCash}
          data={hpp}
          formatAs="rupiah"
        />
        <SummaryCard
          title="Margin"
          Icon={LiaCashRegisterSolid}
          data={margin}
          formatAs="rupiah"
        />
        <SummaryCard
          title="Margin %"
          Icon={RiCashFill}
          data={marginPercent}
          formatAs="percent"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/transactions">
          <Button
            size="lg"
            className="w-full bg-orange-700 hover:bg-orange-600 text-white font-semibold"
          >
            Lihat Transaksi
          </Button>
        </Link>
        <Link href="/reports/sales">
          <Button
            size="lg"
            className="w-full bg-orange-700 hover:bg-orange-600 text-white font-semibold"
          >
            Laporan Penjualan
          </Button>
        </Link>
      </div>
    </section>
  )
}
