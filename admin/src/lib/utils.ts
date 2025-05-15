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
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}