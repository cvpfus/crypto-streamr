import Link from "next/link";
import { Button } from "./ui/button";
import { auth, signOut } from "../auth";
import Image from "next/image";
import { getUserImageUrl } from "@/lib/data";

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
      <Link href="/dashboard">
        <Button className="w-48">Dashboard</Button>
      </Link>
      <Link href="/settings">
        <Button className="w-48">Settings</Button>
      </Link>
      <div className="grow" />
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <Button className="w-48 mb-4">Log out</Button>
      </form>
    </div>
  );
}
