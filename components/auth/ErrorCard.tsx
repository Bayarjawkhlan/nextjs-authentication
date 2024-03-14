"use client";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardWrapper } from "./CardWrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      headerLabel="Oops! Something went wrong"
    >
      <div className="flex justify-center">
        <ExclamationTriangleIcon className=" text-red-500" />
      </div>
    </CardWrapper>
  );
};
