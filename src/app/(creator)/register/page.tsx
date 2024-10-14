import RegisterForm from "@/components/creator/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-2 w-full h-full justify-center items-center">
      <span>Please register your wallet first.</span>
      <RegisterForm />
    </div>
  );
}