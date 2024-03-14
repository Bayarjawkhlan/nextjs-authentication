"use client";

import { ExtendedUser } from "@/types/next-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "../ui/Badge";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader className="text-center text-2xl font-semibold">
        {label}
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">ID</p>
          <p className="max-w-[180px] truncate text-xs">{user?.id}</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Name</p>
          <p className="max-w-[180px] truncate text-xs">{user?.name}</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Email</p>
          <p className="max-w-[180px] truncate text-xs">{user?.email}</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Role</p>
          <p className="max-w-[180px] truncate text-xs">{user?.role}</p>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Two Factor Authentication</p>
          <Badge
            className="max-w-[180px] truncate text-xs"
            variant={user?.isTwoFactorEnabled ? "success" : "destructive"}
          >
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
