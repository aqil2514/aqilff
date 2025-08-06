import RetrieveDataPopover from "@/components/molecules/Popover/RetrieveData";
import { Button } from "@/components/ui/button";
import { getTransactionHandler } from "@/lib/api/transaction/clientApiHelper";
import Link from "next/link";
import { MdAdd } from "react-icons/md";
import { useTransactionData } from "./provider";

export default function TransactionHeader() {
  const { setTransactions } = useTransactionData();
  const retrieveHandler = async (startDate: string, endDate: string) => {
    const { data, success } = await getTransactionHandler(startDate, endDate);
    if (!success) return;

    setTransactions(data);
  };

  return (
    <header>
      <h1 className="text-center">Daftar Transaksi</h1>
      <div className="flex gap-4 items-center">
        <Link href={"/transactions/add"}>
          <Button className="bg-green-600 hover:bg-green-700 active:scale-95 duration-200 my-2 cursor-pointer">
            <MdAdd />
            Buat Transaksi
          </Button>
        </Link>
        <RetrieveDataPopover retrieveHandler={retrieveHandler} />
      </div>
    </header>
  );
}
