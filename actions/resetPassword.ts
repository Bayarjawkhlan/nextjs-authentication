"use server";

import * as z from "zod";
import { getUserByEmail } from "@/data/user";
import { ResetPasswordSchema } from "@/schemas";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>,
) => {
  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid Email!",
    };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      error: "Email not found!",
    };
  }

  const verificationToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail({ email, token: verificationToken.token });

  return {
    success: "Resent email sent!",
  };
};
