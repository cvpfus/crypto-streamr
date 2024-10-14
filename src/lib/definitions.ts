import type { User as UserType } from "@prisma/client";
import { z } from "zod";

export type User = UserType;

export const formSchema = z
  .object({
    name: z.string(),
    amount: z.coerce
      .number()
      .min(0.001, { message: "Amount must be at least 0.001" }),
    message: z
      .string()
      .min(1, { message: "Message must be at least 1 character" })
      .max(255, { message: "Message must be at most 255 characters" }),
    anonymous: z.boolean(),
  })
  .refine(
    ({ anonymous, name }) => {
      if (!anonymous && name.length === 0) {
        return false;
      }
      return true;
    },
    {
      message: "Name must be at least 1 character",
      path: ["name"],
    }
  );

export type TipFormData = z.infer<typeof formSchema>;
