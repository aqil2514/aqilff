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
