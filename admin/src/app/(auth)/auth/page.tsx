import AuthTemplate from "@/components/templates/AuthTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function AuthPage() {
  return <AuthTemplate />;
}
