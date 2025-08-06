import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatToPercent, formatToRupiah } from "@/lib/utils"
import { IconType } from "react-icons/lib"

interface SummaryCardProps {
  title: string
  Icon: IconType
  data: number | undefined
  formatAs: "percent" | "rupiah"
}

export default function SummaryCard({
  data,
  Icon,
  title,
  formatAs,
}: SummaryCardProps) {
  const formatHandler = (raw: number) => {
    if (formatAs === "percent") {
      return formatToPercent(raw)
    } else {
      return formatToRupiah(raw)
    }
  }

  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-6 h-6 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        {data !== undefined ? (
          <div className="text-2xl font-bold tracking-tight">
            {formatHandler(data)}
          </div>
        ) : (
          <Skeleton className="w-full h-8 rounded" />
        )}
      </CardContent>

      <CardFooter>
        <p className="text-xs text-muted-foreground">Statistik hari ini</p>
      </CardFooter>
    </Card>
  )
}
