import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Metadata } from "next";
import Alert from "@/components/alert/alert";
import Profile from "./profile";

export const metadata: Metadata = {
  title: "Settings",
};

export default function Settings() {
  return (
    <Tabs defaultValue="alert">
      <TabsList>
        <TabsTrigger value="alert">Alert</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>
      <TabsContent value="alert">
        <Alert />
      </TabsContent>
      <TabsContent value="profile">
        <Profile />
      </TabsContent>
    </Tabs>
  );
}
