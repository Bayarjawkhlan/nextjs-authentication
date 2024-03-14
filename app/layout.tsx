import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next-auth V5",
  description: "Auth tutorial from Antonio",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <html lang="en">
      <body className={font.className}>
        <SessionProvider session={session}>
          {children}

          <Toaster richColors />
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
