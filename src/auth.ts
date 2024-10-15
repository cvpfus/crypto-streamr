import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { Ed25519PublicKey, Ed25519Signature } from "@aptos-labs/ts-sdk";
import { decrypt } from "./lib/utils";
import db from "./lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        token = { ...token, ...session.user };
      }

      return { ...token, ...user };
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    },
    async authorized({ auth, request: { nextUrl, cookies } }) {
      const isLoggedIn = !!auth?.user;

      const isOnRegister = nextUrl.pathname.startsWith("/register");
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (!isLoggedIn && !isOnRegister && !isOnLogin) {
        const token = cookies.get("CryptoStreamr")?.value;

        if (token) {
          const payload = await decrypt(token);

          if (!payload.isExist) {
            return Response.redirect(new URL("/register", nextUrl));
          }

          return Response.redirect(new URL("/login", nextUrl));
        }
      }

      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnHistory = nextUrl.pathname.startsWith("/history");
      const isOnSettings = nextUrl.pathname.startsWith("/settings");

      if (isOnDashboard || isOnHistory || isOnSettings) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isLoggedIn) {
        return false;
      }

      return true;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            address: z.string(),
            publicKey: z.string(),
            message: z.string(),
            signature: z.string(),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { address, publicKey, message, signature } =
            parsedCredentials.data;

          const isVerified = new Ed25519PublicKey(publicKey).verifySignature({
            message: new TextEncoder().encode(message),
            signature: new Ed25519Signature(signature),
          });

          if (!isVerified) {
            return null;
          }

          const user = await db.user.findUnique({
            where: { address },
          });

          console.log("user", user);

          return user;
        }

        return null;
      },
    }),
  ],
});
