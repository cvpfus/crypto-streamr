import SideNav from "@/components/side-nav";
import { WalletSelector } from "@/components/wallet-selector";
import Connect from "./connect";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <SideNav />
      <div className="flex flex-col w-full mx-4">
        <div className="flex justify-end mt-4 ">
          <WalletSelector />
        </div>
        <Connect>{children}</Connect>
      </div>
    </div>
  );
}
