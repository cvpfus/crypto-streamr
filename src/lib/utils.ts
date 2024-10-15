import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { S3Client } from "@aws-sdk/client-s3";

const secretKey = process.env.SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(key);
}

export async function decrypt(input: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });

  return payload;
}

export const S3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});
