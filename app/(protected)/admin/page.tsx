"use client";

import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { RoleGate } from "@/components/protected/RoleGate";
import FormSuccess from "@/components/FormSuccess";
import { Button } from "@/components/ui/Button";
import { admin } from "@/actions/admin";

const AdminPage = () => {
  const onApiRouteClick = async () => {
    fetch("/api/admin").then((res) => {
      if (res.ok) {
        toast.success("Allowed API route");
      } else {
        toast.error("Forbidden API route");
      }
    });
  };

  const onServerActionClick = async () => {
    admin().then((data) => {
      if (data.success) {
        toast.success(data.success);
      }
      if (data.error) {
        toast.error(data.error);
      }
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">🔑 Admin</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <RoleGate allowedRole="ADMIN">
          <FormSuccess message="You are allowed to see this content!" />
        </RoleGate>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API route</p>
          <Button onClick={onApiRouteClick}>Click to reset</Button>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerActionClick}>Click to reset</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
