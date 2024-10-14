"use client";

import { Button } from "../ui/button";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  AccountInfo,
  AptosSignMessageOutput,
  UserResponse,
  UserResponseStatus,
} from "@aptos-labs/wallet-standard";
import {
  AnyPublicKey,
  AnyPublicKeyVariant,
  MultiEd25519Signature,
} from "@aptos-labs/ts-sdk";
import { toast } from "@/hooks/use-toast";
import { login } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const { account: walletAccount, wallet, wallets } = useWallet();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      if (!walletAccount) {
        toast({
          title: "Error",
          description: "Login failed. Make sure you are connected to a wallet.",
          variant: "destructive",
        });

        return;
      }

      const currentWallet = wallets?.find((w) => w.name === wallet?.name);

      if (!currentWallet) {
        toast({
          title: "Error",
          description: "Wallet not found",
          variant: "destructive",
        });
        return;
      }


      if ("account" in currentWallet) {
        const result = (await currentWallet.signMessage({
          message: "Login to CryptoStreamr",
          nonce: Date.now().toString(),
        })) as UserResponse<AptosSignMessageOutput>;

        if (result.status === UserResponseStatus.REJECTED) {
          toast({
            title: "Error",
            description: "Failed to sign a message",
            variant: "destructive",
          });
          return;
        }

        const account = (await currentWallet.account!()) as AccountInfo;

        if (
          account.publicKey instanceof AnyPublicKey &&
          account.publicKey.variant === AnyPublicKeyVariant.Keyless
        ) {
          toast({
            title: "Error",
            description: "Unsupported wallet",
            variant: "destructive",
          });
          return null;
        }

        if (
          currentWallet?.isAIP62Standard &&
          !(result.args.signature instanceof MultiEd25519Signature)
        ) {
          await login(
            walletAccount.address,
            account.publicKey.toString(),
            result.args.fullMessage,
            result.args.signature.toString()
          );
        } else {
          toast({
            title: "Error",
            description: "Unsupported wallet",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full justify-center items-center">
      <span>Login to your account by signing a message.</span>
      <Button
        className="flex gap-2 w-28"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="animate-spin size-4" />}
        <span>Login</span>
      </Button>
    </div>
  );
}
