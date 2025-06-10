import RegisterTemplate from "@/components/templates/Authentication/RegisterTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return <RegisterTemplate />;
}
