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
      .max(150, { message: "Message must be at most 150 characters" }),
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

const MAX_FILE_SIZE = 512000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const imageSchema = z.object({
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 512 KB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are allowed."
    ),
});

export const dataUrlSchema = z.string().refine(
  (dataUrl) => {
    if (!dataUrl.startsWith("data:image/")) {
      return false;
    }

    const format = dataUrl.slice(5, dataUrl.indexOf(";"));
    return ACCEPTED_IMAGE_TYPES.includes(format);
  },
  {
    message:
      "Only .jpg, .jpeg, .png and .webp formats are allowed.",
  }
);
