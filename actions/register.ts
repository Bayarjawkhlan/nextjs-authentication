"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

import { RegisterSchema } from "@/schemas";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { getVerificationTokenByEmail } from "@/data/verificationToken";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedField = RegisterSchema.safeParse(values);

  if (!validatedField.success) {
    return {
      error: "Invalid Fields!",
    };
  }

  const { email, name, password } = validatedField.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser && !existingUser.emailVerified) {
    const existingToken = await getVerificationTokenByEmail(email);

    if (!existingToken) {
      return {
        error: "Email already in use!",
      };
    }

    await sendVerificationEmail({ email, token: existingToken.token });
    return {
      success: "Confirmation Email sent!",
    };
  }

  if (existingUser) {
    return {
      error: "Email already in use!",
    };
  }

  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail({ email, token: verificationToken.token });

  return {
    success: "Confirmation Email sent!",
  };
};
