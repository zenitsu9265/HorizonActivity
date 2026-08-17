import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your HorizonActivity account to manage bookings and your wallet.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const redirect = params.redirect ?? "/";

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-16">
      <Suspense fallback={null}>
        <LoginForm redirect={redirect} />
      </Suspense>
    </div>
  );
}
