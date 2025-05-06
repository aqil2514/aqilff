import { supabase } from "@/lib/supabaseClient";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const text = await req.text();
  const params = new URLSearchParams(text);

  const email = params.get("email");
  const password = params.get("password");
  const role = params.get("role") ?? "user"; // default "user"

  if (!email || !password) {
    return new Response("Email and password required", { status: 400 });
  }

  // 1. Signup
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signupError) {
    return new Response(signupError.message, { status: 400 });
  }

  const user = signupData.user;
  if (!user) {
    return new Response("User creation failed", { status: 500 });
  }

  // 2. Insert role ke tabel profiles
  const { error: profileError } = await supabase
    .from("profiles")
    .insert([{ id: user.id, email, role }]);

  if (profileError) {
    return new Response("Failed to save user role", { status: 500 });
  }

  return new Response("User registered with role successfully", { status: 200 });
}
