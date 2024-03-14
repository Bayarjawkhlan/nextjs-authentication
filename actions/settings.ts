"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { update } from "@/auth";

import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

import { TSettingsSchema } from "@/schemas";

export const settings = async (values: TSettingsSchema) => {
  const sessionUser = await currentUser();

  if (!sessionUser) {
    return { error: "Unauthorized" };
  }

  const user = await getUserById(sessionUser.id);

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (sessionUser.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser) {
      return {
        error: "Email already in use",
      };
    }

    // const verificationToken = await generateVerificationToken(values.email);

    // await sendVerificationEmail({
    //   email: verificationToken.email,
    //   token: verificationToken.token,
    // });

    // return {
    //   success: "Verification email sent.",
    // };
  }

  if (values.password && values.newPassword && user.password) {
    const isMatch = await bcrypt.compare(values.password, user.password);

    if (!isMatch) {
      return {
        error: "Incorect Password.",
      };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  const newUser = await db.user.update({
    where: { id: user.id },
    data: {
      ...values,
    },
  });

  update({
    user: {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isTwoFactorEnabled: newUser.isTwoFactorEnabled,
    },
  });

  return { success: "settings updated." };
};
