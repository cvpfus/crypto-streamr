"use client";

import { triggerTestNotification } from "@/lib/actions";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";

export default function TriggerButton({ userId }: { userId: string }) {

  const handleTriggerNotification = async () => {
    try {
      const response = await triggerTestNotification(userId);
      if (response.isError) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: response.message,
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button onClick={handleTriggerNotification}>Trigger Notification</Button>
    </>
  );
}
