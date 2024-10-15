import History from "@/components/history/history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex gap-4">
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
