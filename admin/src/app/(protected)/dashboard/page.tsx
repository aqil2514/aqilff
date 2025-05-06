import { supabase } from "@/lib/supabaseClient";

export default async function DashboardPage() {
  const user = await supabase.auth.getUser();
  console.log(user);
  return <div>Dashboard</div>;
}
