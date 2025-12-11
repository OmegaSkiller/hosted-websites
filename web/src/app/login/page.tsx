import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | Hosted By CodeChameleon",
};

export default function LoginPage() {
  return <LoginForm />;
}

