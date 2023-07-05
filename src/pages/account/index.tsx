import React from "react";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

const Account = () => {
  const { data: sessionData } = useSession();
  const userId = sessionData ? sessionData.user.id : "";

  const { data: profile } = api.users.getById.useQuery({ id: userId });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      Account
    </div>
  );
};

export default Account;
