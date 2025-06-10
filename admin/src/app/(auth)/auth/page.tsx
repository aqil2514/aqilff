import AuthTemplate from "@/components/templates/Authentication/AuthTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default async function AuthPage() {
  
  return <AuthTemplate />;
}
