"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function Connect({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const { connected } = useWallet();

  return (
    <>
      {!connected && (
        <div className="flex h-full items-center justify-center">
          <span>Please connect your wallet.</span>
        </div>
      )}
      {connected && children}
    </>
  );
}
