import SessionWrapper from "@/providers/session-wrapper";
import { Toaster } from "../components/ui/toaster";
import WalletProvider from "../components/wallet-provider";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | CryptoStreamr",
    default: "CryptoStreamr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <SessionWrapper>
          <WalletProvider>{children}</WalletProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
