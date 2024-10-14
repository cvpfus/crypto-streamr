"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { toast } from "../hooks/use-toast";

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network: Network.TESTNET }}
      onError={(error) => {
        toast({
          title: "Error",
          description: error || "Something went wrong",
          variant: "destructive",
        });
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
