"use client";

import Link from "next/link";

import { Button } from "../ui/Button";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button variant={"link"} size={"sm"} asChild className="w-full font-normal">
      <Link href={href} className="">
        {label}
      </Link>
    </Button>
  );
};
