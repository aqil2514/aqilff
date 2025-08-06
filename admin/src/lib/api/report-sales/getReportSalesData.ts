import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

export async function getReportSalesData(startDate: string, endDate: string) {
  try {
    const { data } = await axios.get(`/api/reports/sales`, {
      params: {
        startDate,
        endDate,
      },
    });

    return data;
  } catch (error) {
    console.error(error);
    if (isAxiosError(error)) {
      const data = error.response?.data;

      toast.error(data.message ?? "Terjadi kesalahan");
    }
    throw error;
  }
}
