import { supabase } from "@/lib/supabaseClient";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const {data, error} = await supabase.auth.signInWithPassword({
    email: username,
    password,
  });

  console.log(data);
  console.log(error);

  return new Response();
}
