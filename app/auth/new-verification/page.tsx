"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "sonner";

import { newVerification } from "@/actions/newVerification";

import { CardWrapper } from "@/components/auth/CardWrapper";
import FormError from "@/components/FormError";

const NewVerificationPage = () => {
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (error) return;

    if (!token) {
      setError("Token missing!");
      return;
    }

    newVerification(token)
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          return router.push("/auth/login");
        }

        setError(data.error);
      })
      .catch(() => setError("Something went wrong!"));
  }, [token, error, router]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full items-center justify-center">
        {!error && <BeatLoader />}
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};

export default NewVerificationPage;
