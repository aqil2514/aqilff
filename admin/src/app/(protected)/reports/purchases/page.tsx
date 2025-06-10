import ReportPurchaseTemplate from "@/components/templates/Reports/ReportPurchasesTemplate"
import { Metadata } from "next"

export const metadata:Metadata = {
    title:"Laporan Pembelian"
}

export default function PurchaseReportPage(){
    return <ReportPurchaseTemplate />
}