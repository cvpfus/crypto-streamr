"use server";

import { AccountAddress } from "@aptos-labs/ts-sdk";
import { signIn } from "@/auth";
import db from "./db";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getUserByAddress } from "./data";
import { dataUrlSchema, formSchema, TipFormData, User } from "./definitions";
import { cookies } from "next/headers";
import { encrypt, S3 } from "./utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createId } from "@paralleldrive/cuid2";
import sharp from "sharp";
import { revalidatePath } from "next/cache";

export interface Message {
  message: string | null;
  isError: boolean;
  isExist?: boolean;
  result?: User;
}

export async function registerWallet(
  _prevState: Message,
  formData: FormData
): Promise<Message> {
  const parsedFormData = z
    .object({
      address: z.string(),
      username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(10, { message: "Username must be at most 10 characters" }),
    })
    .safeParse({
      address: formData.get("address"),
      username: formData.get("username"),
    });

  if (!parsedFormData.success) {
    return { message: "Invalid form data", isError: true };
  }

  const { address, username } = parsedFormData.data;

  const isValid = AccountAddress.isValid({
    input: address,
    strict: true,
  }).valid;

  if (!isValid) {
    return { message: "Invalid address", isError: true };
  }

  try {
    await db.user.create({
      data: {
        address,
        username,
        userImageUrl: `https://ui-avatars.com/api/?name=${username}&size=120&background=random`,
        alertSetting: {
          create: {},
        },
      },
    });
  } catch (error: unknown) {
    return { message: error instanceof Error ? error.message : "Something went wrong", isError: true };
  }

  return {
    message: "Account created successfully. You can now login.",
    isError: false,
  };
}

export async function login(
  address: string,
  publicKey: string,
  message: string,
  signature: string
): Promise<Message> {
  try {
    await signIn("credentials", {
      address,
      publicKey,
      message,
      signature,
      redirectTo: "/dashboard",
    });
  } catch (_error) {
    return { message: "Login failed", isError: true };
  } finally {
    redirect("/dashboard");
  }
}

export async function redirectToRegisterOrLogin(
  address: string | undefined
): Promise<Message> {
  if (!address) {
    return { message: "No address provided", isError: true };
  }

  let user: User | null = null;

  try {
    user = await getUserByAddress(address);
  } catch (error: unknown) {
    return { message: error instanceof Error ? error.message : "Something went wrong", isError: true };
  }

  if (!user) {
    const token = await encrypt({ isExist: false });

    cookies().set("CryptoStreamr", token, {
      httpOnly: true,
    });

    return { message: "User not found", isError: false, isExist: false };
  }

  const token = await encrypt({ isExist: true });

  cookies().set("CryptoStreamr", token, {
    httpOnly: true,
  });

  return { message: "User found", isError: false, isExist: true };
}

export async function triggerTestNotification(
  userId: string
): Promise<Message> {
  try {
    const userHistory = await db.history.findFirst({
      where: {
        isTest: true,
        userId,
      },
    });

    if (!userHistory) {
      await db.history.create({
        data: {
          sender: "CryptoStreamr",
          message: "This is just a test notification.",
          amount: 100,
          isTest: true,
          userId,
        },
      });
    } else {
      await db.history.update({
        where: {
          id: userHistory.id,
        },
        data: {
          updatedAt: new Date(),
        },
      });
    }

    return { message: "Test notification triggered", isError: false };
  } catch (_error) {
    return { message: "Failed to trigger test notification", isError: true };
  }
}

export async function triggerNotification({
  formData,
  username,
}: {
  formData: TipFormData;
  username: string;
}) {
  try {
    const parsedFormData = formSchema.safeParse(formData);

    if (!parsedFormData.success) {
      return { message: "Invalid form data", isError: true };
    }

    const { name, amount, message, anonymous } = parsedFormData.data;

    const user = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return { message: "User not found", isError: true };
    }

    await db.history.create({
      data: {
        sender: anonymous ? "Anonymous" : name,
        amount,
        message,
        userId: user.id,
      },
    });
  } catch (_error) {
    return { message: "Failed to trigger notification", isError: true };
  }
}

export async function uploadImage(
  dataUrl: string,
  userId: string
): Promise<Message> {
  const parsedDataUrl = dataUrlSchema.safeParse(dataUrl);

  if (!parsedDataUrl.success) {
    return { message: "Invalid data URL", isError: true };
  }

  const imageFormat = dataUrl.slice(5, dataUrl.indexOf(";"));

  const imagePath = `profile-pictures/${createId()}.${
    imageFormat.split("/")[1]
  }`;

  const originalBuffer = Buffer.from(dataUrl.split(",")[1], "base64");

  const resizedBuffer = await sharp(originalBuffer).resize(150, 150).toBuffer();

  try {
    await S3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: imagePath,
        Body: resizedBuffer,
        ContentType: imageFormat,
      })
    );

    const result = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        userImageUrl: `https://storage2.cvpfus.xyz/${imagePath}`,
      },
    });

    revalidatePath("/settings");

    return {
      message: "Profile picture updated successfully",
      isError: false,
      result,
    };
  } catch (error: unknown) {
    return {
      message: error instanceof Error ? error.message : "Failed to update profile picture",
      isError: true,
    };
  }
}

export async function updateUsername(
  username: string,
  userId: string
): Promise<Message> {
  try {
    const parsedUsername = z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(10, { message: "Username must be at most 10 characters" })
      .safeParse(username);

    if (!parsedUsername.success) {
      return { message: parsedUsername.error.message, isError: true };
    }

    const user = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      return { message: "Username already exists", isError: true };
    }

    await db.user.update({
      where: { id: userId },
      data: { username },
    });

    return {
      message: "Username updated successfully",
      isError: false,
    };
  } catch (error: unknown) {
    return {
      message: error instanceof Error ? error.message : "Failed to update username",
      isError: true,
    };
  }
}
