import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "./supabaseClient";
import { User } from "@/@types/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getUserWithRole() {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;

  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Gagal mengambil role:", profileError.message);
    return { ...user, role: null };
  }

  return {
    ...user,
    role: profile.role,
    full_name: profile.full_name,
    nick_name: profile.nick_name,
  } as User;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Gagal logout:", error.message);
    throw error;
  }
  window.location.replace("/");
}

// PRODUCT UTILS
export function formatToRupiah(amount: number | string): string {
  let formattedAmount: number;

  if (typeof amount === "number") {
    formattedAmount = amount;
  } else {
    formattedAmount = Number(amount);
    if (isNaN(formattedAmount)) {
      throw new Error("Kesalahan input: Tidak bisa di-convert ke tipe nomor");
    }
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(formattedAmount);
}

export function formatToIndonesianDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatToIndonesianDateTime(dateString: string): string {
  const date = new Date(dateString);

  const optionsDate: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  };

  const formattedDate = new Intl.DateTimeFormat("id-ID", optionsDate).format(date);

  // Cek apakah waktu valid dan bukan jam 00:00 (opsional, bisa dikustom)
  const hasTime = date.getUTCHours() !== 0 || date.getUTCMinutes() !== 0;

  if (hasTime) {
    const formattedTime = new Intl.DateTimeFormat("id-ID", optionsTime).format(date);
    return `${formattedDate} ${formattedTime}`;
  }

  return formattedDate;
}


/**
 * Generate human readable transaction code.
 * Format: TRX-YYYYMMDD-XXXX (e.g. TRX-20250519-0001)
 *
 * @param lastCodeToday - kode transaksi terakhir hari ini, jika ada (e.g. "TRX-20250519-0003")
 * @returns string - kode transaksi baru
 */
export function generateTransactionCode(
  dateStr: string,
  lastCodeToday?: string
): string {
  let nextNumber = 1;

  if (lastCodeToday && lastCodeToday.includes(dateStr)) {
    const parts = lastCodeToday.split("-");
    const lastNumber = parseInt(parts[2], 10);
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  const paddedNumber = nextNumber.toString().padStart(4, "0");
  return `TRX-${dateStr}-${paddedNumber}`;
}

export function getLocalDateTimeValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${date}T${hours}:${minutes}`;
}
