import AuthTemplate from "@/components/templates/AuthTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default async function AuthPage() {
  
  return <AuthTemplate />;
}
