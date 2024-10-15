import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Metadata } from "next";
import Alert from "@/components/alert/alert";
import Profile from "@/components/profile/profile";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Settings() {
  const session = await auth();
  const userId = session?.user?.id;
  let imageUrl = session?.user?.userImageUrl;

  if (!userId) {
    throw new Error("User not found");
  }

  if (!imageUrl) {
    imageUrl = `https://api.dicebear.com/6.x/thumbs/png?seed=${userId}`;
  }

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
        <Profile userId={userId} imageUrl={imageUrl} />
      </TabsContent>
    </Tabs>
  );
}
