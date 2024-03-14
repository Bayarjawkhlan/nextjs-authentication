"use client";

import { useCurrentRole } from "@/hooks/useCurrentRole";

import FormError from "../FormError";

import { UserRole } from "@prisma/client";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="you don't have a permission to view this content!" />
    );
  }

  return <>{children}</>;
};
