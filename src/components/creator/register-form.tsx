"use client";

import { useActionState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { registerWallet, Message } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const { account } = useWallet();

  const router = useRouter();

  const initialState: Message = { message: null, isError: false };

  const [state, formAction, isPending] = useActionState(
    registerWallet,
    initialState
  );

  if (state.isError) {
    toast({
      title: "Error",
      description: state.message,
      variant: "destructive",
    });
  }

  if (!state.isError && state.message) {
    toast({
      title: "Success",
      description: state.message,
    });

    router.push("/login");
  }

  return (
    <form action={formAction} >
      <input type="hidden" name="address" defaultValue={account?.address} />
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Username"
          name="username"
          autoComplete="off"
          required
          minLength={5}
          className="max-w-[160px]"
        />
        <Button className="flex gap-2 w-28" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin size-4" />}
          <span>Register</span>
        </Button>
      </div>
    </form>
  );
}
