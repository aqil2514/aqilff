import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatToPercent, formatToRupiah } from "@/lib/utils";
import { IconType } from "react-icons/lib";

interface SummaryCardProps {
  title: string;
  Icon: IconType;
  data: number | undefined;
  formatAs: "percent" | "rupiah";
}

export default function SummaryCard({
  data,
  Icon,
  title,
  formatAs,
}: SummaryCardProps) {
  const formatHandler = (raw: number) => {
    if (formatAs === "percent") {
      return formatToPercent(raw);
    } else if (formatAs === "rupiah") {
      return formatToRupiah(raw);
    }
    return "";
  };
  return (
    <Card className="justify-between gap-0">
      <CardHeader>
        <CardTitle className="text-center font-bold text-2xl">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Icon className="w-16 h-16 block mx-auto" />
      </CardContent>
      <CardFooter className="justify-center">
        {data ? formatHandler(data) : <Skeleton className="w-full" /> }
        </CardFooter>
    </Card>
  );
}
