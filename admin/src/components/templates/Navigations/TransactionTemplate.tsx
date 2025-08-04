"use client";

import useSWR from "swr";
import MainWrapper from "../../atoms/main-wrapper";
import TransactionProvider, {
  useTransactionData,
} from "../../providers/TransactionProvider";
import { fetchTransactionsResources } from "@/lib/fetchers";
import TransactionTable from "../../organisms/Transactions/TableTransactions/transactions-table";
import RetrieveDataPopover from "@/components/molecules/Popover/RetrieveData";
import { getTransactionHandler } from "@/lib/api/transaction";
import { Button } from "@/components/ui/button";
import { MdAdd } from "react-icons/md";
import Link from "next/link";
// import { RetrieveDataPopover } from "../../molecules/RetrieveData";

export default function TransactionTemplate() {
  const { data, isLoading, error } = useSWR(
    "/api/transaction/get-resource",
    fetchTransactionsResources
  );

  if (isLoading) return <MainWrapper>Loading produk...</MainWrapper>;
  if (error) return <MainWrapper>Gagal memuat produk!</MainWrapper>;
  if (!data) return null;

  return (
    <TransactionProvider products={data.products}>
      <InnerTemplate />
    </TransactionProvider>
  );
}

// const InnerTemplate = () => {
//   const {
//     isLoadingTransactions,
//     setTransactions,
//     setDateRange,
//     setIsLoadingTransactions,
//   } = useTransactionData();
//   return (
//     <MainWrapper className="!block pt-16 px-4">
//       <h1 className="text-center">Daftar Transaksi</h1>
//       <div className="flex gap-4 items-center">
//         <AddTransactionFormDialog />
//         <RetrieveDataPopover
//           data_src="transactions"
//           isLoading={isLoadingTransactions}
//           setData={setTransactions}
//           setDateRange={setDateRange}
//           setIsLoading={setIsLoadingTransactions}
//         />
//       </div>
//       <CoreData />
//     </MainWrapper>
//   );
// };

const InnerTemplate = () => {
  const { setTransactions } = useTransactionData();

  const retrieveHandler = async (startDate: string, endDate: string) => {
    const { data, success } = await getTransactionHandler(startDate, endDate);
    if (!success) return;

    setTransactions(data);
  };
  return (
    <MainWrapper className="!block pt-16 px-4">
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
      <TransactionTable />
    </MainWrapper>
  );
};
