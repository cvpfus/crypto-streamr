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
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
