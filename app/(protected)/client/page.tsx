"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

import { UserInfo } from "@/components/protected/UserInfo";

const ClientPage = () => {
  const user = useCurrentUser();

  return <UserInfo label="💻 Client component" user={user} />;
};

export default ClientPage;
