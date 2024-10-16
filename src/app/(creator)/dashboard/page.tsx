import { auth } from "@/auth";
import CopyButton from "@/components/copy-button";
import History from "@/components/history/history";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Dashboard() {
  const session = await auth();

  const headersList = headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const username = session?.user?.username;

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="font-bold block sm:hidden">Dashboard</div>
      <Card>
        <CardHeader>
          <CardTitle>Tip URL</CardTitle>
          <CardDescription>Use this URL to receive tips</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Input readOnly value={`${baseUrl}/tip/${username}`} />
          <CopyButton text={`${baseUrl}/tip/${username}`} />
        </CardContent>
      </Card>
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Total Tips Received</CardTitle>
          </CardHeader>
          <CardContent>1000 APT</CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Highest Tip Received</CardTitle>
          </CardHeader>
          <CardContent>100 APT</CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Total Tippers</CardTitle>
          </CardHeader>
          <CardContent>250</CardContent>
        </Card>
      </div>
      <History />
    </div>
  );
}
