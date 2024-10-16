import { auth, signOut } from "../auth";
import Image from "next/image";
import { getUserImageUrl } from "@/lib/data";
import { Button } from "./ui/button";
import SideNavItems from "./side-nav-items";
import { LogOut } from "lucide-react";

export default async function SideNav() {
  const session = await auth();
  const username = session?.user?.username;

  const userImageUrl = await getUserImageUrl(username);

  return (
    <div className="w-auto sm:w-64 border shadow-xl rounded-r-xl flex flex-col items-center gap-4 p-2">
      <Image
        src={userImageUrl}
        alt="avatar"
        width={80}
        height={80}
        className="size-8 sm:size-20 rounded-full mt-4"
      />
      <div className="hidden sm:block">{username}</div>
      <SideNavItems />
      <div className="grow" />
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        {username && (
          <Button className="w-full sm:w-48 mb-4 flex items-center justify-start gap-2">
            <LogOut className="size-4" />
            <span className="hidden sm:block">Log out</span>
          </Button>
        )}
      </form>
    </div>
  );
}
