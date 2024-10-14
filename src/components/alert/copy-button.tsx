"use client";

import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

export default function CopyButton({ text }: { text: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: "Copied to clipboard",
      });
    } catch (_error) {
      toast({
        title: "Failed",
        description: "Failed to copy",
        variant: "destructive",
      });
    }
  };

  return <Button onClick={handleCopy}>Copy</Button>;
}
