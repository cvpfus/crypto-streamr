import Link from "next/link";
import { Button } from "./ui/button";
import { signOut } from "../auth";

export default function SideNav() {
  return (
    <div className="w-64 border shadow-xl rounded-r-xl flex flex-col items-center gap-4">
      <div className="rounded-full size-20 bg-gray-100 mt-4"></div>
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
