"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { imageSchema } from "@/lib/definitions";
import { updateUsername, uploadImage } from "@/lib/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function generateDataUrl(file: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

export default function Profile({
  userId,
  imageUrl,
}: {
  userId: string;
  imageUrl: string;
}) {
  const [isLoading, setIsLoading] = useState({
    profilePhoto: false,
    username: false,
  });
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  const router = useRouter();

  const { data, update } = useSession();

  const handleUpdateUsername = async () => {
    try {
      if (username) {
        setIsLoading({ ...isLoading, username: true });

        const { message, isError } = await updateUsername(username, userId);

        if (isError) {
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });

          return;
        }

        await update({
          ...data,
          user: { ...data?.user, username },
        });

        router.refresh();

        toast({
          title: "Success",
          description: "Username updated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading({ ...isLoading, username: false });
      setUsername("");
    }
  };

  const handleUpdateImage = async () => {
    if (dataUrl) {
      setIsLoading({ ...isLoading, profilePhoto: true });

      try {
        const { message, isError, result } = await uploadImage(dataUrl, userId);

        if (isError) {
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });

          return;
        }

        if (result) {
          await update({
            ...data,
            user: { ...data?.user, userImageUrl: result.userImageUrl },
          });

          router.refresh();
        }

        toast({
          title: "Success",
          description: "Profile picture updated",
        });

        setDataUrl(null);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setIsLoading({ ...isLoading, profilePhoto: false });
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });

      return;
    }

    const parsedImage = imageSchema.safeParse({ image: file });

    if (!parsedImage.success) {
      toast({
        title: "Error",
        description: parsedImage.error?.flatten().fieldErrors.image?.join("\n"),
        variant: "destructive",
      });

      return;
    }

    try {
      const dataUrl = await generateDataUrl(file);
      setDataUrl(dataUrl);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Image
              src={imageUrl}
              alt="avatar"
              width={80}
              height={80}
              className="size-20 rounded-full"
            />
            <div className="flex flex-col gap-2 w-full">
              <Input
                type="file"
                accept=".jpg, .jpeg, .png, .webp"
                onChange={handleFileChange}
              />
              <Button
                className="flex items-center gap-2"
                disabled={isLoading.profilePhoto}
                onClick={handleUpdateImage}
              >
                {isLoading.profilePhoto && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                <span>Update</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Username</CardTitle>
            <CardDescription>Update your username</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              className="flex items-center gap-2"
              disabled={isLoading.username}
              onClick={handleUpdateUsername}
            >
              {isLoading.username && (
                <Loader2 className="size-4 animate-spin" />
              )}
              <span>Update</span>
            </Button>
          </CardContent>
        </Card>
        {/* TODO: Add tip description */}
        {/* <Card className="w-full">
          <CardHeader>
            <CardTitle>Tip description</CardTitle>
            <CardDescription>Update your tip description</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Tip description"
              value={tipDescription}
              onChange={(e) => setTipDescription(e.target.value)}
            />
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
