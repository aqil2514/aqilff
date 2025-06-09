import ReportPurchaseTemplate from "@/components/templates/ReportPurchasesTemplate"
import { Metadata } from "next"

export const metadata:Metadata = {
    title:"Laporan Pembelian"
}

export default function PurchaseReportPage(){
    return <ReportPurchaseTemplate />
}