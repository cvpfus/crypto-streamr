"use server";

import { AccountAddress } from "@aptos-labs/ts-sdk";
import { signIn } from "@/auth";
import db from "./db";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getUser } from "./data";
import { formSchema, TipFormData, User } from "./definitions";
import { cookies } from "next/headers";
import { encrypt } from "./utils";

export interface Message {
  message: string | null;
  isError: boolean;
  isExist?: boolean;
}

export async function registerWallet(
  _prevState: Message,
  formData: FormData
): Promise<Message> {
  const parsedFormData = z
    .object({
      address: z.string(),
      username: z.string().min(5),
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
      },
    });
  } catch (error: any) {
    return { message: error.message, isError: true };
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
    user = await getUser(address);
  } catch (error: any) {
    return { message: error.message || "Something went wrong", isError: true };
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

export async function triggerTestNotification(): Promise<Message> {
  try {
    const admin = await db.history.findFirst({
      where: { isTest: true },
    });

    if (!admin) {
      return { message: "Failed to trigger test notification", isError: true };
    }

    await db.history.update({
      where: {
        id: admin?.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });

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
