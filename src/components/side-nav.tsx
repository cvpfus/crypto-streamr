
import { auth, signOut } from "../auth";
import Image from "next/image";
import { getUserImageUrl } from "@/lib/data";
import { Button } from "./ui/button";
import SideNavItems from "./side-nav-items";


export default async function SideNav() {
  const session = await auth();
  const username = session?.user?.username;

  const userImageUrl = await getUserImageUrl(username);

  return (
    <div className="w-64 border shadow-xl rounded-r-xl flex flex-col items-center gap-4">
      <Image
        src={userImageUrl}
        alt="avatar"
        width={80}
        height={80}
        className="size-20 rounded-full mt-4"
      />
      <div>{username}</div>
      <SideNavItems/>
      <div className="grow" />
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        {username && <Button className="w-48 mb-4">Log out</Button>}
      </form>
    </div>
  );
}
