import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { auth } from "@/auth";
import CopyButton from "../copy-button";
import TriggerButton from "./trigger-button";
import { getAlertIdByUserId } from "@/lib/data";
import { headers } from "next/headers";

export default async function Alert() {
  const session = await auth();

  const headersList = headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  if (!session?.user?.id) {
    throw new Error("User not found");
  }

  const alertId = await getAlertIdByUserId(session?.user?.id);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Alert URL</CardTitle>
          <CardDescription>
            Copy this URL and paste it to the OBS Browser Source.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input value={`${baseUrl}/alert/${alertId}`} readOnly />
            <CopyButton text={`${baseUrl}/alert/${alertId}`} />
            <TriggerButton userId={session?.user?.id} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sound Notification</CardTitle>
          <CardDescription>Coming soon.</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Widget Customization</CardTitle>
          <CardDescription>Coming soon.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
