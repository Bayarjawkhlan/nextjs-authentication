"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { db } from "@/lib/db";

import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/twoFactorToken";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl: string | null,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid Fields!",
    };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: "Email does not exist!",
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail({ email, token: verificationToken.token });

    return {
      success: "Confirmation email sent!",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return {
          error: "Invalid Code!",
        };
      }

      if (twoFactorToken.token !== code) {
        return {
          error: "Invalid Code!",
        };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return {
          error: "Code expired!",
        };
      }

      await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

      const existingConfirmation = await db.twoFactorConfirmation.findUnique({
        where: {
          userId: existingUser.id,
        },
      });

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingUser.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(email);

      await sendTwoFactorTokenEmail({
        email: twoFactorToken.email,
        token: twoFactorToken.token,
      });

      return {
        twoFactor: true,
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Email does not exist!",
          };
        case "AuthorizedCallbackError":
          return {
            error: "You must be verified your email.",
          };
        default:
          return {
            error: "Some went wrong!",
          };
      }
    }

    throw error;
  }
};
