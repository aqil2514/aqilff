"use client";

import MainWrapper from "@/components/atoms/main-wrapper";
import TransactionProvider from "@/components/featured/Transaction/provider";
import TransactionHeader from "@/components/featured/Transaction/TransactionHeader";
import TransactionMain from "@/components/featured/Transaction/TransactionMain";

export default function TransactionTemplate() {
  return (
    <TransactionProvider>
      <MainWrapper>
        <TransactionHeader />
        <TransactionMain />
      </MainWrapper>
    </TransactionProvider>
  );
}
